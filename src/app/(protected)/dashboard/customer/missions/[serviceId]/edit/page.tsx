// app/dashboard/customer/services/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { cn } from "@/app/lib/utils";
import { useTheme } from "next-themes";

import { useClientServices } from "@/app/hooks/services/use-client-service";
import { usePublicCategories } from "@/app/hooks/services/use-categories";
import {
  UpdateServiceFormData,
  UpdateServiceSchema,
} from "@/app/lib/validators/service.validator";
import ServiceLoading from "./loading";
import ServiceError from "./error";
import { LocationType, MissionType, PaymentType, ServiceType } from "@/app/types";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const serviceId = Number(params.serviceId);

  const [skillInput, setSkillInput] = useState("");
  const [prefSkillInput, setPrefSkillInput] = useState("");
  const [tagInput, setTagInput] = useState("");

  const { getClientServiceForEdit, updateService, isUpdating } = useClientServices();
  const { categories } = usePublicCategories();

  const { data: serviceData, isLoading: isLoadingService } = getClientServiceForEdit(serviceId);

  useEffect(() => {
    setMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<UpdateServiceFormData>({
    resolver: async (values, context, options) => {
      const cleaned = { ...values };

      if (cleaned.mission_type === "hourly") {
        cleaned.duration_value = undefined;
        cleaned.duration_unit = undefined;
      }

      if (cleaned.mission_type === "project") {
        cleaned.scheduled_date = undefined;
      }

      const cleanNumber = (v: any) => (typeof v === "number" && !isNaN(v) ? v : undefined);
      cleaned.category_id = cleanNumber(cleaned.category_id);
      cleaned.min_amount = cleanNumber(cleaned.min_amount);
      cleaned.max_amount = cleanNumber(cleaned.max_amount);
      cleaned.accepted_amount = cleanNumber(cleaned.accepted_amount);

      const cleanString = (v: any) => (v === "" ? undefined : v);
      cleaned.full_description = cleanString(cleaned.full_description);
      cleaned.start_date = cleanString(cleaned.start_date);
      cleaned.duration = cleanString(cleaned.duration);

      return zodResolver(UpdateServiceSchema)(cleaned, context, options);
    },
    defaultValues: {
      title: "",
      short_description: "",
      full_description: "",
      service_type: "standard" as ServiceType,
      category_id: undefined,
      mission_type: "hourly" as MissionType,
      scheduled_date: "",
      duration_value: undefined,
      duration_unit: undefined,
      start_date: "",
      duration: "",
      location: {
        address: "",
        quarter: "",
        city: "",
        postal_code: "",
        country: "Cameroun",
        latitude: undefined,
        longitude: undefined,
        location_type: "onsite" as LocationType,
      },
      required_skills: [],
      preferred_skills: [],
      proposed_amount: 1,
      accepted_amount: undefined,
      payment_type: "fixed" as PaymentType,
      min_amount: undefined,
      max_amount: undefined,
      is_urgent: false,
      is_featured: false,
      tags: [],
      images: [],
    },
  });

  const requiredSkills = watch("required_skills") || [];
  const preferredSkills = watch("preferred_skills") || [];
  const tags = watch("tags") || [];
  const paymentType = watch("payment_type");
  const missionType = watch("mission_type");

  useEffect(() => {
    if (serviceData) {
      const isHourly = serviceData.mission_type === "hourly";

      reset({
        title: serviceData.title,
        short_description: serviceData.short_description,
        full_description: serviceData.full_description || undefined,
        service_type: serviceData.service_type,
        category_id: serviceData.category_id ?? undefined,
        mission_type: serviceData.mission_type || "hourly",
        scheduled_date: isHourly ? serviceData.scheduled_date || "" : "",
        duration_value: !isHourly ? serviceData.duration_value ?? undefined : undefined,
        duration_unit: !isHourly ? serviceData.duration_unit ?? undefined : undefined,
        location: {
          address: serviceData.location?.address || "",
          quarter: serviceData.location?.quarter || undefined,
          city: serviceData.location?.city || "",
          postal_code: serviceData.location?.postal_code || undefined,
          country: serviceData.location?.country || "Cameroun",
          latitude: serviceData.location?.latitude ?? undefined,
          longitude: serviceData.location?.longitude ?? undefined,
          location_type: serviceData.location?.location_type || "onsite",
        },
        required_skills: serviceData.required_skills || [],
        preferred_skills: serviceData.preferred_skills || [],
        proposed_amount: serviceData.proposed_amount || 1,
        accepted_amount: serviceData.accepted_amount ?? undefined,
        payment_type: serviceData.payment_type || "fixed",
        min_amount: serviceData.min_amount ?? undefined,
        max_amount: serviceData.max_amount ?? undefined,
        is_urgent: serviceData.is_urgent || false,
        is_featured: serviceData.is_featured || false,
        tags: serviceData.tags || [],
      });
    }
  }, [serviceData, reset]);

  const handleAddSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setValue("required_skills", [...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setValue("required_skills", requiredSkills.filter((s) => s !== skill));
  };

  const handleAddPrefSkill = () => {
    if (prefSkillInput.trim() && !preferredSkills.includes(prefSkillInput.trim())) {
      setValue("preferred_skills", [...preferredSkills, prefSkillInput.trim()]);
      setPrefSkillInput("");
    }
  };

  const handleRemovePrefSkill = (skill: string) => {
    setValue("preferred_skills", preferredSkills.filter((s) => s !== skill));
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setValue("tags", [...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setValue("tags", tags.filter((t) => t !== tag));
  };

  const cleanUndefined = <T,>(value: T | null | undefined): T | undefined => {
    if (value === null || value === undefined) return undefined;
    if (Array.isArray(value) && value.length === 0) return undefined;
    return value;
  };

  const onSubmit = async (data: UpdateServiceFormData) => {
    try {
      const updateData: UpdateServiceFormData = {
        title: data.title,
        short_description: data.short_description,
        full_description: cleanUndefined(data.full_description),
        service_type: data.service_type,
        category_id: cleanUndefined(data.category_id),
        mission_type: data.mission_type,
        scheduled_date: cleanUndefined(data.scheduled_date),
        duration_value: cleanUndefined(data.duration_value),
        duration_unit: cleanUndefined(data.duration_unit),
        start_date: cleanUndefined(data.start_date),
        duration: cleanUndefined(data.duration),
        location: {
          address: data.location?.address,
          quarter: cleanUndefined(data.location?.quarter),
          city: data.location?.city,
          postal_code: cleanUndefined(data.location?.postal_code),
          country: data.location?.country,
          latitude: cleanUndefined(data.location?.latitude),
          longitude: cleanUndefined(data.location?.longitude),
          location_type: data.location?.location_type || "onsite",
        },
        required_skills: data.required_skills || [],
        preferred_skills: data.preferred_skills || [],
        proposed_amount: data.proposed_amount,
        accepted_amount: cleanUndefined(data.accepted_amount),
        payment_type: data.payment_type,
        min_amount: cleanUndefined(data.min_amount),
        max_amount: cleanUndefined(data.max_amount),
        is_urgent: data.is_urgent,
        is_featured: data.is_featured,
        tags: data.tags || [],
        images: data.images || [],
      };
      await updateService({ id: serviceId, data: updateData });
      toast.success("Service mis à jour avec succès !");
      router.push(`/dashboard/customer/services/${serviceId}`);
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
    }
  };

  const handleCancel = () => router.back();

  if (isLoadingService) return <ServiceLoading />;
  if (!serviceData) return <ServiceError error="Service non trouvé" onRetry={() => router.back()} />;

  const inputClass = cn(
    "w-full px-4 py-3 rounded-xl border transition-all duration-200",
    "border-gray-200 dark:border-gray-700",
    "bg-white dark:bg-gray-900",
    "text-text-primary dark:text-gray-100",
    "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary",
    "disabled:opacity-50 disabled:cursor-not-allowed"
  );
  
  const labelClass = "block text-sm font-medium text-text-secondary dark:text-gray-400 mb-1.5";
  const errorClass = "text-sm text-red-500 dark:text-red-400 mt-1";
  const sectionClass = "bg-surface dark:bg-gray-800 rounded-2xl p-6 space-y-5 border border-gray-100 dark:border-gray-700 shadow-sm";

  const formatCurrency = (amount: number) => `${amount?.toLocaleString()} CFA`;

  return (
    <main className="bg-background dark:bg-gray-900 min-h-screen transition-colors duration-300">
      {/* Header avec dégradé */}
      <div className="bg-gradient-to-r from-primary to-secondary px-6 py-8 rounded-b-3xl mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                Modifier le service
              </h1>
              <p className="text-primary-100">
                Service #{serviceData.code || serviceId}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {mounted && (
                <button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
                >
                  {theme === "dark" ? (
                    <Icon icon="ph:sun" className="w-5 h-5 text-white" />
                  ) : (
                    <Icon icon="ph:moon" className="w-5 h-5 text-white" />
                  )}
                </button>
              )}
              <button
                type="button"
                onClick={handleCancel}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-all backdrop-blur-sm"
              >
                <Icon icon="ph:x" className="w-5 h-5 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Section 1: Informations générales */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:info" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Informations générales
              </h2>
            </div>

            <div>
              <label className={labelClass}>Titre du service *</label>
              <input type="text" {...register("title")} className={inputClass} />
              {errors.title && <p className={errorClass}>{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type de service *</label>
                <select {...register("service_type")} className={inputClass}>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="candidature">Candidature</option>
                  <option value="direct">Directe</option>
                </select>
                {errors.service_type && <p className={errorClass}>{errors.service_type.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Catégorie</label>
                <select {...register("category_id", { valueAsNumber: true })} className={inputClass}>
                  <option value="">Sélectionner une catégorie</option>
                  {categories?.map((cat: any) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
                {errors.category_id && <p className={errorClass}>{errors.category_id.message}</p>}
              </div>
            </div>

            <div>
              <label className={labelClass}>Type de mission *</label>
              <select {...register("mission_type")} className={inputClass}>
                <option value="hourly">⏱️ Prestation horaire</option>
                <option value="project">📦 Mission / Projet</option>
              </select>
              {errors.mission_type && <p className={errorClass}>{errors.mission_type.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Description courte *</label>
              <textarea {...register("short_description")} rows={3} maxLength={250} className={inputClass} />
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-1">
                {watch("short_description")?.length || 0}/250 caractères
              </p>
              {errors.short_description && <p className={errorClass}>{errors.short_description.message}</p>}
            </div>

            <div>
              <label className={labelClass}>Description complète</label>
              <textarea {...register("full_description")} rows={6} className={inputClass} />
            </div>
          </div>

          {/* Section 2: Détails pratiques */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:calendar" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                {missionType === "hourly" ? "Détails de la prestation" : "Détails du projet"}
              </h2>
            </div>

            {missionType === "hourly" ? (
              <div>
                <label className={labelClass}>Date et heure de la prestation *</label>
                <input type="datetime-local" {...register("scheduled_date")} className={inputClass} />
                {errors.scheduled_date && <p className={errorClass}>{errors.scheduled_date.message}</p>}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Durée estimée *</label>
                    <input type="number" {...register("duration_value", { valueAsNumber: true })} min="0" step="0.5" className={inputClass} />
                    {errors.duration_value && <p className={errorClass}>{errors.duration_value.message}</p>}
                  </div>
                  <div>
                    <label className={labelClass}>Unité *</label>
                    <select {...register("duration_unit")} className={inputClass}>
                      <option value="">Sélectionner</option>
                      <option value="hours">Heures</option>
                      <option value="days">Jours</option>
                      <option value="weeks">Semaines</option>
                      <option value="months">Mois</option>
                    </select>
                    {errors.duration_unit && <p className={errorClass}>{errors.duration_unit.message}</p>}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Date de début souhaitée</label>
                  <input type="date" {...register("start_date")} className={inputClass} />
                </div>
              </>
            )}
          </div>

          {/* Section 3: Localisation */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:map-pin" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Localisation
              </h2>
            </div>

            <div>
              <label className={labelClass}>Type de localisation</label>
              <select {...register("location.location_type")} className={inputClass}>
                <option value="onsite">🏢 Sur place</option>
                <option value="remote">💻 À distance</option>
                <option value="hybrid">🔄 Hybride</option>
              </select>
            </div>

            <div>
              <label className={labelClass}>Adresse *</label>
              <input type="text" {...register("location.address")} className={inputClass} />
              {errors.location?.address && <p className={errorClass}>{errors.location.address.message}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ville *</label>
                <input type="text" {...register("location.city")} className={inputClass} />
                {errors.location?.city && <p className={errorClass}>{errors.location.city.message}</p>}
              </div>
              <div>
                <label className={labelClass}>Quartier</label>
                <input type="text" {...register("location.quarter")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Code postal</label>
                <input type="text" {...register("location.postal_code")} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Pays</label>
                <input type="text" {...register("location.country")} className={inputClass} />
              </div>
            </div>
          </div>

          {/* Section 4: Compétences requises */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:code" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Compétences requises
              </h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                placeholder="Ex: Plomberie, Électricité..."
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddSkill} disabled={!skillInput.trim()} className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                <Icon icon="ph:plus" className="w-5 h-5" />
              </button>
            </div>
            {requiredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {requiredSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-primary/10 text-primary rounded-full text-sm">
                    <Icon icon="ph:check" className="w-3.5 h-3.5" />
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="hover:text-primary/70 ml-1">
                      <Icon icon="ph:x" className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 5: Compétences préférées */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:star" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Compétences préférées <span className="text-sm font-normal text-text-secondary">(optionnel)</span>
              </h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={prefSkillInput}
                onChange={(e) => setPrefSkillInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddPrefSkill())}
                placeholder="Compétences supplémentaires..."
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddPrefSkill} disabled={!prefSkillInput.trim()} className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                <Icon icon="ph:plus" className="w-5 h-5" />
              </button>
            </div>
            {preferredSkills.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {preferredSkills.map((skill) => (
                  <span key={skill} className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm">
                    <Icon icon="ph:star" className="w-3.5 h-3.5" />
                    {skill}
                    <button type="button" onClick={() => handleRemovePrefSkill(skill)} className="hover:text-green-600 ml-1">
                      <Icon icon="ph:x" className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Tags */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:tag" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Tags
              </h2>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                placeholder="Ex: urgent, livraison, 24h..."
                className={`${inputClass} flex-1`}
              />
              <button type="button" onClick={handleAddTag} disabled={!tagInput.trim()} className="px-4 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50">
                <Icon icon="ph:plus" className="w-5 h-5" />
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm">
                    <Icon icon="ph:tag" className="w-3.5 h-3.5" />
                    {tag}
                    <button type="button" onClick={() => handleRemoveTag(tag)} className="hover:text-purple-600 ml-1">
                      <Icon icon="ph:x" className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Section 7: Budget et paiement */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:currency-circle-dollar" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Budget et paiement
              </h2>
            </div>

            <div>
              <label className={labelClass}>Type de paiement *</label>
              <select {...register("payment_type")} className={inputClass}>
                <option value="fixed">💰 Prix fixe</option>
                <option value="hourly">⏱️ Taux horaire</option>
              </select>
            </div>

            {paymentType === "fixed" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Montant proposé (FCFA) *</label>
                  <div className="relative">
                    <input type="number" {...register("proposed_amount", { valueAsNumber: true })} min="0" step="1000" className={`${inputClass} pr-20`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">FCFA</span>
                  </div>
                  {errors.proposed_amount && <p className={errorClass}>{errors.proposed_amount.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Montant accepté (FCFA)</label>
                  <div className="relative">
                    <input type="number" {...register("accepted_amount", { valueAsNumber: true })} min="0" step="1000" className={`${inputClass} pr-20`} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary">FCFA</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Taux horaire min (FCFA) *</label>
                  <input type="number" {...register("min_amount", { valueAsNumber: true })} min="0" step="500" className={inputClass} />
                  {errors.min_amount && <p className={errorClass}>{errors.min_amount.message}</p>}
                </div>
                <div>
                  <label className={labelClass}>Taux horaire max (FCFA) *</label>
                  <input type="number" {...register("max_amount", { valueAsNumber: true })} min="0" step="500" className={inputClass} />
                  {errors.max_amount && <p className={errorClass}>{errors.max_amount.message}</p>}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-6 pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("is_urgent")} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-text-primary dark:text-gray-100">🚨 Urgent</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" {...register("is_featured")} className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-text-primary dark:text-gray-100">⭐ Mettre en avant</span>
              </label>
            </div>
          </div>

          {/* Section 8: Images existantes */}
          {watch("images") && watch("images")!.length > 0 && (
            <div className={sectionClass}>
              <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
                <Icon icon="ph:image" className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                  Images actuelles
                </h2>
              </div>
              <div className="grid grid-cols-4 gap-4">
                {watch("images")!.map((img: string, index: number) => (
                  <div key={index} className="relative group">
                    <img src={img} alt={`Service ${index + 1}`} className="w-full h-24 object-cover rounded-xl" />
                    <button
                      type="button"
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const currentImages = watch("images") || [];
                        setValue("images", currentImages.filter((_, i) => i !== index));
                      }}
                    >
                      <Icon icon="ph:x" className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 9: Nouvelle image */}
          <div className={sectionClass}>
            <div className="flex items-center gap-2 border-b border-gray-100 dark:border-gray-700 pb-3">
              <Icon icon="ph:plus-circle" className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-text-primary dark:text-gray-100">
                Ajouter des images
              </h2>
            </div>
            <div>
              <input type="file" accept="image/*" multiple className={cn(inputClass, "file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20")} />
              <p className="text-xs text-text-secondary dark:text-gray-400 mt-2">Format: JPG, PNG (max 5 Mo par image)</p>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex justify-end gap-4 pt-6 sticky bottom-4 bg-background/80 dark:bg-gray-900/80 backdrop-blur-sm py-4 rounded-xl">
            <button type="button" onClick={handleCancel} className="px-6 py-3 rounded-xl border border-gray-200 dark:border-gray-700 text-text-secondary dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all font-medium">
              Annuler
            </button>
            <button type="submit" disabled={isSubmitting || isUpdating} className="px-6 py-3 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100 flex items-center gap-2">
              {isSubmitting || isUpdating ? (
                <>
                  <Icon icon="ph:spinner" className="animate-spin w-5 h-5" />
                  Enregistrement...
                </>
              ) : (
                <>
                  <Icon icon="ph:floppy-disk" className="w-5 h-5" />
                  Enregistrer les modifications
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}