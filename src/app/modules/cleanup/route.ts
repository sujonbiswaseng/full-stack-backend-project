import express from "express";
import { prisma } from "../../lib/prisma";

const router = express.Router();

router.get("/cleanup", async (req, res) => {
  try {
    const deletedPayments = await prisma.payment.deleteMany({ where: { status: "UNPAID" } });
    const deletedParticipants = await prisma.participant.deleteMany({ where: { paymentStatus: "UNPAID" } });

    res.json({ deletedPayments, deletedParticipants });
  } catch (err) {
    console.error("Cleanup error:", err);
    res.status(500).json({ error: "Cleanup failed", details: err });
  }
});

export const CleanRouter=router;