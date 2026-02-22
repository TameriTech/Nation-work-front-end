// ===== FILE: app/dashboard/customer/services/[id]/edit/page.tsx =====

"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import {
  getServiceDetails,
  updateService,
} from "@/app/services/service.service";
import { ServicePayload } from "@/app/types/services";

export default function EditServicePage() {
  const router = useRouter();
  const params = useParams();
  const serviceId = Number(params.serviceId);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // État pour TOUS les champs du formulaire
  const [formData, setFormData] = useState<Partial<ServicePayload>>({
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
  });

  // État pour les erreurs de validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // État pour les compétences
  const [skillInput, setSkillInput] = useState("");

  // Charger les données du service au montage
  useEffect(() => {
    const loadService = async () => {
      try {
        setLoading(true);
        const service = await getServiceDetails(serviceId);

        setFormData({
          title: service.title,
          short_description: service.short_description,
          full_description: service.full_description || "",
          service_type: service.service_type as any,
          category_id: service.category_id,
          date_pratique: service.date_pratique?.split("T")[0] || "", // Format YYYY-MM-DD
          start_time: service.start_time || "",
          duration: service.duration || "",
          address: service.address,
          quarter: service.quarter || "",
          city: service.city || "",
          postal_code: service.postal_code || "",
          country: service.country || "Cameroun",
          latitude: service.latitude,
          longitude: service.longitude,
          required_skills: service.required_skills || [],
          proposed_amount: service.proposed_amount || service.budget,
          accepted_amount: service.accepted_amount,
          images: service.images || [],
        });
      } catch (err: any) {
        setError(err.message || "Erreur lors du chargement du service");
        toast.error("Impossible de charger le service");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      loadService();
    }
  }, [serviceId]);

  // Gestionnaire de changement pour les champs simples
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value, type } = e.target;

    setFormData((prev: any) => ({
      ...prev,
      [name]: type === "number" ? (value ? Number(value) : 0) : value,
    }));

    // Effacer l'erreur du champ
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
      setFormData((prev: any) => ({
        ...prev,
        required_skills: [...(prev.required_skills || []), skillInput.trim()],
      }));
      setSkillInput("");
    }
  };

  // Gestionnaire pour supprimer une compétence
  const handleRemoveSkill = (skill: string) => {
    setFormData((prev: any) => ({
      ...prev,
      required_skills:
        prev.required_skills?.filter((s: string) => s !== skill) || [],
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

    setSaving(true);

    try {
      await updateService(serviceId, formData);
      toast.success("Service mis à jour avec succès !");

      // Redirection vers la page de détails
      router.push(`/dashboard/customer/services/${serviceId}`);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Erreur lors de la mise à jour");
      console.log("Error updating service: ", error);
    } finally {
      setSaving(false);
    }
  };

  // Annulation
  const handleCancel = () => {
    router.back();
  };

  // Classes CSS communes
  const inputClass =
    "w-full px-4 py-3 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-900 disabled:bg-gray-50 disabled:text-gray-500";
  const labelClass = "block text-sm font-medium text-gray-600 mb-1";
  const errorClass = "text-sm text-red-500 mt-1";

  // Affichage du chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:loading"
            className="animate-spin text-4xl text-blue-600 mx-auto mb-4"
          />
          <p className="text-gray-600">Chargement du service...</p>
        </div>
      </div>
    );
  }

  // Affichage de l'erreur
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Icon
            icon="mdi:alert-circle"
            className="text-4xl text-red-500 mx-auto mb-4"
          />
          <p className="text-gray-800 font-medium mb-2">Erreur de chargement</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white rounded py-8">
      <div className="mx-auto px-4">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Modifier le service
            </h1>
            <p className="text-sm text-gray-500 mt-1">ID: #{serviceId}</p>
          </div>
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
              <p className="text-xs text-gray-400 mt-1">
                {formData.short_description?.length || 0}/250
              </p>
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
                <label className={labelClass}>Heure de début</label>
                <input
                  type="time"
                  name="start_time"
                  value={formData.start_time}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Durée estimée</label>
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
                  {formData.required_skills.map((skill: string) => (
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
                    className={`${inputClass} pr-16`}
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
          {formData.images && formData.images.length > 0 && (
            <div className="bg-white rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                Images actuelles
              </h2>
              <div className="grid grid-cols-4 gap-4">
                {formData.images.map((img: string, index: number) => (
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
                        // Logique pour supprimer l'image
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
          <div className="bg-white rounded-2xl p-6 space-y-4">
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
                // Gestion de l'upload à implémenter
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
              disabled={saving}
              className="px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? (
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
