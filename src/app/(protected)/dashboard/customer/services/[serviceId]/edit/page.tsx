// app/dashboard/customer/services/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { useServices } from "@/app/hooks/services/use-services";
import { useCategories } from "@/app/hooks/use-categories";
import {
  createServiceSchema,
  type CreateServiceFormData,
} from "@/app/lib/validators/service.validator";
import ServiceLoading from "./loading";
import ServiceError from "./error";
import { CreateServiceDto } from "@/app/types/services";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.serviceId);

  const [skillInput, setSkillInput] = useState("");
  const [serviceError, setServiceError] = useState<string | null>(null);

  // Hooks
  const { getServiceById, updateService, isUpdating } = useServices();
  const { categories, loading } = useCategories({
    mode: "public",
  });

  // Utiliser le hook pour récupérer les détails du service
  const { data: serviceData, isLoading: isLoadingService } =
    getServiceById(serviceId);

  // Initialisation du formulaire react-hook-form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateServiceFormData>({
    resolver: zodResolver(createServiceSchema),
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      service_type: "standard",
      category_id: undefined,
      date_pratique: "",
      start_time: "",
      duration: "",
      address: "",
      quarter: "",
      city: "",
      postal_code: "",
      country: "Cameroun",
      latitude: undefined,
      longitude: undefined,
      required_skills: [],
      proposed_amount: 0,
      accepted_amount: undefined,
      images: [],
    },
  });

  // Watcher pour les compétences
  const requiredSkills = watch("required_skills") || [];

  // Mettre à jour le formulaire quand les données sont chargées
  useEffect(() => {
    if (serviceData) {
      reset({
        title: serviceData.title,
        short_description: serviceData.short_description,
        full_description: serviceData.full_description || undefined,
        service_type: serviceData.service_type,
        category_id: serviceData.category_id ?? undefined, // ← Convertit null en undefined
        date_pratique: serviceData.date_pratique?.split("T")[0] || "",
        start_time: serviceData.start_time || "",
        duration: serviceData.duration || "",
        address: serviceData.address,
        quarter: serviceData.quarter || undefined,
        city: serviceData.city || "",
        postal_code: serviceData.postal_code || undefined,
        country: serviceData.country || "Cameroun",
        latitude: serviceData.latitude ?? undefined,
        longitude: serviceData.longitude ?? undefined,
        required_skills: serviceData.required_skills || [],
        proposed_amount: serviceData.proposed_amount || 0,
        accepted_amount: serviceData.accepted_amount ?? undefined,
        images:
          serviceData.service_images?.map((img: any) => img.image_url) || [],
      });
    }
  }, [serviceData, reset]);

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

  const cleanUndefined = <T,>(value: T | null | undefined): T | undefined => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  };

  // Soumission du formulaire
  const onSubmit = async (data: CreateServiceFormData) => {
    try {
      const cleanData: Partial<CreateServiceDto> = {
        title: data.title,
        short_description: data.short_description,
        full_description: cleanUndefined(data.full_description),
        service_type: data.service_type,
        category_id: cleanUndefined(data.category_id),
        date_pratique: data.date_pratique,
        start_time: cleanUndefined(data.start_time),
        duration: cleanUndefined(data.duration),
        address: data.address,
        quarter: cleanUndefined(data.quarter),
        city: data.city,
        postal_code: cleanUndefined(data.postal_code),
        country: data.country,
        latitude: cleanUndefined(data.latitude),
        longitude: cleanUndefined(data.longitude),
        required_skills: cleanUndefined(data.required_skills),
        proposed_amount: data.proposed_amount,
        accepted_amount: cleanUndefined(data.accepted_amount),
        images: cleanUndefined(data.images),
      };

      await updateService({ id: serviceId, data: cleanData });
      toast.success("Service mis à jour avec succès !");
      router.push(`/dashboard/customer/services/${serviceId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  // Annulation
  const handleCancel = () => {
    router.back();
  };

  // États de chargement et d'erreur
  if (isLoadingService || loading) {
    return <ServiceLoading />;
  }

  if (!serviceData) {
    return (
      <ServiceError error="Service non trouvé" onRetry={() => router.back()} />
    );
  }

  // Classes CSS communes
  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const errorClass = "text-sm text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-white rounded py-8">
      <div className="mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Modifier le service
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: #{serviceId}</p>
          </div>
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
                  {categories?.map((cat: any) => (
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
              <p className="text-xs text-gray-400 mt-1">
                {watch("short_description")?.length || 0}/250
              </p>
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
                <label className={labelClass}>Heure de début</label>
                <input
                  type="time"
                  {...register("start_time")}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Durée estimée</label>
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
                    className={`${inputClass} pr-16`}
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
                    className={`${inputClass} pr-16`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 6: Images existantes */}
          {watch("images") && watch("images")!.length > 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Images actuelles
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {watch("images")!.map((img: string, index: number) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Service ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const currentImages = watch("images") || [];
                        setValue(
                          "images",
                          currentImages.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      <Icon icon="mdi:close" className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 7: Nouvelle image */}
          <div className="bg-white rounded-2xl p-6 space-y-4 border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Ajouter des images
            </h2>

            <div>
              <label className={labelClass}>Nouvelles images</label>
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
              <p className="text-xs text-gray-400 mt-1">
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
              disabled={isSubmitting || isUpdating}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting || isUpdating ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin h-5 w-5" />
                  Mise à jour en cours...
                </>
              ) : (
                <>
                  <Icon icon="mdi:content-save" className="h-5 w-5" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
