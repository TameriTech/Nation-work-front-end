import { z } from "zod"
import { Service } from "../types/services";

export const createServiceSchema = z.object({
  title: z.string().min(5),
  short_description: z.string().min(20).max(250),
  full_description: z.string().max(850).optional(),

  service_type: z.enum(["standard", "premium"]),
  category_id: z.number().int(),

  date_pratique: z.string(),
  start_time: z.string(),
  duration: z.string(),

  address: z.string(),
  city: z.string().optional(),

  required_skills: z.array(z.string()).optional(),
  proposed_amount: z.number().positive(),

  images: z.array(z.string()).optional(),
});

export interface ServiceFormWizardProps {
  mode: "create" | "edit";
  onSubmit: (data: Service) => void;
  onCancel: () => void;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
}


export const updateServiceSchema = z.object({
    title: z.string().min(2).max(100).optional(),
    short_description: z.string().min(2).max(200).optional(),
    full_description: z.string().min(2).max(1000).optional(),
    service_type: z.enum(["standard", "premium"]).optional(),
    category_id: z.number().min(1).optional(),
    date_pratique: z.string().min(10).max(10).optional(),
    start_time: z.string().min(5).max(5).optional(),
    duration: z.string().min(2).max(100).optional(),
    address: z.string().min(2).max(200).optional(),
    city: z.string().min(2).max(100).optional(),
    required_skills: z.array(z.string().min(2).max(100)).optional(),
    proposed_amount: z.number().min(0).optional(),
    status: z.enum(["published", "draft", "completed"]).optional(),
    images: z.array(z.file().mime('image/webp|image/jpeg|image/png')).optional(),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>