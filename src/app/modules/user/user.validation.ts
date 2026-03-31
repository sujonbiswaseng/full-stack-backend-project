import z from "zod";

export const UpdateuserProfileData = z
    .object({
      name: z.string().optional(),
      image: z.string().optional(),
      bgimage: z.string().optional(),
      email: z.string().optional(),
      password: z.string().min(8).optional(),
      phone: z.string().min(10).max(15).optional(),
      isActive: z.boolean().optional(),
    })
    .strict();