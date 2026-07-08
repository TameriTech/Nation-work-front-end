// app/(auth)/register/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { useToast } from "@/app/components/ui/use-toast";
import { SignUpFormData, SignUpSchema } from "@/app/lib/validators";
import { OtpVerification } from "@/app/components/auth/otp-verification";
import { UserRole } from "@/app/types";

// ==================== COMPOSANT ACCOUNT TYPE SELECTOR ====================

function AccountTypeSelector({ 
  selectedRole, 
  onSelectRole 
}: { 
  selectedRole: string | null; 
  onSelectRole: (role: string) => void;
}) {
  return (
    <div className="space-y-6">
      <div className="text-center mb-4">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 mb-4">
          <Icon icon="ph:user-switch" className="w-7 h-7 text-primary dark:text-primary-400" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
          Choisissez votre type de compte
        </h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Sélectionnez le profil qui vous correspond
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Carte Provider */}
        <button
          type="button"
          onClick={() => onSelectRole("provider")}
          className={cn(
            "group relative p-5 rounded-xl border-2 text-left transition-all duration-300",
            selectedRole === "provider"
              ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg"
              : "border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-md"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                selectedRole === "provider"
                  ? "bg-gradient-to-br from-primary to-secondary shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20"
              )}>
                <Icon 
                  icon="ph:briefcase" 
                  className={cn(
                    "w-6 h-6",
                    selectedRole === "provider"
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-400"
                  )}
                />
              </div>
              <div>
                <h3 className={cn(
                  "font-bold",
                  selectedRole === "provider"
                    ? "text-primary dark:text-primary-400"
                    : "text-text-primary dark:text-gray-100"
                )}>
                  Freelance
                </h3>
                <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">
                  Je souhaite offrir mes services
                </p>
              </div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              selectedRole === "provider"
                ? "border-primary bg-primary dark:border-primary-400 dark:bg-primary-400"
                : "border-gray-300 dark:border-gray-600"
            )}>
              {selectedRole === "provider" && (
                <Icon icon="ph:check" className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </button>

        {/* Carte Client */}
        <button
          type="button"
          onClick={() => onSelectRole("client")}
          className={cn(
            "group relative p-5 rounded-xl border-2 text-left transition-all duration-300",
            selectedRole === "client"
              ? "border-primary bg-primary/10 dark:bg-primary/20 shadow-lg"
              : "border-gray-200 dark:border-gray-700 hover:border-primary/40 dark:hover:border-primary/40 hover:shadow-md"
          )}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                selectedRole === "client"
                  ? "bg-gradient-to-br from-primary to-secondary shadow-lg"
                  : "bg-gray-100 dark:bg-gray-800 group-hover:bg-primary/20"
              )}>
                <Icon 
                  icon="ph:shopping-cart" 
                  className={cn(
                    "w-6 h-6",
                    selectedRole === "client"
                      ? "text-white"
                      : "text-gray-500 dark:text-gray-400 group-hover:text-primary dark:group-hover:text-primary-400"
                  )}
                />
              </div>
              <div>
                <h3 className={cn(
                  "font-bold",
                  selectedRole === "client"
                    ? "text-primary dark:text-primary-400"
                    : "text-text-primary dark:text-gray-100"
                )}>
                  Client
                </h3>
                <p className="text-xs text-text-secondary dark:text-gray-400 mt-0.5">
                  Je cherche des professionnels
                </p>
              </div>
            </div>
            <div className={cn(
              "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
              selectedRole === "client"
                ? "border-primary bg-primary dark:border-primary-400 dark:bg-primary-400"
                : "border-gray-300 dark:border-gray-600"
            )}>
              {selectedRole === "client" && (
                <Icon icon="ph:check" className="w-3 h-3 text-white" />
              )}
            </div>
          </div>
        </button>
      </div>
    </div>
  );
}

// ==================== COMPOSANT REGISTRATION FORM ====================

function RegistrationForm({ 
  role, 
  onBack,
  onRegistrationSuccess 
}: { 
  role: string; 
  onBack: () => void;
  onRegistrationSuccess: (email: string) => void;
}) {
  const { toast } = useToast();
  const { register: registerUser, isRegistering } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const COUNTRIES = [
    { code: "SN", name: "Sénégal" },
    { code: "FR", name: "France" },
    { code: "CI", name: "Côte d'Ivoire" },
    { code: "CM", name: "Cameroun" },
    { code: "ML", name: "Mali" },
    { code: "BF", name: "Burkina Faso" },
    { code: "GN", name: "Guinée" },
    { code: "TG", name: "Togo" },
    { code: "BJ", name: "Bénin" },
    { code: "NE", name: "Niger" },
    { code: "MA", name: "Maroc" },
    { code: "TN", name: "Tunisie" },
    { code: "DZ", name: "Algérie" },
    { code: "CD", name: "RDC" },
    { code: "BE", name: "Belgique" },
    { code: "CH", name: "Suisse" },
    { code: "LU", name: "Luxembourg" },
    { code: "CA", name: "Canada" },
  ];

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
    setError,
    clearErrors,
  } = useForm<SignUpFormData>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      country: "",
      phone: "",
      accepted_terms: false,
      accepted_privacy: false,
      accepts_newsletter: true,
      role: role as UserRole.CLIENT | UserRole.PROVIDER,
    },
    mode: "onChange",
  });

  // Mettre à jour le rôle quand il change
  useState(() => {
    setValue("role", role as UserRole.CLIENT | UserRole.PROVIDER);
  }, [role, setValue]);

   const onSubmit = async (data: SignUpFormData) => {
    clearErrors();
    
    try {
      // Appeler la mutation register
      const response = await registerUser(data);
      
      
      const isSuccess = response?.success === true || response?.data?.user;
      
      if (isSuccess) {
        toast({
          title: "Inscription réussie ✨",
          description: "Un code de vérification a été envoyé à votre email",
        });
        
        onRegistrationSuccess(data.email);
      } else {
        toast({
          title: "Inscription réussie ✨",
          description: "Un code de vérification a été envoyé à votre email",
        });
        
        onRegistrationSuccess(data.email);
      }
    } catch (error: any) {
      
      // Gérer les erreurs de validation du backend
      if (error?.errors) {
        const fieldMapping: Record<string, string> = {
          'first_name': 'first_name',
          'last_name': 'last_name',
          'email': 'email',
          'password': 'password',
          'phone': 'phone',
          'role': 'role',
          'accepted_terms': 'accepted_terms',
          'accepted_privacy': 'accepted_privacy',
          'accepts_newsletter': 'accepts_newsletter',
        };

        Object.keys(error.errors).forEach((backendField) => {
          const frontendField = fieldMapping[backendField] || backendField;
          const messages = error.errors[backendField];
          
          if (Array.isArray(messages) && messages.length > 0) {
            setError(frontendField as any, {
              type: 'manual',
              message: messages[0],
            });
          }
        });
      } else {
        toast({
          title: "Erreur d'inscription",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <button
          type="button"
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Icon icon="ph:arrow-left" className="w-5 h-5 text-text-secondary dark:text-gray-400" />
        </button>
        <div>
          <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-400 text-xs">
            <Icon icon="ph:user" className="w-3 h-3" />
            <span className="capitalize">{role}</span>
          </div>
          <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100 mt-1">
            {role === "provider" ? "Devenir Freelance" : "Devenir Client"}
          </h2>
        </div>
      </div>

      {/* Nom et Prénom */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
            Prénom <span className="text-error">*</span>
          </label>
          <Input
            {...register("first_name")}
            placeholder="Jean"
            className={cn(
              "h-10 rounded-xl text-sm focus:ring-2 focus:ring-primary",
              "bg-white dark:bg-gray-900",
              "border-gray-200 dark:border-gray-600",
              "text-text-primary dark:text-gray-100",
              errors.first_name && "border-error dark:border-red-500"
            )}
          />
          {errors.first_name && (
            <p className="mt-1 text-xs text-error dark:text-red-400">{errors.first_name.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
            Nom <span className="text-error">*</span>
          </label>
          <Input
            {...register("last_name")}
            placeholder="Dupont"
            className={cn(
              "h-10 rounded-xl text-sm focus:ring-2 focus:ring-primary",
              "bg-white dark:bg-gray-900",
              "border-gray-200 dark:border-gray-600",
              "text-text-primary dark:text-gray-100",
              errors.last_name && "border-error dark:border-red-500"
            )}
          />
          {errors.last_name && (
            <p className="mt-1 text-xs text-error dark:text-red-400">{errors.last_name.message}</p>
          )}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
          Email <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Icon icon="ph:envelope" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
          <Input
            {...register("email")}
            type="email"
            placeholder="jean.dupont@exemple.com"
            className={cn(
              "pl-9 h-10 rounded-xl text-sm focus:ring-2 focus:ring-primary",
              "bg-white dark:bg-gray-900",
              "border-gray-200 dark:border-gray-600",
              "text-text-primary dark:text-gray-100",
              errors.email && "border-error dark:border-red-500"
            )}
          />
        </div>
        {errors.email && (
          <p className="mt-1 text-xs text-error dark:text-red-400">{errors.email.message}</p>
        )}
      </div>

      {/* Mot de passe */}
      <div>
        <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
          Mot de passe <span className="text-error">*</span>
        </label>
        <div className="relative">
          <Icon icon="ph:lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
          <Input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className={cn(
              "pl-9 pr-9 h-10 rounded-xl text-sm focus:ring-2 focus:ring-primary",
              "bg-white dark:bg-gray-900",
              "border-gray-200 dark:border-gray-600",
              "text-text-primary dark:text-gray-100",
              errors.password && "border-error dark:border-red-500"
            )}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <Icon
              icon={showPassword ? "ph:eye-slash" : "ph:eye"}
              className="w-4 h-4 text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-gray-200"
            />
          </button>
        </div>
        {errors.password && (
          <p className="mt-1 text-xs text-error dark:text-red-400">{errors.password.message}</p>
        )}
        <div className="mt-1 flex flex-wrap gap-2">
          <span className="text-[10px] text-text-secondary dark:text-gray-400">
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1",
              watch("password")?.length >= 8 ? "bg-green-500" : "bg-gray-300"
            )}></span>
            8 caractères
          </span>
          <span className="text-[10px] text-text-secondary dark:text-gray-400">
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1",
              /[A-Z]/.test(watch("password") || "") ? "bg-green-500" : "bg-gray-300"
            )}></span>
            Majuscule
          </span>
          <span className="text-[10px] text-text-secondary dark:text-gray-400">
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1",
              /[a-z]/.test(watch("password") || "") ? "bg-green-500" : "bg-gray-300"
            )}></span>
            Minuscule
          </span>
          <span className="text-[10px] text-text-secondary dark:text-gray-400">
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1",
              /[0-9]/.test(watch("password") || "") ? "bg-green-500" : "bg-gray-300"
            )}></span>
            Chiffre
          </span>
          <span className="text-[10px] text-text-secondary dark:text-gray-400">
            <span className={cn(
              "inline-block w-1.5 h-1.5 rounded-full mr-1",
              /[^A-Za-z0-9]/.test(watch("password") || "") ? "bg-green-500" : "bg-gray-300"
            )}></span>
            Spécial
          </span>
        </div>
      </div>

      {/* Téléphone et Pays */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
            Téléphone
          </label>
          <div className="relative">
            <Icon icon="ph:phone" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
            <Input
              {...register("phone")}
              placeholder="+33 6 12 34 56 78"
              className={cn(
                "pl-9 h-10 rounded-xl text-sm focus:ring-2 focus:ring-primary",
                "bg-white dark:bg-gray-900",
                "border-gray-200 dark:border-gray-600",
                "text-text-primary dark:text-gray-100",
                errors.phone && "border-error dark:border-red-500"
              )}
            />
          </div>
          {errors.phone && (
            <p className="mt-1 text-xs text-error dark:text-red-400">{errors.phone.message}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
            Pays <span className="text-error">*</span>
          </label>
          <select
            {...register("country")}
            className={cn(
              "w-full h-10 px-3 rounded-xl border text-sm outline-none transition-colors",
              "bg-surface dark:bg-gray-800",
              errors.country 
                ? "border-error focus:ring-error dark:border-red-500" 
                : "border-gray-200 dark:border-gray-600 focus:border-primary focus:ring-2 focus:ring-primary",
              "text-text-primary dark:text-gray-100"
            )}
          >
            <option value="">Sélectionner</option>
            {COUNTRIES.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="mt-1 text-xs text-error dark:text-red-400">{errors.country.message}</p>
          )}
        </div>
      </div>

      {/* Conditions avec validation Zod */}
      <div className="space-y-2 pt-2">
        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("accepted_terms")}
            className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2"
          />
          <span className="text-xs text-text-secondary dark:text-gray-400">
            J'accepte les{" "}
            <Link href="/terms" className="text-primary hover:underline dark:text-primary-400">CGU</Link>
            {" "}et l'
            <Link href="/user-agreement" className="text-primary hover:underline dark:text-primary-400">accord utilisateur</Link>
            {" "}
            <span className="text-error dark:text-red-400">*</span>
          </span>
        </label>
        {errors.accepted_terms && (
          <p className="text-xs text-error dark:text-red-400">{errors.accepted_terms.message}</p>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("accepted_privacy")}
            className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2"
          />
          <span className="text-xs text-text-secondary dark:text-gray-400">
            J'accepte la{" "}
            <Link href="/privacy" className="text-primary hover:underline dark:text-primary-400">politique de confidentialité</Link>
            {" "}
            <span className="text-error dark:text-red-400">*</span>
          </span>
        </label>
        {errors.accepted_privacy && (
          <p className="text-xs text-error dark:text-red-400">{errors.accepted_privacy.message}</p>
        )}

        <label className="flex items-start gap-2 cursor-pointer">
          <input
            type="checkbox"
            {...register("accepts_newsletter")}
            className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 dark:border-gray-600 text-primary focus:ring-primary focus:ring-2"
          />
          <span className="text-xs text-text-secondary dark:text-gray-400">
            Recevoir des offres par email
            <span className="text-text-secondary dark:text-gray-500 ml-1">(optionnel)</span>
          </span>
        </label>
      </div>

      {/* Bouton soumission */}
      <Button
        type="submit"
        disabled={isSubmitting || isRegistering}
        className="w-full h-11 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white rounded-xl font-semibold"
      >
        {isSubmitting || isRegistering ? (
          <span className="flex items-center justify-center gap-2">
            <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
            Création du compte...
          </span>
        ) : (
          "Créer mon compte"
        )}
      </Button>

      <p className="text-xs text-center text-text-secondary dark:text-gray-400">
        En créant un compte, vous acceptez nos conditions générales
      </p>
    </form>
  );
}

// ==================== PAGE PRINCIPALE ====================

export default function RegisterPage() {
  const [step, setStep] = useState<"select" | "form" | "verify">("select");
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [registrationEmail, setRegistrationEmail] = useState<string>("");

  const handleSelectRole = (role: string) => {
    setSelectedRole(role);
    setStep("form");
  };

  const handleBack = () => {
    if (step === "form") {
      setStep("select");
      setSelectedRole(null);
    } else if (step === "verify") {
      setStep("form");
    }
  };

  const handleRegistrationSuccess = (email: string) => {
    setRegistrationEmail(email);
    setStep("verify");
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="bg-surface dark:bg-gray-800 mt-16 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        {step === "select" && (
          <>
            <AccountTypeSelector 
              selectedRole={selectedRole} 
              onSelectRole={handleSelectRole} 
            />
            
            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                Vous avez déjà un compte ?{" "}
                <Link href="/auth/login" className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 font-semibold">
                  Se connecter
                </Link>
              </p>
            </div>
          </>
        )}

        {step === "form" && selectedRole && (
          <RegistrationForm 
            role={selectedRole} 
            onBack={handleBack}
            onRegistrationSuccess={handleRegistrationSuccess}
          />
        )}

        {step === "verify" && (
          <OtpVerification
            email={registrationEmail}
            onBack={handleBack}
          />
        )}
      </div>
    </div>
  );
}