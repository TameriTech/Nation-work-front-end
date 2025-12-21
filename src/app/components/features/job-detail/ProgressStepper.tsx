import { Icon } from "@iconify/react";

interface Step {
  label: string;
  status: "completed" | "current" | "pending";
}

const ProgressStepper = () => {
  const steps: Step[] = [
    { label: "Postulé", status: "completed" },
    { label: "En Attente", status: "current" },
    { label: "Réalisation", status: "pending" },
    { label: "Paiement", status: "pending" },
    { label: "Terminé", status: "pending" },
  ];

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => (
        <div key={step.label} className="flex items-center">
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
              step.status === "completed"
                ? "bg-blue-900 text-white border-blue-900"
                : step.status === "current"
                ? "bg-white text-orange-500 border-orange-500"
                : "bg-white text-gray-500 border-gray-300"
            }`}
          >
            {step.status === "completed" && (
              <Icon icon={"bx:check"} className="w-3.5 h-3.5" />
            )}
            {step.label}
          </div>
          {index < steps.length - 1 && (
            <div className="w-4 border-t border-dashed border-gray-800/40 mx-1" />
          )}
        </div>
      ))}
    </div>
  );
};

export default ProgressStepper;
