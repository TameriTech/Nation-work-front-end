// app/dashboard/customer/services/create/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useClientServices } from "@/app/hooks/services/use-client-service";
import { useCategories } from "@/app/hooks/use-categories";
import {
  createServiceSchema,
  type CreateServiceFormData,
} from "@/app/lib/validators/service.validator";
import type { CreateServiceDto, ServiceType } from "@/app/types/services";

export default function CreateServicePage() {
  const router = useRouter();
  const [skillInput, setSkillInput] = useState("");

  const { publishService, isPublishing } = useClientServices();
  // get only published categories for service creation (no pagination, no filters)
  const { categories } = useCategories({
    mode: "public",
  });

  // Initialisation du formulaire avec react-hook-form
  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "Catering pour événement - Cuisine camerounaise",
      short_description: "Traiteur spécialisé en plats traditionnels à Yaoundé",
      full_description:
        "Service de traiteur pour vos événements : mariages, anniversaires, réunions. Spécialités : Ndolé, Poisson braisé, Poulet DG, Mbongo Tchobi. Équipe professionnelle avec 10 ans d'expérience dans la restauration à Yaoundé. Ingrédients frais du marché Mfoundi.",
      service_type: "standard",
      category_id: 1,
      date_pratique: "2024-03-15",
      start_time: "10:00",
      duration: "6 heures",
      address: "Bastos, Rue de l'Université",
      quarter: "Bastos",
      city: "Yaoundé",
      postal_code: "BP 5678",
      country: "Cameroun",
      latitude: 3.8667,
      longitude: 11.5167,
      required_skills: [
        "Cuisine traditionnelle",
        "Gestion d'équipe",
        "Planification événementielle",
        "Normes d'hygiène",
      ],
      proposed_amount: 150000,
      accepted_amount: 135000,
    },
  });

  // Watcher pour les compétences (utile pour l'affichage)
  const requiredSkills = watch("required_skills") || [];

  // Gestionnaire pour ajouter une compétence
  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setValue("required_skills", [...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  // Gestionnaire pour supprimer une compétence
  const handleRemoveSkill = (skill: string) => {
    setValue(
      "required_skills",
      requiredSkills.filter((s) => s !== skill),
    );
  };

  // Soumission du formulaire
  // Dans le formulaire, lors de l'appel à createService
  const onSubmit = async (data: CreateServiceFormData) => {
    try {
      // Nettoyer les données avant envoi
      const cleanData: CreateServiceDto = {
        title: data.title,
        short_description: data.short_description,
        service_type: data.service_type,
        category_id: data.category_id || undefined,
        date_pratique: data.date_pratique,
        start_time: data.start_time,
        duration: data.duration,
        address: data.address,
        city: data.city,
        proposed_amount: data.proposed_amount,
        // Champs optionnels avec conversion null → undefined
        full_description: data.full_description || undefined,
        quarter: data.quarter || undefined,
        postal_code: data.postal_code || undefined,
        country: data.country || "Cameroun", // Valeur par défaut
        latitude: data.latitude || undefined,
        longitude: data.longitude || undefined,
        required_skills: data.required_skills || [],
        accepted_amount: data.accepted_amount || undefined,
        images: data.images || undefined,
      };

      await publishService(cleanData);
      toast.success("Service publié avec succès !");
      router.push("/dashboard/customer/services");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  // Annulation
  const handleCancel = () => {
    router.back();
  };

  // Classes CSS communes
  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const errorClass = "text-sm text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Publier un nouveau service
          </h1>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon icon="mdi:close" className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Section 1: Informations générales */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informations générales
            </h2>

            <div>
              <label className={labelClass}>Titre du service *</label>
              <input
                type="text"
                {...register("title")}
                placeholder="Ex: Développement d'une application mobile"
                className={inputClass}
              />
              {errors.title && (
                <p className={errorClass}>{errors.title.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type de service *</label>
                <select {...register("service_type")} className={inputClass}>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="candidature">Candidature</option>
                  <option value="directe">Directe</option>
                </select>
                {errors.service_type && (
                  <p className={errorClass}>{errors.service_type.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Catégorie</label>
                <select
                  {...register("category_id", { valueAsNumber: true })}
                  className={inputClass}
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description courte *</label>
              <textarea
                {...register("short_description")}
                placeholder="Brève description du service (max 250 caractères)"
                rows={3}
                maxLength={250}
                className={inputClass}
              />
              {errors.short_description && (
                <p className={errorClass}>{errors.short_description.message}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Description complète</label>
              <textarea
                {...register("full_description")}
                placeholder="Description détaillée du service..."
                rows={5}
                className={inputClass}
              />
            </div>
          </div>

          {/* Section 2: Détails pratiques */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Détails pratiques
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date de prestation *</label>
                <input
                  type="date"
                  {...register("date_pratique")}
                  className={inputClass}
                />
                {errors.date_pratique && (
                  <p className={errorClass}>{errors.date_pratique.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Heure de début *</label>
                <input
                  type="time"
                  {...register("start_time")}
                  className={inputClass}
                />
                {errors.start_time && (
                  <p className={errorClass}>{errors.start_time.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Durée estimée *</label>
                <select {...register("duration")} className={inputClass}>
                  <option value="">Sélectionner</option>
                  <option value="1h">1 heure</option>
                  <option value="2h">2 heures</option>
                  <option value="3h">3 heures</option>
                  <option value="4h">4 heures</option>
                  <option value="5h+">5 heures ou plus</option>
                  <option value="1j">1 journée</option>
                  <option value="2j">2 jours</option>
                  <option value="3j+">3 jours ou plus</option>
                </select>
                {errors.duration && (
                  <p className={errorClass}>{errors.duration.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Localisation */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Localisation
            </h2>

            <div>
              <label className={labelClass}>Adresse *</label>
              <input
                type="text"
                {...register("address")}
                placeholder="Numéro et rue"
                className={inputClass}
              />
              {errors.address && (
                <p className={errorClass}>{errors.address.message}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ville *</label>
                <input
                  type="text"
                  {...register("city")}
                  placeholder="Douala, Yaoundé..."
                  className={inputClass}
                />
                {errors.city && (
                  <p className={errorClass}>{errors.city.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Quartier</label>
                <input
                  type="text"
                  {...register("quarter")}
                  placeholder="Bonapriso, Mvog-Mbi..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Code postal</label>
                <input
                  type="text"
                  {...register("postal_code")}
                  placeholder="BP 1234"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pays</label>
                <input
                  type="text"
                  {...register("country")}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Latitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("latitude", { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Longitude</label>
                <input
                  type="number"
                  step="any"
                  {...register("longitude", { valueAsNumber: true })}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Compétences */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Compétences requises
            </h2>

            <div>
              <label className={labelClass}>Ajouter des compétences</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), handleAddSkill())
                  }
                  placeholder="Ex: React, Node.js, Design..."
                  className={`${inputClass} flex-1`}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                  disabled={!skillInput.trim()}
                >
                  <Icon icon="mdi:plus" className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Appuyez sur Entrée ou cliquez sur le bouton + pour ajouter
              </p>
            </div>

            {/* Liste des compétences */}
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requiredSkills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-blue-600"
                    >
                      <Icon icon="mdi:close" className="h-4 w-4" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Prix */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Budget
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Montant proposé (FCFA) *</label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("proposed_amount", { valueAsNumber: true })}
                    min="0"
                    step="100"
                    className={`${inputClass} pr-12`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
                {errors.proposed_amount && (
                  <p className={errorClass}>{errors.proposed_amount.message}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Montant accepté (FCFA)</label>
                <div className="relative">
                  <input
                    type="number"
                    {...register("accepted_amount", { valueAsNumber: true })}
                    min="0"
                    step="100"
                    className={`${inputClass} pr-12`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Images */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Images
            </h2>

            <div>
              <label className={labelClass}>Images du service</label>
              <input
                type="file"
                accept="image/*"
                multiple
                className={inputClass}
                onChange={(e) => {
                  // À implémenter avec un service d'upload
                  console.log("Fichiers sélectionnés:", e.target.files);
                }}
              />
              <p className="text-sm text-gray-500 mt-1">
                Format: JPG, PNG (max 5 Mo par image)
              </p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-full hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isPublishing}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting || isPublishing ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin h-5 w-5" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Icon icon="mdi:send" className="h-5 w-5" />
                  Publier le service
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
