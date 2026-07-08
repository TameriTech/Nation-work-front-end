// app/(auth)/login/page.tsx
"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/app/hooks/use-auth";
import { LoginSchema, type LoginFormData } from "@/app/lib/validators/auth.validator";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Checkbox } from "@/app/components/ui/checkbox";
import { cn } from "@/app/lib/utils";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  const registered = searchParams.get("registered");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(!!registered);
  const { login, isLoggingIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
  } = useForm<LoginFormData>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      remember_me: true,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    setShowSuccess(false);
    try {
      await login(data);
    } catch (error: any) {
      if (error.message?.toLowerCase().includes("email")) {
        setError("email", { message: error.message });
      } else if (error.message?.toLowerCase().includes("password")) {
        setError("password", { message: error.message });
      } else {
        setError("root", { message: error.message });
      }
    }
  };

  // Démo credentials
  const demoCredentials = [
    { role: "Freelance", email: "web.dev@freelance.fr", password: "Dev12345!" },
    { role: "Client", email: "cto@techstartup.io", password: "Startup123!" },
    { role: "Admin", email: "admin@example.com", password: "Admin123!" },
  ];

  const fillDemoCredentials = (email: string, password: string) => {
    setValue("email", email);
    setValue("password", password);
    setValue("remember_me", true);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Success message for new registration */}
      {showSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-success/10 dark:bg-green-900/20 border border-success/20 dark:border-green-800/30 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-success/20 dark:bg-green-800/30 flex items-center justify-center">
              <Icon icon="ph:check" className="w-4 h-4 text-success dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-success dark:text-green-400">
                Compte créé avec succès !
              </p>
              <p className="text-xs text-success/80 dark:text-green-400/80">
                Connectez-vous pour accéder à votre espace
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <div className="bg-surface dark:bg-gray-800 mt-16 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 mb-4">
            <Icon icon="ph:sign-in" className="w-7 h-7 text-primary dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
            Bienvenue
          </h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Connectez-vous à votre compte
          </p>
        </div>

        {/* Demo Credentials (optional - pour développement) */}
        <div className="mb-6 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50">
          <p className="text-xs text-text-secondary dark:text-gray-400 mb-2 text-center">
            Comptes de démonstration
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            {demoCredentials.map((cred) => (
              <button
                key={cred.role}
                type="button"
                onClick={() => fillDemoCredentials(cred.email, cred.password)}
                className={cn(
                  "text-xs px-2 py-1 rounded-lg transition-colors",
                  "bg-surface dark:bg-gray-800",
                  "text-text-secondary dark:text-gray-300",
                  "hover:bg-primary/10 hover:text-primary",
                  "dark:hover:bg-primary/20 dark:hover:text-primary-400",
                  "border border-gray-200 dark:border-gray-600"
                )}
              >
                {cred.role}
              </button>
            ))}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
              Email
            </label>
            <div className="relative">
              <Icon icon="ph:envelope" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
              <Input
                type="email"
                {...register("email")}
                placeholder="vous@exemple.com"
                className={cn(
                  "pl-9 h-11 rounded-xl focus:ring-2 focus:ring-primary",
                  "bg-white dark:bg-gray-900",
                  "border-gray-200 dark:border-gray-600",
                  "text-text-primary dark:text-gray-100",
                  "placeholder:text-text-secondary dark:placeholder:text-gray-500",
                  errors.email && "border-error dark:border-red-500"
                )}
              />
            </div>
            {errors.email && (
              <p className="mt-1 text-xs text-error dark:text-red-400">{errors.email.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
              Mot de passe
            </label>
            <div className="relative">
              <Icon icon="ph:lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                {...register("password")}
                placeholder="••••••••"
                className={cn(
                  "pl-9 pr-9 h-11 rounded-xl focus:ring-2 focus:ring-primary",
                  "bg-white dark:bg-gray-900",
                  "border-gray-200 dark:border-gray-600",
                  "text-text-primary dark:text-gray-100",
                  "placeholder:text-text-secondary dark:placeholder:text-gray-500",
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
          </div>

          {/* Remember me & Forgot password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox 
                {...register("remember_me")}
                className="data-[state=checked]:bg-primary data-[state=checked]:border-primary dark:border-gray-600" 
              />
              <span className="text-xs text-text-secondary dark:text-gray-400">Se souvenir de moi</span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-xs text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300"
            >
              Mot de passe oublié ?
            </Link>
          </div>

          {/* Error message */}
          {errors.root && (
            <div className="p-3 rounded-lg bg-error/10 dark:bg-red-900/20 border border-error/20 dark:border-red-800/30">
              <p className="text-sm text-error dark:text-red-400">{errors.root.message}</p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoggingIn}
            className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
          >
            {isLoggingIn ? (
              <span className="flex items-center justify-center gap-2">
                <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                Connexion...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
}