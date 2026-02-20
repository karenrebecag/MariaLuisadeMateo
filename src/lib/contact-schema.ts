import { z } from "zod";

export const SUBJECT_VALUES = [
  "acquisition",
  "commission",
  "exhibition",
  "press",
  "other",
] as const;

export const contactSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  subject: z.enum(SUBJECT_VALUES),
  message: z.string().min(10).max(2000),
  recaptchaToken: z.string().min(1),
});

export type ContactFormData = z.infer<typeof contactSchema>;
