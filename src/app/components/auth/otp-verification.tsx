// app/components/auth/otp-verification.tsx

"use client";

import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { cn } from "@/app/lib/utils";
import { useAuth } from "@/app/hooks/auth/use-auth";

interface OtpVerificationProps {
  email: string;
  onBack: () => void;
}

export function OtpVerification({ email, onBack }: OtpVerificationProps) {
  const { verifyEmail, isVerifying, resendVerification, isResending } = useAuth();
  
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Compte à rebours pour le renvoi
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [countdown]);

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;
    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setError(null);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
    if (e.key === "Enter") {
      handleVerify();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setCode(digits);
      const lastInput = document.getElementById(`otp-5`);
      if (lastInput) lastInput.focus();
    }
  };

  const handleVerify = async () => {
    const codeString = code.join("");
    if (codeString.length !== 6) {
      setError("Veuillez entrer les 6 chiffres du code");
      return;
    }

    setError(null);

    try {
      await verifyEmail({ email, code: codeString });
      // La redirection est gérée par le hook
    } catch (err: any) {
      setError(err.message || "Code invalide ou expiré");
    }
  };

  const handleResend = async () => {
    if (!canResend) return;

    setError(null);

    try {
      await resendVerification(email);
      setCountdown(60);
      setCanResend(false);
    } catch (err: any) {
      setError(err.message || "Erreur lors du renvoi");
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/10 mb-4">
          <Icon icon="ph:envelope-simple" className="w-7 h-7 text-primary" />
        </div>
        <h2 className="text-xl font-semibold text-text-primary dark:text-gray-100">
          Vérification du compte
        </h2>
        <p className="text-sm text-text-secondary dark:text-gray-400 mt-1">
          Un code de vérification a été envoyé à
        </p>
        <p className="text-sm font-medium text-primary dark:text-primary-400 mt-0.5">
          {email}
        </p>
      </div>

      {/* Inputs OTP */}
      <div className="flex justify-center gap-2" onPaste={handlePaste}>
        {code.map((digit, index) => (
          <Input
            key={index}
            id={`otp-${index}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleCodeChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            className={cn(
              "w-12 h-14 text-center text-lg font-bold",
              "rounded-xl border-2",
              "bg-white dark:bg-gray-900",
              "focus:ring-2 focus:ring-primary focus:border-primary",
              error 
                ? "border-error dark:border-red-500" 
                : "border-gray-200 dark:border-gray-600",
              "text-text-primary dark:text-gray-100"
            )}
          />
        ))}
      </div>

      {/* Message d'erreur */}
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20">
          <p className="text-sm text-error dark:text-red-400 text-center">{error}</p>
        </div>
      )}

      {/* Instructions et compte à rebours */}
      <div className="text-center">
        <p className="text-xs text-text-secondary dark:text-gray-400">
          Entrez les 6 chiffres reçus par email
        </p>
        {!canResend && countdown > 0 && (
          <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
            Renvoyer le code dans {countdown}s
          </p>
        )}
      </div>

      {/* Boutons */}
      <div className="space-y-3">
        <Button
          onClick={handleVerify}
          disabled={isVerifying || code.join("").length !== 6}
          className="w-full h-11 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold"
        >
          {isVerifying ? (
            <span className="flex items-center justify-center gap-2">
              <Icon icon="ph:spinner" className="w-4 h-4 animate-spin" />
              Vérification...
            </span>
          ) : (
            "Vérifier mon compte"
          )}
        </Button>

        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-text-secondary hover:text-primary dark:text-gray-400 dark:hover:text-primary-400 transition-colors"
          >
            ← Modifier l'email
          </button>

          <button
            type="button"
            onClick={handleResend}
            disabled={!canResend || isResending}
            className={cn(
              "text-sm transition-colors",
              canResend && !isResending
                ? "text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300"
                : "text-text-secondary dark:text-gray-500 cursor-not-allowed"
            )}
          >
            {isResending ? (
              <span className="flex items-center gap-2">
                <Icon icon="ph:spinner" className="w-3 h-3 animate-spin" />
                Envoi...
              </span>
            ) : canResend ? (
              "Renvoyer le code"
            ) : (
              `Renvoyer (${countdown}s)`
            )}
          </button>
        </div>
      </div>
    </div>
  );
}