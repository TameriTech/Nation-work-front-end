import React, { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { getFormCategories } from "@/app/hooks/use-categories";
import { FromCategory, ServiceFormValues } from "@/app/types/services";

interface Step1GeneralProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step1General: React.FC<Step1GeneralProps> = ({
  register,
  errors,
  inputClassName = "",
  labelClassName = "",
}) => {
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
          {...register("service_type")}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        >
          <option value="">Sélectionner un type</option>
          <option value={"standard"}>Standard</option>
          <option value={"premium"}>Premium</option>
        </select>
        {errors.service_type && (
          <p className="text-sm text-destructive">
            {errors.service_type.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Choisir la catégorie de service
        </label>
        <select
          {...register("category_id", {
            setValueAs: (v) => (v === "" ? undefined : Number(v)), // <-- conversion
          })}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        >
          <option value="">Sélectionner une categorie</option>
          {categories.map((cat) => (
            <option key={cat.id} value={Number(cat.id)}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.category_id && (
          <p className="text-sm text-destructive">
            {errors.category_id.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Courte description (250 c)
        </label>
        <textarea
          {...register("short_description")}
          placeholder="Décrivez précisément votre besoin..."
          rows={4}
          maxLength={250}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.short_description && (
          <p className="text-sm text-destructive">
            {errors.short_description.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className={`${labelClassName} text-gray-500`}>
          Description complète du poste (850c) (facultatif)
        </label>
        <textarea
          {...register("full_description")}
          placeholder="Décrivez précisément votre besoin..."
          rows={6}
          maxLength={850}
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.full_description && (
          <p className="text-sm text-destructive">
            {errors.full_description.message}
          </p>
        )}
      </div>
    </div>
  );
};
