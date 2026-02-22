// ===== FILE: app/dashboard/customer/services/create/page.tsx =====
// Page de création de service

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { publishService, updateService } from "@/app/services/service.service";
import { ServicePayload, ServiceType } from "@/app/types/services";

interface ServiceFormProps {
  mode?: "create" | "edit";
  serviceId?: number;
  initialData?: Partial<ServicePayload>;
}

export default function ServiceFormPage({
  mode = "create",
  serviceId,
  initialData = {},
}: ServiceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // État local pour tous les champs du formulaire
  const [formData, setFormData] = useState<Partial<ServicePayload>>({
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
    images: [
      "https://example-cm.com/images/catering-1.jpg",
      "https://example-cm.com/images/catering-2.jpg",
    ],
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // État pour les compétences (tag input)
  const [skillInput, setSkillInput] = useState("");

  // Gestionnaire de changement pour les champs simples
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : 0) : value,
    }));

    // Effacer l'erreur du champ quand l'utilisateur tape
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Gestionnaire pour ajouter une compétence
  const handleAddSkill = () => {
    if (
      skillInput.trim() &&
      !formData.required_skills?.includes(skillInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        required_skills: [...(prev.required_skills || []), skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Gestionnaire pour supprimer une compétence
  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      required_skills: prev.required_skills?.filter((s) => s !== skill) || [],
    }));
  };

  // Validation du formulaire
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title?.trim()) {
      newErrors.title = "Le titre est requis";
    } else if (formData.title.length < 5) {
      newErrors.title = "Le titre doit contenir au moins 5 caractères";
    }

    if (!formData.short_description?.trim()) {
      newErrors.short_description = "La description courte est requise";
    }

    if (!formData.date_pratique) {
      newErrors.date_pratique = "La date est requise";
    }

    if (!formData.start_time) {
      newErrors.start_time = "L'heure de début est requise";
    }

    if (!formData.duration) {
      newErrors.duration = "La durée est requise";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "L'adresse est requise";
    }

    if (!formData.city?.trim()) {
      newErrors.city = "La ville est requise";
    }

    if (!formData.proposed_amount || formData.proposed_amount <= 0) {
      newErrors.proposed_amount = "Le montant proposé doit être supérieur à 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Veuillez corriger les erreurs du formulaire");
      return;
    }

    setLoading(true);

    try {
      if (mode === "create") {
        await publishService(formData as ServicePayload);
        toast.success("Service publié avec succès !");
      } else if (mode === "edit" && serviceId) {
        await updateService(serviceId, formData);
        toast.success("Service mis à jour avec succès !");
      }

      // Redirection vers la liste des services
      router.push("/dashboard/customer/services");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    router.back();
  };

  // Classes CSS communes
  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const errorClass = "text-sm text-red-500 mt-1";

  return (
    <div className="min-h-screen bg-white py-8">
      <div className=" mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            {mode === "create"
              ? "Publier un nouveau service"
              : "Modifier le service"}
          </h1>
          <button
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon icon="mdi:close" className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Section 1: Informations générales */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Informations générales
            </h2>

            <div>
              <label className={labelClass}>Titre du service *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Développement d'une application mobile"
                className={inputClass}
              />
              {errors.title && <p className={errorClass}>{errors.title}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Type de service *</label>
                <select
                  name="service_type"
                  value={formData.service_type}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                  <option value="candidature">Candidature</option>
                  <option value="directe">Directe</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Catégorie</label>
                <select
                  name="category_id"
                  value={formData.category_id || ""}
                  onChange={(e) => handleChange(e as any)}
                  className={inputClass}
                >
                  <option value="">Sélectionner une catégorie</option>
                  <option value="1">Développement</option>
                  <option value="2">Design</option>
                  <option value="3">Rédaction</option>
                </select>
              </div>
            </div>

            <div>
              <label className={labelClass}>Description courte *</label>
              <textarea
                name="short_description"
                value={formData.short_description}
                onChange={handleChange}
                placeholder="Brève description du service (max 250 caractères)"
                rows={3}
                maxLength={250}
                className={inputClass}
              />
              {errors.short_description && (
                <p className={errorClass}>{errors.short_description}</p>
              )}
            </div>

            <div>
              <label className={labelClass}>Description complète</label>
              <textarea
                name="full_description"
                value={formData.full_description}
                onChange={handleChange}
                placeholder="Description détaillée du service..."
                rows={5}
                className={inputClass}
              />
            </div>
          </div>

          {/* Section 2: Détails pratiques */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Détails pratiques
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Date de prestation *</label>
                <input
                  type="date"
                  name="date_pratique"
                  value={formData.date_pratique}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.date_pratique && (
                  <p className={errorClass}>{errors.date_pratique}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Heure de début *</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={inputClass}
                />
                {errors.start_time && (
                  <p className={errorClass}>{errors.start_time}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Durée estimée *</label>
                <select
                  name="duration"
                  value={formData.duration}
                  onChange={handleChange}
                  className={inputClass}
                >
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
                  <p className={errorClass}>{errors.duration}</p>
                )}
              </div>
            </div>
          </div>

          {/* Section 3: Localisation */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Localisation
            </h2>

            <div>
              <label className={labelClass}>Adresse *</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Numéro et rue"
                className={inputClass}
              />
              {errors.address && <p className={errorClass}>{errors.address}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Ville *</label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Douala, Yaoundé..."
                  className={inputClass}
                />
                {errors.city && <p className={errorClass}>{errors.city}</p>}
              </div>

              <div>
                <label className={labelClass}>Quartier</label>
                <input
                  type="text"
                  name="quarter"
                  value={formData.quarter}
                  onChange={handleChange}
                  placeholder="Bonapriso, Mvog-Mbi..."
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Code postal</label>
                <input
                  type="text"
                  name="postal_code"
                  value={formData.postal_code}
                  onChange={handleChange}
                  placeholder="BP 1234"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Pays</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Section 4: Compétences */}
          <div className="bg-white rounded-2xl p-6 space-y-4">
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
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <Icon icon="mdi:plus" className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Liste des compétences */}
            {formData.required_skills &&
              formData.required_skills.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.required_skills.map((skill) => (
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
          <div className="bg-white rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
              Budget
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Montant proposé (FCFA) *</label>
                <div className="relative">
                  <input
                    type="number"
                    name="proposed_amount"
                    value={formData.proposed_amount}
                    onChange={handleChange}
                    min="0"
                    step="100"
                    className={`${inputClass} pr-12`}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
                {errors.proposed_amount && (
                  <p className={errorClass}>{errors.proposed_amount}</p>
                )}
              </div>

              <div>
                <label className={labelClass}>Montant accepté (FCFA)</label>
                <div className="relative">
                  <input
                    type="number"
                    name="accepted_amount"
                    value={formData.accepted_amount || ""}
                    onChange={handleChange}
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
          <div className="bg-white rounded-2xl p-6 space-y-4">
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
                // Gestion simplifiée - vous pouvez ajouter l'upload plus tard
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
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin h-5 w-5" />
                  Publication en cours...
                </>
              ) : (
                <>
                  <Icon icon="mdi:send" className="h-5 w-5" />
                  {mode === "create" ? "Publier le service" : "Mettre à jour"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
