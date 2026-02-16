"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

export type AccountType = "freelancer" | "client" | null;

interface RegistrationData {
  role: AccountType;
  username: string;
  category_ids: string[];
  email: string;
  password: string;
  phone_number: string;
}

interface RegistrationContextType {
  step: number;
  data: RegistrationData;
  setStep: (step: number) => void;
  setRole: (role: AccountType) => void;
  setUsername: (username: string) => void;
  setCategory_ids: (category_ids: string[]) => void;
  addCategory: (category: string) => void;
  removeCategory: (category: string) => void;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
  setPhoneNumber: (phone_number: string) => void;
  nextStep: () => void;
  prevStep: () => void;
  getTotalSteps: () => number;
  reset: () => void;
}

const initialData: RegistrationData = {
  role: "client",
  username: "Ludivin",
  category_ids: [],
  email: "",
  password: "Ludivin123",
  phone_number: "0606060606",
};

const RegistrationContext = createContext<RegistrationContextType | undefined>(
  undefined,
);

export const RegistrationProvider = ({ children }: { children: ReactNode }) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<RegistrationData>(initialData);

  const setRole = (role: AccountType) => {
    setData((prev) => ({ ...prev, role }));
  };

  const setUsername = (username: string) => {
    setData((prev) => ({ ...prev, username }));
  };

  const setCategory_ids = (category_ids: string[]) => {
    setData((prev) => ({ ...prev, category_ids }));
  };

  const addCategory = (category: string) => {
    if (data.category_ids.length < 5 && !data.category_ids.includes(category)) {
      setData((prev) => ({
        ...prev,
        category_ids: [...prev.category_ids, category],
      }));
    }
  };

  const removeCategory = (category: string) => {
    setData((prev) => ({
      ...prev,
      category_ids: prev.category_ids.filter((c) => c !== category),
    }));
  };

  const setEmail = (email: string) => {
    setData((prev) => ({ ...prev, email }));
  };

  const setPassword = (password: string) => {
    setData((prev) => ({ ...prev, password }));
  };

  const setPhoneNumber = (phone_number: string) => {
    setData((prev) => ({ ...prev, phone_number }));
  };

  const getTotalSteps = () => {
    return data.role === "freelancer" ? 3 : 2;
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

  return (
    <RegistrationContext.Provider
      value={{
        step,
        data,
        setStep,
        setRole,
        setUsername,
        setCategory_ids,
        addCategory,
        removeCategory,
        setEmail,
        setPassword,
        setPhoneNumber,
        nextStep,
        prevStep,
        getTotalSteps,
        reset,
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
      "useRegistration must be used within a RegistrationProvider",
    );
  }
  return context;
};
