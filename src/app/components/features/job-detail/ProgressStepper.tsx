// components/features/job/ProgressStepper.tsx
"use client";

import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";

interface ProgressStepperProps {
  currentStep?: number;
  steps?: Array<{
    label: string;
    icon?: string;
  }>;
  onStepClick?: (stepIndex: number) => void;
}

const defaultSteps = [
  { label: "Candidature envoyée", icon: "bi:send" },
  { label: "En attente de réponse", icon: "bi:clock" },
  { label: "Entretien", icon: "bi:chat" },
  { label: "Mission acceptée", icon: "bi:check-circle" },
];

export default function ProgressStepper({
  currentStep = 1,
  steps = defaultSteps,
  onStepClick,
}: ProgressStepperProps) {
  return (
    <div className="w-full max-w-3xl mx-auto">
      {/* Desktop Version - Horizontal */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            const isPending = stepNumber > currentStep;

            return (
              <div key={index} className="flex-1 relative">
                {/* Ligne de connexion */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute top-5 left-1/2 w-full h-0.5",
                      stepNumber < currentStep ? "bg-green-500" : "bg-gray-200",
                    )}
                    style={{ transform: "translateX(50%)" }}
                  />
                )}

                {/* Étape */}
                <div className="relative flex flex-col items-center">
                  <button
                    onClick={() => onStepClick?.(stepNumber)}
                    disabled={isPending && !onStepClick}
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      isCompleted &&
                        "bg-green-500 text-white hover:bg-green-600",
                      isCurrent &&
                        "bg-blue-900 text-white ring-4 ring-blue-100",
                      isPending &&
                        "bg-gray-100 text-gray-400 cursor-not-allowed",
                      onStepClick &&
                        !isPending &&
                        "cursor-pointer hover:scale-110",
                    )}
                  >
                    {isCompleted ? (
                      <Icon icon="bi:check-lg" className="w-5 h-5" />
                    ) : (
                      <Icon
                        icon={step.icon || "bi:circle"}
                        className="w-5 h-5"
                      />
                    )}
                  </button>

                  <div className="mt-2 text-center">
                    <p
                      className={cn(
                        "text-sm font-medium",
                        isCompleted && "text-green-600",
                        isCurrent && "text-blue-900",
                        isPending && "text-gray-400",
                      )}
                    >
                      {step.label}
                    </p>
                    {isCurrent && (
                      <p className="text-xs text-gray-500 mt-1">En cours</p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile Version - Vertical List */}
      <div className="md:hidden space-y-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          const isPending = stepNumber > currentStep;

          return (
            <div key={index} className="flex items-start gap-3">
              {/* Indicateur d'étape */}
              <div className="relative">
                <button
                  onClick={() => onStepClick?.(stepNumber)}
                  disabled={isPending && !onStepClick}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-all",
                    isCompleted && "bg-green-500 text-white",
                    isCurrent && "bg-blue-900 text-white ring-4 ring-blue-100",
                    isPending && "bg-gray-100 text-gray-400 cursor-not-allowed",
                  )}
                >
                  {isCompleted ? (
                    <Icon icon="bi:check-lg" className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{stepNumber}</span>
                  )}
                </button>

                {/* Ligne verticale */}
                {index < steps.length - 1 && (
                  <div
                    className={cn(
                      "absolute left-1/2 top-8 w-0.5 h-8 -translate-x-1/2",
                      stepNumber < currentStep ? "bg-green-500" : "bg-gray-200",
                    )}
                  />
                )}
              </div>

              {/* Contenu de l'étape */}
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2">
                  <p
                    className={cn(
                      "font-medium",
                      isCompleted && "text-green-600",
                      isCurrent && "text-blue-900",
                      isPending && "text-gray-400",
                    )}
                  >
                    {step.label}
                  </p>
                  {isCurrent && (
                    <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-900 rounded-full">
                      En cours
                    </span>
                  )}
                </div>
                {step.icon && (
                  <Icon
                    icon={step.icon}
                    className="w-4 h-4 text-gray-400 mt-1"
                  />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Message d'information */}
      {currentStep === steps.length && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-center">
          <p className="text-sm text-green-700 flex items-center justify-center gap-2">
            <Icon icon="bi:check-circle" className="w-4 h-4" />
            Félicitations ! Vous avez complété toutes les étapes.
          </p>
        </div>
      )}
    </div>
  );
}
