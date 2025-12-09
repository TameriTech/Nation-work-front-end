"use client";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Service,
  serviceSchema,
  ServiceFormWizardProps,
} from "@/app/types/service-form";
import { Step1Details } from "./steps/Step1Details";
import { Step2Practical } from "./steps/Step2Practical";
import { Step3Payment } from "./steps/Step3Payment";
import { cn } from "@/app/lib/utils";
import { Icon } from "@iconify/react";

const STEPS = [
  { id: 1, title: "Détails du service" },
  { id: 2, title: "Détails pratiques" },
  { id: 3, title: "Paiement & Validation" },
];

const defaultServiceValues: Service = {
  title: "",
  category: "",
  shortDescription: "",
  date: "",
  time: "",
  duration: "",
  address: "",
  skills: [],
  proposedAmount: 0,
  amountToPay: 0,
  fullDescription: "",
};

export const ServiceFormWizard: React.FC<ServiceFormWizardProps> = ({
  mode,
  defaultValues,
  onSubmit,
  onCancel,
  containerClassName = "",
  inputClassName = "",
  buttonClassName = "",
  labelClassName = "",
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    trigger,
  } = useForm<Service>({
    resolver: zodResolver(serviceSchema),
    defaultValues: { ...defaultServiceValues, ...defaultValues },
  });

  const defaultInputClass = cn(
    "w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground",
    "placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary",
    "transition-colors",
    inputClassName
  );

  const defaultLabelClass = cn(
    "block text-sm font-medium text-muted-foreground mb-1",
    labelClassName
  );

  const handleNext = async () => {
    let fieldsToValidate: (keyof Service)[] = [];

    if (currentStep === 1) {
      fieldsToValidate = ["title", "category", "shortDescription"];
    } else if (currentStep === 2) {
      fieldsToValidate = ["date", "time", "duration", "address"];
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onFormSubmit = (data: Service) => {
    onSubmit(data);
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
          {STEPS.map((step) => (
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
