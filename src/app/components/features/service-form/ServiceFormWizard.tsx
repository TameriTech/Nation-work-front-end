"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { ServiceFormValues, CreateServicePayload } from "@/app/types/services";
import { createServiceSchema } from "@/app/validators/service.schema";
import { useService } from "@/app/hooks/use-service";
import { cn } from "@/app/lib/utils";

import { Step1General } from "./steps/Step1General";
import { Step2Scheduling } from "./steps/Step2Scheduling";
import { Step3Location } from "./steps/Step3Location";
import { Step4Skills } from "./steps/Step4Skillst";
import { Step5Pricing } from "./steps/step5Pricing";
import { Step6Media } from "./steps/step6Media";
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

const STEP_FIELDS: Record<number, (keyof ServiceFormValues)[]> = {
  1: [
    "title",
    "short_description",
    "full_description",
    "service_type",
    "category_id",
  ],
  2: ["date_pratique", "start_time", "duration"],
  3: [
    "address",
    "city",
    "quarter",
    "postal_code",
    "country",
    "latitude",
    "longitude",
  ],
  4: ["required_skills"],
  5: ["proposed_amount", "accepted_amount", "status"],
  6: ["images"],
};

const defaultValues: ServiceFormValues = {
  title: "Titre de test",
  short_description: "Une courte description",
  full_description: "Description complète du service",
  service_type: "standard",
  category_id: 1,
  date_pratique: "2025-12-30",
  start_time: "09:00",
  duration: "2h",
  address: "123 Rue Exemple",
  city: "Paris",
  quarter: "1er arrondissement",
  postal_code: "75001",
  country: "France",
  latitude: 48.8566,
  longitude: 2.3522,
  required_skills: ["ExempleSkill1", "ExempleSkill2"],
  proposed_amount: 100,
  accepted_amount: 90,
  status: "draft",
  images: [],
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
    defaultValues,
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
          quarter: service.quarter,
          postal_code: service.postal_code,
          country: service.country,
          latitude: service.latitude,
          longitude: service.longitude,
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
    // return form data if not valid
    if (!valid) {
      const formData = fields.reduce((acc, field) => {
        acc[field] = (control._formValues as any)[field];
        return acc;
      }, {} as Partial<ServiceFormValues>);
      console.log("Validation failed for step", currentStep, formData);
    }
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
      const response = await createService(data as CreateServicePayload);
      console.log("Service created:", response);
    } else if (mode === "edit" && serviceId) {
      await updateService(serviceId, data);
    }
  };

  return (
    // make it a modal

    <div
      className="fixed flex items-center justify-center inset-0 bg-black/50 backdrop-blur-sm z-[500]"
      onClick={onCancel}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "bg-white rounded-2xl max-h-[95vh] overflow-y-auto p-8 shadow-lg max-w-2xl w-full",
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
          {Object.values(STEP_FIELDS).map((step) => (
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
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="pt-4">
            {currentStep === 1 && (
              <Step1General
                register={register}
                errors={errors}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 2 && (
              <Step2Scheduling
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 3 && (
              <Step3Location
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 4 && (
              <Step4Skills
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 5 && (
              <Step5Pricing
                register={register}
                errors={errors}
                control={control}
                inputClassName={defaultInputClass}
                labelClassName={defaultLabelClass}
              />
            )}
            {currentStep === 6 && (
              <Step6Media
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

            {currentStep < 6 ? (
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
                  "flex items-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-full",
                  "hover:bg-blue-900/90 transition-colors font-medium",
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
