import { z } from "zod";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const baseSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const authSchema = z.discriminatedUnion("mode", [
  baseSchema.extend({
    mode: z.literal("login"),
  }),

  baseSchema
    .extend({
      mode: z.literal("register"),
      name: z.string().min(3, "Name must be at least 3 characters"),
      confirmPassword: z.string(),
      profilePicture: z
        .any()
        .optional()
        .refine((file) => {
          if (!file[0]) return true;
          return file[0].size <= MAX_FILE_SIZE;
        }, "Max image size is 2MB.")
        .refine((file) => {
          if (!file[0]) return true;
          return ACCEPTED_IMAGE_TYPES.includes(file[0].type);
        }, "Only .jpg, .png, and .webp formats are supported."),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
]);

export type AuthFormValues = z.infer<typeof authSchema>;
