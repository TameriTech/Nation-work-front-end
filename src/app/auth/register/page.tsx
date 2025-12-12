import { RegistrationProvider } from "@/contexts/RegistrationContext";
import RegistrationWizard from "@/app/auth/Components/RegistrationWizard";

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
