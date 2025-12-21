"use client";
import { useState } from "react";
import { useRegistration } from "@/contexts/RegistrationContext";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/app/hooks/use-toast";
import { Icon } from "@iconify/react";

const Step3Credentials = () => {
  const { data, setEmail, setPassword, setConfirmPassword, prevStep } =
    useRegistration();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const canProceed =
    data.email.trim().length > 0 &&
    data.password.length >= 6 &&
    data.password === data.confirmPassword;

  const handleSubmit = () => {
    if (!canProceed) return;

    // Validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return;
    }

    if (data.password.length < 6) {
      toast({
        title: "Mot de passe trop court",
        description: "Le mot de passe doit contenir au moins 6 caractères.",
        variant: "destructive",
      });
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast({
        title: "Mots de passe différents",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      return;
    }

    // Success - would normally submit to API
    toast({
      title: "Compte créé !",
      description: `Bienvenue ${data.username} ! Votre compte ${data.accountType} a été créé avec succès.`,
    });
  };

  return (
    <div className="space-y-6 bg-transparent">
      {/* Title */}
      <h2 className="text-xl font-medium text-gray-900">
        Information de Connexion
      </h2>

      {/* Email Input */}
      <div className="relative border border-border rounded-2xl p-4 focus-within:border-accent transition-colors">
        <label className="text-xs text-gray-500 block mb-1">Email</label>
        <input
          type="email"
          value={data.email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
          placeholder="valeur"
        />
      </div>

      {/* Password Input */}
      <div className="relative border border-border rounded-2xl p-4 focus-within:border-accent transition-colors">
        <label className="text-xs text-gray-500 block mb-1">Mot de passe</label>
        <div className="flex items-center">
          <input
            type={showPassword ? "text" : "password"}
            value={data.password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showPassword ? (
              <Icon icon={"bi:eye-slash"} className="w-5 h-5" />
            ) : (
              <Icon icon={"bi:eye"} className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Confirm Password Input */}
      <div className="relative border border-border rounded-2xl p-4 focus-within:border-accent transition-colors">
        <label className="text-xs text-gray-500 block mb-1">
          Confirmez le Mot de passe
        </label>
        <div className="flex items-center">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={data.confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full bg-transparent text-gray-900 font-medium focus:outline-none"
            placeholder="••••••••••"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="p-1 text-gray-500 hover:text-gray-900 transition-colors"
          >
            {showConfirmPassword ? (
              <Icon icon={"bi:eye-off"} className="w-5 h-5" />
            ) : (
              <Icon icon={"bi:eye"} className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Button
          variant="secondary"
          onClick={prevStep}
          className="px-10 py-3 rounded-full bg-gray-200 text-gray-800  font-medium"
        >
          Précédent
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={!canProceed}
          className="px-10 py-3 rounded-full bg-blue-900 hover:bg-blue-900/90 text-white font-medium disabled:opacity-50"
        >
          Créer mon Compte
        </Button>
      </div>
    </div>
  );
};

export default Step3Credentials;
