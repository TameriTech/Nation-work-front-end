import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { ServiceFormValues } from "@/app/types/services";
import { SkillsTagInput } from "../SkillsTagInput";

interface Step3SkillsProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  control: Control<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step4Skills: React.FC<Step3SkillsProps> = ({
  register,
  errors,
  control,
  inputClassName = "",
  labelClassName = "",
}: Step3SkillsProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Paiement & Validation
      </h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>
            Compétences requises (facultatif)
          </label>
          <Controller
            name="required_skills"
            control={control}
            render={({ field }) => (
              <SkillsTagInput
                value={field.value || []}
                onChange={field.onChange}
                inputClassName={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
              />
            )}
          />
        </div>
      </div>
    </div>
  );
};
