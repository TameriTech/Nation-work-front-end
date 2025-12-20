import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { Service, SERVICE_CATEGORIES } from "@/app/types/service-form";

interface Step1DetailsProps {
  register: UseFormRegister<Service>;
  errors: FieldErrors<Service>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step1Details: React.FC<Step1DetailsProps> = ({
  register,
  errors,
  inputClassName = "",
  labelClassName = "",
}) => {
  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold text-gray-800">
        Détails du service
      </h2>

      <div className="space-y-2 text-gray-500">
        <label className={`${labelClassName} text-gray-500`}>
          Titre du service
        </label>
        <input
          {...register("title")}
          placeholder="Développer mon Dashboard React"
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Choisir le type de service
        </label>
        <select
          {...register("category")}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        >
          <option value="">Sélectionner un type</option>
          {SERVICE_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="text-sm text-destructive">{errors.category.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Courte description (250 c)
        </label>
        <textarea
          {...register("shortDescription")}
          placeholder="Décrivez précisément votre besoin..."
          rows={4}
          maxLength={250}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.shortDescription && (
          <p className="text-sm text-destructive">
            {errors.shortDescription.message}
          </p>
        )}
      </div>
    </div>
  );
};
