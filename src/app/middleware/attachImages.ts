// middlewares/attachImages.ts
import { Request, Response, NextFunction } from "express";

export const attachImagesToBody = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const files = req.files as Express.Multer.File[];

  if (files && files.length > 0) {
    const imageUrls = files.map((file: any) => file.path); // Cloudinary URL
    req.body.images = imageUrls;
  }

  next();
};