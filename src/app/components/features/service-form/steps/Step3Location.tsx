import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { ServiceFormValues } from "@/app/types/services";

interface Step3LocationProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  control: Control<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step3Location: React.FC<Step3LocationProps> = ({
  register,
  errors,
  control,
  inputClassName = "",
  labelClassName = "",
}: Step3LocationProps) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Paiement & Validation
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2 col-span-full">
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
          <label className={`${labelClassName} text-gray-500`}>Ville</label>
          <input
            {...register("city")}
            placeholder="Lagos"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>Quarter</label>
          <input
            {...register("quarter")}
            placeholder="Lagos - Central Market"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.quarter && (
            <p className="text-sm text-destructive">{errors.quarter.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>
            Postal_code
          </label>
          <input
            {...register("postal_code")}
            placeholder="Lagos - Central Market"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.postal_code && (
            <p className="text-sm text-destructive">
              {errors.postal_code.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>Country</label>
          <input
            {...register("country")}
            placeholder="Nigeria"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.country && (
            <p className="text-sm text-destructive">{errors.country.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>Latitude</label>
          <input
            {...register("latitude")}
            placeholder="6.5244° N"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.latitude && (
            <p className="text-sm text-destructive">
              {errors.latitude.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>Longitude</label>
          <input
            {...register("longitude")}
            placeholder="6.5244° E"
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          />
          {errors.longitude && (
            <p className="text-sm text-destructive">
              {errors.longitude.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
