import { useRegistration } from "@/contexts/RegistrationContext";

const RegistrationProgressBar = () => {
  const { step, getTotalSteps } = useRegistration();
  const totalSteps = getTotalSteps();
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-orange-500 transition-all duration-300 ease-out rounded-full"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

export default RegistrationProgressBar;
