import z from "zod";

  export const createcategoryData = z.object({
    name: z.string(),
    image:z.any()
  }).strict()


export const UpdatecategoryData = z.object({
    name: z.string().optional(),
    image:z.any().optional()
  }).strict()