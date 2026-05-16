import { v4 as uuidv4 } from "uuid";

export const attachViewer = (req: any, res: any, next: any) => {
  const userId = req.user?.id;

  if (userId) {
    req.viewerId = userId;
    return next();
  }
  let guestId = req.cookies?.guestId;

  if (!guestId) {
    guestId = `guest_${uuidv4()}`;
    res.cookie("guestId", guestId, {
      httpOnly: true,
      secure: true,      // HTTPS only in production
      sameSite: "lax",
      maxAge: 1000 * 60 * 60 * 24 * 30, // 30 days
    });
  }

  req.viewerId = guestId;

  next();
};