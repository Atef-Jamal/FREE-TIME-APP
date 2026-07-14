import z from "zod";
import { authSchema } from ".";

export type AuthFormValues = z.infer<typeof authSchema>;
