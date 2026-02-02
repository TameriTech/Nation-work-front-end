import React, { useEffect, useState } from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { getFormCategories } from "@/app/hooks/use-categories";
import { FromCategory, ServiceFormValues } from "@/app/types/services";

interface Step6MediaProps {
  register: UseFormRegister<ServiceFormValues>;
  errors: FieldErrors<ServiceFormValues>;
  inputClassName?: string;
  labelClassName?: string;
}

export const Step6Media: React.FC<Step6MediaProps> = ({
  register,
  errors,
  inputClassName = "",
  labelClassName = "",
}: Step6MediaProps) => {
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
          Entrez les images du service
        </label>
        <input
          {...register("images")}
          type="file"
          accept="image/*"
          multiple
          className={`${inputClassName} bg-white text-gray-800 placeholder:text-gray-500`}
        />
        {errors.images && (
          <p className="text-sm text-destructive">{errors.images.message}</p>
        )}
      </div>
    </div>
  );
};
