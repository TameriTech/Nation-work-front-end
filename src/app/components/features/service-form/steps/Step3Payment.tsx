import React from "react";
import {
  UseFormRegister,
  FieldErrors,
  Control,
  Controller,
} from "react-hook-form";
import { Service } from "@/app/types/service-form";

interface Step3PaymentProps {
  register: UseFormRegister<Service>;
  errors: FieldErrors<Service>;
  control: Control<Service>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step3Payment: React.FC<Step3PaymentProps> = ({
  register,
  errors,
  control,
  inputClassName = "",
  labelClassName = "",
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-foreground">
        Paiement & Validation
      </h2>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>
            Montant proposé :
          </label>
          <div className="relative">
            <Controller
              name="proposedAmount"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="10 000"
                  className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
                />
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₦
            </span>
          </div>
          {errors.proposedAmount && (
            <p className="text-sm text-destructive">
              {errors.proposedAmount.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className={`${labelClassName} text-gray-500`}>
            Montant à payer :
          </label>
          <div className="relative">
            <Controller
              name="amountToPay"
              control={control}
              render={({ field }) => (
                <input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  placeholder="10 500"
                  className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
                />
              )}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              ₦
            </span>
          </div>
          {errors.amountToPay && (
            <p className="text-sm text-destructive">
              {errors.amountToPay.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Description complète du poste (850c) (facultatif)
        </label>
        <textarea
          {...register("fullDescription")}
          placeholder="Décrivez précisément votre besoin..."
          rows={6}
          maxLength={850}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.fullDescription && (
          <p className="text-sm text-destructive">
            {errors.fullDescription.message}
          </p>
        )}
      </div>
    </div>
  );
};
