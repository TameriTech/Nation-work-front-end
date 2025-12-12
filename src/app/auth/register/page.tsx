import { RegistrationProvider } from "@/contexts/RegistrationContext";
import RegistrationWizard from "@/app/auth/Components/RegistrationWizard";

const RegisterPage = () => {
  return (
    <RegistrationProvider>
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <RegistrationWizard />
      </div>
    </RegistrationProvider>
  );
};

export default RegisterPage;
