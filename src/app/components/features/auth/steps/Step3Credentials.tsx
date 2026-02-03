"use client";
import React, { useState } from "react";
import { useRegistration } from "@/app/contexts/RegistrationContext";
import { Button } from "@/app/components/ui/button";
import { useToast } from "@/app/hooks/use-toast";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/stores/auth.store";

const Step3Credentials = () => {
  const { data, setEmail, setPassword, setConfirmPassword, prevStep, reset } =
    useRegistration();
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const canProceed =
    data.email.trim().length > 0 &&
    data.password.length >= 6 &&
    data.password === data.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json();

        if (errData.errors) {
          setErrors({
            name: errData.errors.name?.[0],
            first_name: errData.errors.first_name?.[0],
            email: errData.errors.email?.[0],
            password: errData.errors.password?.[0],
            confirm_password: errData.errors.password_confirmation?.[0],
          });
        } else {
          setError(errData.message || "Registration failed");
        }

        return;
      }

      const resData = await res.json();
      setUser(resData);
      // Redirect basé sur rôle
      router.push("/dashboard/user");
    } catch (e: any) {
      console.log(e);
      toast({
        title: "Erreur de connexion",
        description: e.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-transparent">
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
          disabled={!canProceed}
          className="px-10 py-3 rounded-full bg-blue-900 hover:bg-blue-900/90 text-white font-medium disabled:opacity-50"
        >
          {loading ? "..." : "Créer mon Compte"}
        </Button>
      </div>
    </form>
  );
};

export default Step3Credentials;
