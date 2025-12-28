import React, { useEffect, useState } from "react";
import {
  UseFormRegister,
  FieldErrors,
  Controller,
  Control,
} from "react-hook-form";
import { getFormCategories } from "@/app/hooks/use-categories";
import { FromCategory, ServiceFormValues } from "@/app/types/services";

interface Step1PricingProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  control: Control<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step5Pricing: React.FC<Step1PricingProps> = ({
  register,
  control,
  errors,
  inputClassName = "",
  labelClassName = "",
}: Step1PricingProps) => {
  const [categories, setCategories] = useState<FromCategory[]>([]);
  useEffect(() => {
    const fetchCategories = async () => {
      const { categories } = await getFormCategories(); // Add await
      console.log(categories);

      setCategories(categories);
    };
    fetchCategories();
  }, []);
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Détails du service
      </h2>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Montant proposé :
        </label>
        <div className="relative">
          <Controller
            name="proposed_amount"
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            ₦
          </span>
        </div>
        {errors.proposed_amount && (
          <p className="text-sm text-destructive">
            {errors.proposed_amount.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Montant à payer :
        </label>
        <div className="relative">
          <Controller
            name="accepted_amount"
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
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
            ₦
          </span>
        </div>
        {errors.accepted_amount && (
          <p className="text-sm text-destructive">
            {errors.accepted_amount.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <div className="relative">
          <label className={`${labelClassName} text-gray-500`}>
            Choisir le status
          </label>
          <select
            {...register("status")}
            className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
          >
            <option value="">Sélectionner un type</option>
            <option value="draft">Brouillon</option>
            <option value="published">Publié</option>
            <option value="archived">Archivé</option>
          </select>
        </div>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>
    </div>
  );
};
