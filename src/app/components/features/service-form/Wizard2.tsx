"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ServiceFormValues, CreateServicePayload } from "@/app/types/services";
import { createServiceSchema } from "@/app/validators/service.schema";
import { useService } from "@/app/hooks/use-service";
import { cn } from "@/app/lib/utils";

import { Step1Details } from "./steps/Step1Details";
import { Step2Practical } from "./steps/Step2Practical";
import { Step3Payment } from "./steps/Step3Payment";
import { Icon } from "@iconify/react";

interface ServiceFormWizardProps {
  mode: "create" | "edit";
  serviceId?: number;
  containerClassName?: string;
  inputClassName?: string;
  buttonClassName?: string;
  labelClassName?: string;
  onCancel: () => void;
}

const STEPS = [
  { id: 1, title: "Détails du service" },
  { id: 2, title: "Détails pratiques" },
  { id: 3, title: "Paiement & Validation" },
];

const STEP_FIELDS: Record<number, (keyof ServiceFormValues)[]> = {
  1: ["title", "service_type", "category_id", "short_description"],
  2: ["date_pratique", "start_time", "duration", "address", "required_skills"],
};

export const ServiceFormWizard: React.FC<ServiceFormWizardProps> = ({
  mode,
  serviceId,
  containerClassName,
  inputClassName,
  buttonClassName,
  labelClassName,
  onCancel,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const { createService, updateService, getService, loading } = useService();

  const {
    register,
    control,
    handleSubmit,
    trigger,
    reset,
    formState: { errors },
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(createServiceSchema),
    mode: "onBlur",
  });

  const defaultInputClass = cn(
    "w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground",
    "placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
    "transition-colors",
    inputClassName
  );

  const defaultLabelClass = cn(
    "block text-sm font-medium text-slate-400 mb-1",
    labelClassName
  );

  /* ======================================================
   * Edit mode: hydrate form
   * ====================================================== */
  useEffect(() => {
    if (mode === "edit" && serviceId) {
      getService(serviceId).then((service) => {
        reset({
          title: service.title,
          short_description: service.short_description,
          full_description: service.full_description ?? undefined,
          service_type: service.service_type,
          category_id: service.category_id,
          date_pratique: service.date_pratique,
          start_time: service.start_time,
          duration: service.duration,
          address: service.address,
          city: service.city ?? undefined,
          required_skills: service.required_skills,
          proposed_amount: service.proposed_amount,
          images: service.images,
        });
      });
    }
  }, [mode, serviceId, reset, getService]);

  /* ======================================================
   * Step navigation
   * ====================================================== */
  const handleNext = async () => {
    const fields = STEP_FIELDS[currentStep] ?? [];
    const valid = await trigger(fields);
    if (valid) setCurrentStep((s) => s + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((s) => Math.max(1, s - 1));
  };

  /* ======================================================
   * Submit
   * ====================================================== */
  const onSubmit = async (data: ServiceFormValues) => {
    if (mode === "create") {
      await createService(data as CreateServicePayload);
    } else if (mode === "edit" && serviceId) {
      await updateService(serviceId, data);
    }
  };

  return (
    // make it a modal

    <div
      className="fixed flex items-center justify-center inset-0 bg-black/50 backdrop-blur-sm z-40"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-white rounded-2xl p-8 shadow-lg max-w-2xl w-full",
          containerClassName
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-orange-500 uppercase tracking-wide">
            {mode === "create" ? "Publier un service" : "Modifier le service"}
          </h1>
          <button
            type="button"
            onClick={onCancel}
            className="p-2 hover:bg-muted rounded-full transition-colors"
          >
            <Icon icon={"mdi:close"} className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 pt-4">
          {STEP_FIELDS.map((step) => (
            <div
              key={step.id}
              className={cn(
                "h-2.5 flex-1 transition-colors duration-500",
                step.id <= currentStep ? "bg-blue-900" : "bg-blue-900/30"
              )}
            />
          ))}
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="pt-4">
            {currentStep === 1 && (
              <Step1Details
                register={register}
                errors={errors}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 2 && (
              <Step2Practical
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 3 && (
              <Step3Payment
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
          </div>

          {/* Footer Navigation */}
          <div className="flex items-center justify-between gap-4 pt-2 mt-2 border-t border-border">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className={cn(
                  "flex items-center gap-2 px-6 py-3 border border-blue-900 text-blue-900 rounded-full",
                  "hover:bg-blue-900/5 transition-colors font-medium",
                  buttonClassName
                )}
              >
                <Icon icon={"mdi:chevron-left"} className="h-4 w-4" />
                Précédent
              </button>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  "flex items-center gap-2 px-6 ml-auto py-3 bg-blue-900 text-white rounded-full float-end",
                  "hover:bg-blue-900/90 transition-colors font-medium",
                  buttonClassName
                )}
              >
                Suivant
                <Icon icon={"mdi:chevron-right"} className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                className={cn(
                  "flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-full",
                  "hover:bg-primary/90 transition-colors font-medium",
                  buttonClassName
                )}
              >
                <Icon icon={"mdi:send"} className="h-4 w-4" />
                Publier
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default ServiceFormWizard;
