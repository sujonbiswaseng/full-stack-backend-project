import status from "http-status";
import z from "zod";
import { TErrorResponse, TErrorSources } from "../interface/error.interface";
import { deleteFileFromCloudinary } from "../config/cloudinary.config";

export const handleZodError = (err: z.ZodError): TErrorResponse => {
    const statusCode = status.BAD_REQUEST;
    const message = "Zod Validation Error";
    const errorSources: TErrorSources[] = [];

    err.issues.forEach(issue => {
        errorSources.push({
            message: issue.message
        })
    })

    for (const issue of err.issues) {
        if (issue.path && issue.path.includes("image")) {
            // Attempt to extract an image URL from the issue.message if present and matches a URL pattern
            const urlMatch = typeof issue.message === "string" ? issue.message.match(/https?:\/\/[^\s'"]+/) : null;
            if (urlMatch && urlMatch[0]) {
                const imageUrl = urlMatch[0];
                deleteFileFromCloudinary(imageUrl).catch(() => {});
            }
        }
    }

    return {
        success: false,
        message,
        errorSources,
        statusCode,
    }
}