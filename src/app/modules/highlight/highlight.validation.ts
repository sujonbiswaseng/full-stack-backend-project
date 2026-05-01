import { z } from "zod";

export const createHighlightSchema = z.object({
  title: z.string().min(1, { message: "Title is required." }),
  description: z.string().min(1, { message: "Description is required." }),
  image: z.string().url({ message: "Image must be a valid URL." }).optional().nullable(),
});

export const updateHighlightSchema = z
  .object({
    title: z.string().min(1, { message: "Title cannot be empty." }).optional(),
    description: z.string().min(1, { message: "Description cannot be empty." }).optional(),
    image: z.string().url({ message: "Image must be a valid URL." }).optional().nullable(),
  })
  .refine(
    data => Object.keys(data).length > 0,
    { message: "At least one field must be provided to update the highlight." }
  );