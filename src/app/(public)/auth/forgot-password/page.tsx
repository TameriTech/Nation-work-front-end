// app/(auth)/forgot-password/page.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useToast } from "@/app/hooks/use-toast";
import { cn } from "@/app/lib/utils";
import { ForgotPasswordSchema, ForgotPasswordFormData } from "@/app/lib/validators/auth.validator";
import { useAuth } from "@/app/hooks/auth/use-auth";

export default function ForgotPasswordPage() {
  const { toast } = useToast();
  const { forgotPassword, isForgotPasswordLoading } = useAuth();
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    watch,
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onChange",
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await forgotPassword({email: data.email});
      
      if (response?.success) {
        setIsSuccess(true);
        setSubmittedEmail(data.email);
        toast({
          title: "Email envoyé ✨",
          description: response.message || "Un lien de réinitialisation a été envoyé à votre email",
        });
      }
    } catch (error: any) {
      console.error("Forgot password error:", error);
      
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-xl p-6 md:p-8 border border-gray-100 dark:border-gray-700">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 mb-4">
            <Icon icon="ph:envelope" className="w-7 h-7 text-primary dark:text-primary-400" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
            Mot de passe oublié ?
          </h2>
          <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
            Entrez votre email pour recevoir un lien de réinitialisation
          </p>
        </div>

        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                Email <span className="text-error">*</span>
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
                  disabled={isForgotPasswordLoading || isSubmitting}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-error dark:text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Message d'information */}
            <div className="p-3 rounded-lg bg-info/10 border border-info/20">
              <p className="text-xs text-info dark:text-blue-400">
                <Icon icon="ph:info" className="inline w-3 h-3 mr-1" />
                Un lien de réinitialisation vous sera envoyé par email si un compte existe avec cette adresse.
              </p>
            </div>

            {/* Bouton de soumission */}
            <Button
              type="submit"
              disabled={isForgotPasswordLoading || isSubmitting}
              className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
            >
              {isForgotPasswordLoading || isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
                  Envoi en cours...
                </span>
              ) : (
                "Envoyer le lien"
              )}
            </Button>

            {/* Lien retour connexion */}
            <div className="text-center">
              <Link
                href="/auth/login"
                className="text-sm text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors inline-flex items-center gap-1"
              >
                <Icon icon="ph:arrow-left" className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>

            {/* Lien vers l'inscription */}
            <p className="text-center text-sm text-text-secondary dark:text-gray-400">
              Pas encore de compte ?{" "}
              <Link
                href="/auth/signup"
                className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 font-semibold"
              >
                S'inscrire
              </Link>
            </p>
          </form>
        ) : (
          // 🔥 État de succès
          <div className="text-center space-y-4 py-4">
            <div className="w-16 h-16 mx-auto bg-success/10 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <Icon icon="ph:check" className="w-8 h-8 text-success dark:text-green-400" />
            </div>
            <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100">
              Email envoyé ! ✨
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary dark:text-gray-400">
                Un lien de réinitialisation a été envoyé à :
              </p>
              <p className="text-sm font-medium text-primary dark:text-primary-400">
                {submittedEmail}
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-2">
                Vérifiez votre boîte de réception et vos spams.
              </p>
              <p className="text-xs text-text-secondary dark:text-gray-400">
                Le lien expire dans 60 minutes.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4">
              <Link
                href="/auth/login"
                className="text-sm text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 transition-colors inline-flex items-center justify-center gap-1"
              >
                <Icon icon="ph:arrow-left" className="w-4 h-4" />
                Retour à la connexion
              </Link>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  setSubmittedEmail("");
                }}
                className="text-sm text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
              >
                <Icon icon="ph:arrow-counter-clockwise" className="inline w-4 h-4 mr-1" />
                Réessayer avec un autre email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}