"use client";
import { useRegistration } from "@/app/contexts/RegistrationContext";
import RegistrationProgressBar from "./RegistrationProgressBar";
import Step1AccountType from "./steps/Step1AccountType";
import Step2Categories from "./steps/Step2Categories";
import Step3Credentials from "./steps/Step3Credentials";

const RegistrationWizard = () => {
  const { step, data } = useRegistration();

  const getTitle = () => {
    if (step === 1) return "Créez un compte";
    if (data.role === "freelancer") {
      return (
        <>
          Créez un compte <span className="text-blue-900">Freelancer</span>
        </>
      );
    }
    return (
      <>
        Créez un compte <span className="text-accent">Client</span>
      </>
    );
  };

  const renderStep = () => {
    // For client, skip category step
    if (data.role === "client") {
      if (step === 1) return <Step1AccountType />;
      return <Step3Credentials />;
    }

    // For freelancer, all 3 steps
    switch (step) {
      case 1:
        return <Step1AccountType />;
      case 2:
        return <Step2Categories />;
      case 3:
        return <Step3Credentials />;
      default:
        return <Step1AccountType />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-12">
        {/* Header */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {getTitle()}
        </h1>

        {/* Progress Bar */}
        <div className="mb-10">
          <RegistrationProgressBar />
        </div>

        {/* Step Content */}
        <div className="min-h-[300px]">{renderStep()}</div>
      </div>
    </div>
  );
};

export default RegistrationWizard;
