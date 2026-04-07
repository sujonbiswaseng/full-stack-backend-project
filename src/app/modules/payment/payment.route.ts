// route for Participants module
import express from "express";
import auth from "../../middleware/Auth";
import { Role } from "../../../generated/prisma/enums";
import { PaymentController } from "./payment.controller";

const router = express.Router();
router.get("/payments/stripe-cancel", PaymentController.handleStripeCancelRedirect);

router.get("/payments/verify-success", async (req, res) => {
  try {
    const { paymentId, participantId } = req.query;

    if (!paymentId || !participantId) {
      return res.status(400).json({
        success: false,
        message: "paymentId and participantId are required",
      });
    }

    // Find the payment by id and participantId
    const payment = await require("../../lib/prisma").prisma.payment.findUnique({
      where: { id: paymentId as string },
      include: {
        participant: true,
        event: true,
      },
    });

    if (!payment || payment.participantId !== participantId) {
      return res.status(404).json({
        success: false,
        message: "Payment not found with provided paymentId and participantId",
      });
    }

    if (payment.status === "PAID") {
      return res.status(200).json({
        success: true,
        message: "Payment verified",
        data: {
          eventTitle: payment.event?.title || null,
          amount: payment.amount,
          status: payment.status,
          transactionId: payment.transactionId,
          participantId: payment.participantId,
          paymentId: payment.id,
        },
      });
    } else {
      return res.status(200).json({
        success: false,
        message: `Payment is not PAID (current status: ${payment.status})`,
      });
    }
  } catch (error) {
    console.error("Error in payment verify-success endpoint:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error during payment verification",
    });
  }
});




router.get("/payments", auth([Role.ADMIN]), PaymentController.getAllPayment);
router.patch(
  "/payments/:paymentId/status",
  auth([Role.ADMIN]),
  PaymentController.updatePaymentStatus
);
router.delete(
  "/payments/:paymentId",
  auth([Role.ADMIN]),
  PaymentController.deletePayment
);



export const PaymentRoutes=router