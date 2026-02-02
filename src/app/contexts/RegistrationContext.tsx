"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { register } from "@/app/services/auth.service";

export type AccountType = "freelancer" | "client" | null;

interface RegistrationData {
  accountType: AccountType;
  username: string;
  // make category to be empty array for client account type
  categories: string[];
  email: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationContextType {
  step: number;
  data: RegistrationData;
  setStep: (step: number) => void;
  setAccountType: (type: AccountType) => void;
  setUsername: (username: string) => void;
  setCategories: (categories: string[]) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setConfirmPassword: (confirmPassword: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  getTotalSteps: () => number;
  reset: () => void;
  submitRegistration: () => Promise<void>;
}

const initialData: RegistrationData = {
  accountType: "client",
  username: "Ludivin",
  categories: [],
  email: "",
  password: "Ludivin123",
  confirmPassword: "Ludivin123",
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined
);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(initialData);

  const setAccountType = (type: AccountType) => {
    setData((prev) => ({ ...prev, accountType: type }));
  };

  const setUsername = (username: string) => {
    setData((prev) => ({ ...prev, username }));
  };

  const setCategories = (categories: string[]) => {
    setData((prev) => ({ ...prev, categories }));
  };

  const addCategory = (category: string) => {
    if (data.categories.length < 5 && !data.categories.includes(category)) {
      setData((prev) => ({
        ...prev,
        categories: [...prev.categories, category],
      }));
    }
  };

  const removeCategory = (category: string) => {
    setData((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c !== category),
    }));
  };

  const setEmail = (email: string) => {
    setData((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setData((prev) => ({ ...prev, password }));
  };

  const setConfirmPassword = (confirmPassword: string) => {
    setData((prev) => ({ ...prev, confirmPassword }));
  };

  const getTotalSteps = () => {
    return data.accountType === "freelancer" ? 3 : 2;
  };

  const nextStep = () => {
    const total = getTotalSteps();
    if (step < total) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const reset = () => {
    setStep(1);
    setData(initialData);
  };
  const submitRegistration = async () => {
    if (!data.accountType) {
      throw new Error("Type de compte manquant");
    }

    await register({
      role: data.accountType === "client" ? "client" : "freelancer",
      username: data.username,
      email: data.email,
      password: data.password,
      categories: data.accountType === "freelancer" ? data.categories : [],
    });
  };

  return (
    <RegistrationContext.Provider
      value={{
        step,
        data,
        setStep,
        setAccountType,
        setUsername,
        setCategories,
        addCategory,
        removeCategory,
        setEmail,
        setPassword,
        setConfirmPassword,
        nextStep,
        prevStep,
        getTotalSteps,
        reset,
        submitRegistration,
      }}
    >
      {children}
    </RegistrationContext.Provider>
  );
};

export const useRegistration = () => {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error(
      "useRegistration must be used within a RegistrationProvider"
    );
  }
  return context;
};
