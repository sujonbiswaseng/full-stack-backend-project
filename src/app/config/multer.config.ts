// config/multer.config.ts
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinaryUpload } from "./cloudinary.config";

const storage = new CloudinaryStorage({
  cloudinary: cloudinaryUpload,
  params: async (req, file) => {
    const originalName = file.originalname;
    const extension = originalName.split(".").pop()?.toLowerCase();
    
    console.log(file,'fisdf')
    const fileNameWithoutExtension = originalName
      .split(".")
      .slice(0, -1)
      .join(".")
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9\-]/g, "");

    const uniqueName =
      Math.random().toString(36).substring(2) +
      "-" +
      Date.now() +
      "-" +
      fileNameWithoutExtension;

    const folder = extension === "pdf" ? "pdfs" : "images";

    return {
      folder: `lumen/${folder}`,
      public_id: uniqueName,
      resource_type: "auto",
      format: extension === "pdf" ? "pdf" : "webp",
      transformation:
        extension !== "pdf"
          ? [{ quality: "auto", fetch_format: "auto" }]
          : undefined,
    };
  },
});

export const multerUpload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 6,
  },
});