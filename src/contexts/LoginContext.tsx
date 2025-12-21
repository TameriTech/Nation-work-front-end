"use client";

import { useState } from "react";
import { useToast } from "@/app/hooks/use-toast";

export function useLogin() {
  const { toast } = useToast();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim() || !password.trim()) {
      toast({
        title: "Champs requis",
        description: "Veuillez remplir tous les champs.",
        variant: "destructive",
      });
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Email invalide",
        description: "Veuillez entrer une adresse email valide.",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const submit = async () => {
    if (!validate()) return;

    setLoading(true);

    // Simule un appel API
    //await new Promise((r) => setTimeout(r, 700));
    console.log("Email:", email);

    toast({
      title: "Connexion réussie",
      description: `Bienvenue !`,
    });

    setLoading(false);
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    loading,
    submit,
  };
}
