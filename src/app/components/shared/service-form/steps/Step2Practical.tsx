import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { Service, DURATION_OPTIONS } from "@/app/types";
import { SkillsTagInput } from "../SkillsTagInput";

interface Step2PracticalProps {
  register: UseFormRegister<Service>;
  errors: FieldErrors<Service>;
  control: Control<Service>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step2Practical: React.FC<Step2PracticalProps> = ({
  register,
  errors,
  control,
  inputClassName = "",
  labelClassName = "",
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Détails pratiques
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-full">
          <label className={`${labelClassName} text-gray-500`}>
            Date de la prestation
          </label>
          <input
            type="date"
            {...register("date")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.date && (
            <p className="text-sm text-destructive">{errors.date.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-2 sm:col-span-1">
          <label className={`${labelClassName} text-gray-500`}>
            Durée estimée
          </label>
          <select
            {...register("duration")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          >
            <option value="">Sélectionner</option>
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.duration && (
            <p className="text-sm text-destructive">
              {errors.duration.message}
            </p>
          )}
        </div>
        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>Heure</label>
          <input
            type="time"
            {...register("time")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.time && (
            <p className="text-sm text-destructive">{errors.time.message}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>Adresse</label>
        <input
          {...register("address")}
          placeholder="Lagos - Central Market"
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.address && (
          <p className="text-sm text-destructive">{errors.address.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Compétences requises (facultatif)
        </label>
        <Controller
          name="skills"
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
  );
};
