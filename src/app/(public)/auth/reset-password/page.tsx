// app/(auth)/reset-password/page.tsx

"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/hooks/use-toast";
import { cn } from "@/app/lib/utils";
import { ResetPasswordSchema, ResetPasswordFormData } from "@/app/lib/validators/auth.validator";
import { useAuth } from "@/app/hooks/auth/use-auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { 
    verifyResetToken, 
    isVerifyingResetToken,
    resetPassword,
    isResettingPassword 
  } = useAuth();
  
  const token = searchParams.get("token");
  const emailParam = searchParams.get("email");
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [email, setEmail] = useState(emailParam || "");
  
  const hasStartedRef = useRef(false);

  // Vérifier le token au chargement
  useEffect(() => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;

    const verifyToken = async () => {
      if (!token) {
        toast({
          title: "Lien invalide",
          description: "Le lien de réinitialisation est invalide",
          variant: "destructive",
        });
        setIsVerifying(false);
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      if (!emailParam) {
        toast({
          title: "Email manquant",
          description: "L'email est requis pour réinitialiser votre mot de passe",
          variant: "destructive",
        });
        setIsVerifying(false);
        setTimeout(() => router.push("/auth/login"), 2000);
        return;
      }

      try {
        const response = await verifyResetToken({ email: emailParam, token });
        
        // 🔥 Vérifier la réponse correctement
        if (response && response.success === true) {
          setIsTokenValid(true);
          setEmail(emailParam);
        } else {
          toast({
            title: "Lien invalide",
            description: response?.message || "Le lien a expiré ou est invalide",
            variant: "destructive",
          });
          setTimeout(() => router.push("/auth/login"), 2000);
        }
      } catch (error: any) {
        console.error("❌ Token verification error:", error);
        toast({
          title: "Erreur",
          description: error.message || "Impossible de vérifier le lien",
          variant: "destructive",
        });
        setTimeout(() => router.push("/auth/login"), 2000);
      } finally {
        // 🔥 TOUJOURS sortir de l'état de chargement
        setIsVerifying(false);
      }
    };

    verifyToken();
  }, [token, emailParam, router, toast, verifyResetToken]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(ResetPasswordSchema),
    defaultValues: {
      email: email || "",
      token: token || "",
      password: "",
      password_confirmation: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    
    try {
      const response = await resetPassword({
        email: data.email,
        token: data.token,
        password: data.password,
        password_confirmation: data.password_confirmation
      });
      
      if (response?.success) {
        setIsSuccess(true);
        toast({
          title: "✅ Mot de passe réinitialisé",
          description: "Votre mot de passe a été mis à jour avec succès",
        });
      }
    } catch (error: any) {
      console.error("❌ Reset password error:", error);
      
      if (error?.errors) {
        Object.keys(error.errors).forEach((field) => {
          const messages = error.errors[field];
          if (Array.isArray(messages) && messages.length > 0) {
            setError(field as any, {
              type: 'manual',
              message: messages[0],
            });
          }
        });
      } else {
        toast({
          title: "Erreur",
          description: error.message || "Une erreur est survenue",
          variant: "destructive",
        });
      }
    }
  };

  // 🔥 NE PAS utiliser isVerifyingResetToken pour le chargement
  // Utiliser uniquement isVerifying (état local)
  if (isVerifying) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
              <Icon icon="ph:spinner" className="w-7 h-7 text-primary animate-spin" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
              Vérification du lien
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">
              Veuillez patienter...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Si le token est invalide
  if (!isTokenValid && token) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-error/10 mb-4">
              <Icon icon="ph:x-circle" className="w-7 h-7 text-error" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
              Lien invalide
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">
              Le lien de réinitialisation est invalide ou a expiré.
            </p>
            <Link
              href="/auth/login"
              className="mt-4 inline-block text-primary hover:text-primary/80 dark:text-primary-400"
            >
              Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Si l'email manque
  if (!email && !emailParam) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          <div className="text-center py-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warning/10 mb-4">
              <Icon icon="ph:warning" className="w-7 h-7 text-warning" />
            </div>
            <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
              Email manquant
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-2">
              L'email est requis pour réinitialiser votre mot de passe.
            </p>
            <Link
              href="/auth/forgot-password"
              className="mt-4 inline-block text-primary hover:text-primary/80 dark:text-primary-400"
            >
              Retour à la demande de réinitialisation
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 🔥 Si le token est valide, afficher le formulaire
  if (isTokenValid) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 mb-4">
              <Icon icon="ph:lock" className="w-7 h-7 text-primary dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Nouveau mot de passe
            </h2>
            <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
              Choisissez un mot de passe sécurisé
            </p>
            {email && (
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-2">
                Pour : <span className="font-medium text-primary">{email}</span>
              </p>
            )}
          </div>

          {!isSuccess ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Champs cachés */}
              <input type="hidden" {...register("email")} value={email} />
              <input type="hidden" {...register("token")} value={token || ""} />

              {/* Nouveau mot de passe */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                  Nouveau mot de passe <span className="text-error">*</span>
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

              {/* Confirmer le mot de passe */}
              <div>
                <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                  Confirmer le mot de passe <span className="text-error">*</span>
                </label>
                <div className="relative">
                  <Icon icon="ph:lock" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary dark:text-gray-400" />
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("password_confirmation")}
                    placeholder="••••••••"
                    className={cn(
                      "pl-9 pr-9 h-11 rounded-xl focus:ring-2 focus:ring-primary",
                      "bg-white dark:bg-gray-900",
                      "border-gray-200 dark:border-gray-600",
                      "text-text-primary dark:text-gray-100",
                      "placeholder:text-text-secondary dark:placeholder:text-gray-500",
                      errors.password_confirmation && "border-error dark:border-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <Icon
                      icon={showConfirmPassword ? "ph:eye-slash" : "ph:eye"}
                      className="w-4 h-4 text-text-secondary hover:text-text-primary dark:text-gray-400 dark:hover:text-gray-200"
                    />
                  </button>
                </div>
                {errors.password_confirmation && (
                  <p className="mt-1 text-xs text-error dark:text-red-400">{errors.password_confirmation.message}</p>
                )}
              </div>

              {/* Message d'information */}
              <div className="p-3 rounded-lg bg-info/10 border border-info/20">
                <p className="text-xs text-info dark:text-blue-400">
                  <Icon icon="ph:info" className="inline w-3 h-3 mr-1" />
                  Après la réinitialisation, vous serez automatiquement connecté.
                </p>
              </div>

              <Button
                type="submit"
                disabled={isResettingPassword || isSubmitting}
                className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
              >
                {isResettingPassword || isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                    Mise à jour...
                  </span>
                ) : (
                  "Réinitialiser le mot de passe"
                )}
              </Button>

              <div className="text-center">
                <Link
                  href="/auth/login"
                  className="text-sm text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
                >
                  <Icon icon="ph:arrow-left" className="w-4 h-4" />
                  Retour à la connexion
                </Link>
              </div>
            </form>
          ) : (
            <div className="text-center space-y-4 py-4">
              <div className="w-16 h-16 mx-auto bg-success/10 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <Icon icon="ph:check" className="w-8 h-8 text-success dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Mot de passe modifié !
              </h3>
              <p className="text-sm text-text-secondary dark:text-gray-400">
                Votre mot de passe a été mis à jour avec succès.
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400">
                Redirection vers votre tableau de bord...
              </p>
              <div className="flex justify-center">
                <Icon icon="ph:spinner" className="w-5 h-5 text-primary animate-spin" />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}