import { z } from "zod";

export const serviceSchema = z.object({
  title: z.string().min(1, "Le titre est requis"),
  category: z.string().min(1, "Le type de service est requis"),
  shortDescription: z.string().max(250, "Maximum 250 caractères"),
  date: z.string().min(1, "La date est requise"),
  time: z.string().min(1, "L'heure est requise"),
  duration: z.string().min(1, "La durée est requise"),
  address: z.string().min(1, "L'adresse est requise"),
  skills: z.array(z.string()),
  proposedAmount: z.number().min(0, "Le montant doit être positif"),
  amountToPay: z.number().min(0, "Le montant doit être positif"),
  fullDescription: z.string().optional(),
});

export type Service = z.infer<typeof serviceSchema>;

export interface ServiceFormWizardProps {
  mode: "create" | "edit";
  defaultValues?: Partial<Service>;
  onSubmit: (data: Service) => void;
  onCancel: () => void;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
}

export const SERVICE_CATEGORIES = [
  "Développement",
  "Design",
  "Marketing",
  "Rédaction",
  "Traduction",
  "Consulting",
  "Formation",
  "Autre",
];

export const DURATION_OPTIONS = [
  { value: "30min", label: "30 minutes" },
  { value: "1h", label: "1 heure" },
  { value: "2h", label: "2 heures" },
  { value: "half-day", label: "Demi-journée" },
  { value: "full-day", label: "Journée" },
];