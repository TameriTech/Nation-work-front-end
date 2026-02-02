import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { DURATION_OPTIONS } from "@/app/types";
import { ServiceFormValues } from "@/app/types/services";

interface Step2SchedulingProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  control: Control<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step2Scheduling: React.FC<Step2SchedulingProps> = ({
  register,
  errors,
  control,
  inputClassName = "",
  labelClassName = "",
}: Step2SchedulingProps) => {
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
            {...register("date_pratique")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.date_pratique && (
            <p className="text-sm text-destructive">
              {errors.date_pratique.message}
            </p>
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
            {...register("start_time")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.start_time && (
            <p className="text-sm text-destructive">
              {errors.start_time.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
