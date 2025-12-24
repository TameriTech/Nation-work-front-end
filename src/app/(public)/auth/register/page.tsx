import { RegistrationProvider } from "@/app/contexts/RegistrationContext";
import RegistrationWizard from "@/app/components/features/auth/RegistrationWizard";

const RegisterPage = () => {
  return (
    <RegistrationProvider>
      <div className="rounded-4xl p-0 bg-white flex items-center justify-center">
        <RegistrationWizard />
      </div>
    </RegistrationProvider>
  );
};

export default RegisterPage;
