import { useRegistration } from "@/contexts/RegistrationContext";
import AccountTypeCard from "../AccountTypeCard";
import { Button } from "@/app/components/ui/button";

const Step1AccountType = () => {
  const { data, setAccountType, setUsername, nextStep } = useRegistration();

  const canProceed =
    data.accountType !== null && data.username.trim().length > 0;

  const handleNext = () => {
    if (canProceed) {
      nextStep();
    }
  };

  return (
    <div className="space-y-8 bg-transparent">
      {/* Account Type Selection */}
      <div className="flex gap-4">
        <AccountTypeCard
          title="Freelancer"
          description="Si vous offrez des Services"
          selected={data.accountType === "freelancer"}
          onClick={() => setAccountType("freelancer")}
        />
        <AccountTypeCard
          title="Client"
          description="Si vous recherchez des Freelancer"
          selected={data.accountType === "client"}
          onClick={() => setAccountType("client")}
        />
      </div>

      {/* Info Text */}

      {/* Username Input */}
      <div className="space-y-2">
        <p className="text-gray-900">
          La création de votre compte ne vous prendra pas plus de 5min
        </p>
        <div className="relative border border-border rounded-2xl p-4 focus-within:border-accent transition-colors">
          <label className="text-xs text-gray-500 block mb-1">
            {"Nom d'utilisateur"}
          </label>
          <input
            type="text"
            value={data.username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
            placeholder="valeur"
          />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-end">
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="px-10 py-3 rounded-full bg-blue-900 hover:bg-blue-900/90 text-white font-medium disabled:opacity-50"
        >
          Suivant
        </Button>
      </div>
    </div>
  );
};

export default Step1AccountType;
