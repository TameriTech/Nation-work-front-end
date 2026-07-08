"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { useprovider } from "@/app/hooks/provider-profile/use-profile";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { toast } from "@/app/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog";
import {
  Language,
  LanguageLevel,
  LANGUAGE_LEVELS,
  COMMON_LANGUAGES,
} from "@/app/types";
import {
  providerProfileUpdateSchema,
  providerProfileUpdateFormData,
} from "@/app/lib/validators/user.validator";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Normalise les langues peu importe le format retourné par le backend :
 *  - "Français (fluent)"          → { language: "Français", level: "fluent" }
 *  - { language: "Français", level: "fluent" } → inchangé
 *  - "Français"                   → { language: "Français", level: "conversational" }
 */
const VALID_LEVELS: LanguageLevel[] = ["basic", "conversational", "fluent", "native"];

function normalizeLanguages(raw: unknown[]): Language[] {
  if (!Array.isArray(raw)) return [];

  return raw.map((item): Language => {
    // Déjà un objet { language, level }
    if (
      typeof item === "object" &&
      item !== null &&
      "language" in item &&
      "level" in item
    ) {
      const lvl = (item as any).level as string;
      return {
        language: String((item as any).language).trim(),
        level: VALID_LEVELS.includes(lvl as LanguageLevel)
          ? (lvl as LanguageLevel)
          : "conversational",
      };
    }

    // Chaîne "Français (fluent)"
    if (typeof item === "string") {
      const match = item.match(/^(.+?)\s*\((.+?)\)$/);
      if (match) {
        const lvl = match[2].toLowerCase() as LanguageLevel;
        return {
          language: match[1].trim(),
          level: VALID_LEVELS.includes(lvl) ? lvl : "conversational",
        };
      }
      // Chaîne simple "Français"
      return { language: item.trim(), level: "conversational" };
    }

    return { language: String(item), level: "conversational" };
  });
}

// ─── FieldError ───────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="flex items-center gap-1 text-xs text-red-500 mt-1">
      <Icon icon="ph:warning-circle" className="w-3.5 h-3.5 shrink-0" />
      {message}
    </p>
  );
}

// ─── LanguageModal ────────────────────────────────────────────────────────────

interface LanguageModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (lang: Language) => void;
  existing: Language[];
}

function LanguageModal({ open, onClose, onAdd, existing }: LanguageModalProps) {
  const [search,   setSearch]   = useState("");
  const [selected, setSelected] = useState<string>("");
  const [level,    setLevel]    = useState<LanguageLevel>("conversational");
  const [error,    setError]    = useState("");

  useEffect(() => {
    if (open) {
      setSearch(""); setSelected(""); setLevel("conversational"); setError("");
    }
  }, [open]);

  const filtered = COMMON_LANGUAGES.filter(
    (l) =>
      l.toLowerCase().includes(search.toLowerCase()) &&
      !existing.find((e) => e.language.toLowerCase() === l.toLowerCase())
  );

  const customEntry =
    search.trim() &&
    !COMMON_LANGUAGES.find((l) => l.toLowerCase() === search.toLowerCase()) &&
    !existing.find((e) => e.language.toLowerCase() === search.toLowerCase())
      ? search.trim()
      : null;

  const handleAdd = () => {
    const lang = selected || customEntry;
    if (!lang) { setError("Sélectionnez ou saisissez une langue"); return; }
    onAdd({ language: lang, level });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Icon icon="ph:translate" className="w-5 h-5 text-primary" />
            Ajouter une langue
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          <div>
            <Label>Langue</Label>
            <div className="relative mt-1">
              <Icon
                icon="ph:magnifying-glass"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />
              <Input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setSelected(""); setError(""); }}
                placeholder="Rechercher ou saisir une langue..."
                className="pl-9"
              />
            </div>

            {(filtered.length > 0 || customEntry) && (
              <ul className="mt-1 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden max-h-44 overflow-y-auto">
                {filtered.map((lang) => (
                  <li
                    key={lang}
                    onClick={() => { setSelected(lang); setSearch(lang); setError(""); }}
                    className={`px-3 py-2 cursor-pointer text-sm transition-colors flex items-center justify-between
                      ${selected === lang
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    {lang}
                    {selected === lang && <Icon icon="ph:check" className="w-4 h-4" />}
                  </li>
                ))}
                {customEntry && (
                  <li
                    onClick={() => { setSelected(customEntry); setError(""); }}
                    className={`px-3 py-2 cursor-pointer text-sm flex items-center gap-2 transition-colors
                      ${selected === customEntry
                        ? "bg-primary/10 text-primary font-medium"
                        : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                  >
                    <Icon icon="ph:plus-circle" className="w-4 h-4 text-primary" />
                    Ajouter &ldquo;{customEntry}&rdquo;
                  </li>
                )}
              </ul>
            )}
            {error && <FieldError message={error} />}
          </div>

          <div>
            <Label>Niveau</Label>
            <div className="grid grid-cols-2 gap-2 mt-1">
              {LANGUAGE_LEVELS.map((lvl) => (
                <button
                  key={lvl.value}
                  type="button"
                  onClick={() => setLevel(lvl.value)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-sm transition-all
                    ${level === lvl.value
                      ? "border-primary bg-primary/10 text-primary font-medium"
                      : "border-gray-200 dark:border-gray-700 hover:border-primary/50 hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                >
                  <Icon icon={lvl.icon} className="w-4 h-4 shrink-0" />
                  {lvl.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={onClose} className="rounded-full">
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleAdd}
              className="rounded-full bg-primary hover:bg-primary-dark"
            >
              <Icon icon="ph:plus" className="w-4 h-4 mr-1" />
              Ajouter
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function InformationsPage() {
  const router = useRouter();
  const { profile, updateProfile, isUpdating } = useprovider();
  const [langModalOpen, setLangModalOpen] = useState(false);
  // Garde : on ne rend le formulaire qu'une fois le profil chargé
  const [ready, setReady] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<providerProfileUpdateFormData>({
    resolver: zodResolver(providerProfileUpdateSchema),
    mode: "onChange",
    defaultValues: {
      professional_title:   "",
      professional_summary: "",
      tagline:              "",
      hourly_rate:          0,
      languages:            [],
      is_available:         false,
      willing_to_relocate:  false,
      first_name:           "",
      last_name:            "",
      bio:                  "",
      phone_number:         "",
      city:                 "",
      country:              "",
      date_of_birth:        "",
    },
  });

  const { fields: languageFields, append: appendLang, remove: removeLang } =
    useFieldArray({ control, name: "languages" });

  // ── Sync profil → formulaire ───────────────────────────────────────────────
  useEffect(() => {
    if (!profile) return;

    // Diagnostic : inspecte ce que le backend envoie réellement
    console.log("[InformationsPage] raw languages:", profile.provider_profile?.languages);

    const languages = normalizeLanguages(profile.provider_profile?.languages ?? []);
    console.log("[InformationsPage] normalized languages:", languages);

    reset(
      {
        professional_title:   profile.provider_profile?.professional_title   ?? "",
        professional_summary: profile.provider_profile?.professional_summary ?? "",
        tagline:              profile.provider_profile?.tagline              ?? "",
        hourly_rate:          profile.provider_profile?.hourly_rate          ?? 0,
        languages,
        is_available:         profile.provider_profile?.is_available         ?? false,
        willing_to_relocate:  profile.provider_profile?.willing_to_relocate  ?? false,
        first_name:           profile.first_name    ?? "",
        last_name:            profile.last_name     ?? "",
        bio:                  profile.bio           ?? "",
        phone_number:         profile.phone_number  ?? "",
        city:                 profile.city          ?? "",
        country:              profile.country       ?? "",
        date_of_birth:        profile.date_of_birth ?? "",
      },
      {
        // keepDirty: false → marque le form comme "propre" après le reset
        // keepDefaultValues: false → les nouvelles valeurs deviennent les defaults
        keepDirty: false,
        keepDefaultValues: false,
      }
    );

    setReady(true);
  }, [profile, reset]);

  // ── Submit ─────────────────────────────────────────────────────────────────
  const onSubmit = async (data: providerProfileUpdateFormData) => {
    try {
      await updateProfile(data);
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été enregistrées avec succès",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description:
          error?.response?.data?.detail ||
          error?.message ||
          "Impossible de mettre à jour le profil",
        variant: "destructive",
      });
    }
  };

  // ── Skeleton pendant le chargement ────────────────────────────────────────
  if (!ready) {
    return (
      <div className="min-h-screen bg-background dark:bg-gray-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-gray-400">
          <Icon icon="ph:spinner" className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm">Chargement du profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Informations personnelles
            </h1>
            <p className="text-text-secondary dark:text-gray-400">
              Gérez vos informations de base et votre profil professionnel
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-gray-600">

          {/* ── Informations professionnelles ── */}
          <Card className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Icon icon="ph:briefcase" className="w-5 h-5 text-primary" />
              Informations professionnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div className="md:col-span-2">
                <Label className="text-gray-700 dark:text-gray-300">
                  Titre professionnel <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("professional_title")}
                  placeholder="Ex: Développeur Full Stack Senior"
                  className={`mt-1 ${errors.professional_title ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.professional_title?.message} />
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-700 dark:text-gray-300">Résumé professionnel</Label>
                <Textarea
                  {...register("professional_summary")}
                  rows={4}
                  placeholder="Décrivez votre parcours professionnel, vos compétences clés et ce qui vous rend unique..."
                  className={`mt-1 ${errors.professional_summary ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.professional_summary?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Tagline</Label>
                <Input
                  {...register("tagline")}
                  placeholder="Ex: Expert JavaScript | React | Node.js"
                  className={`mt-1 ${errors.tagline ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <p className="text-xs text-gray-500 mt-1">Une courte phrase qui vous décrit</p>
                <FieldError message={errors.tagline?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Date de naissance</Label>
                <Input
                  type="date"
                  {...register("date_of_birth")}
                  className={`mt-1 ${errors.date_of_birth ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.date_of_birth?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Tarif horaire (€)</Label>
                <Input
                  type="number"
                  min="0"
                  step="5"
                  {...register("hourly_rate", { valueAsNumber: true })}
                  className={`mt-1 ${errors.hourly_rate ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.hourly_rate?.message} />
              </div>

              {/* ── Langues ── */}
              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-gray-700 dark:text-gray-300">
                    Langues <span className="text-red-500">*</span>
                  </Label>
                  <button
                    type="button"
                    onClick={() => setLangModalOpen(true)}
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Icon icon="ph:plus" className="w-3.5 h-3.5" />
                    Ajouter
                  </button>
                </div>

                {languageFields.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => setLangModalOpen(true)}
                    className="w-full flex items-center justify-center gap-2 border-2 border-dashed
                      border-gray-200 dark:border-gray-700 rounded-xl py-4 text-sm text-gray-400
                      hover:border-primary hover:text-primary transition-colors"
                  >
                    <Icon icon="ph:translate" className="w-4 h-4" />
                    Cliquez pour ajouter vos langues
                  </button>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {languageFields.map((field, index) => {
                      const lvl = LANGUAGE_LEVELS.find((l) => l.value === field.level);
                      return (
                        <span
                          key={field.id}
                          className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 bg-primary/10
                            text-primary rounded-full text-sm font-medium"
                        >
                          <Icon icon={lvl?.icon ?? "ph:globe"} className="w-3.5 h-3.5" />
                          {field.language}
                          <span className="text-xs opacity-70">· {lvl?.label}</span>
                          <button
                            type="button"
                            onClick={() => removeLang(index)}
                            className="ml-1 hover:text-red-500 transition-colors"
                          >
                            <Icon icon="ph:x" className="w-3.5 h-3.5" />
                          </button>
                        </span>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setLangModalOpen(true)}
                      className="flex items-center gap-1 px-3 py-1.5 border border-dashed border-gray-300
                        dark:border-gray-600 rounded-full text-sm text-gray-400 hover:border-primary
                        hover:text-primary transition-colors"
                    >
                      <Icon icon="ph:plus" className="w-3.5 h-3.5" />
                      Ajouter
                    </button>
                  </div>
                )}

                <FieldError
                  message={
                    errors.languages?.message ??
                    (errors.languages as any)?.root?.message
                  }
                />
              </div>

            </div>
          </Card>

          {/* ── Disponibilité ── */}
          <Card className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Icon icon="ph:calendar-check" className="w-5 h-5 text-primary" />
              Disponibilité
            </h2>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Controller
                  name="is_available"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="is_available"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="is_available" className="cursor-pointer">
                  Disponible pour de nouvelles missions
                </Label>
              </div>

              <div className="flex items-center gap-3">
                <Controller
                  name="willing_to_relocate"
                  control={control}
                  render={({ field }) => (
                    <Checkbox
                      id="willing_to_relocate"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  )}
                />
                <Label htmlFor="willing_to_relocate" className="cursor-pointer">
                  Prêt à déménager pour un poste
                </Label>
              </div>
            </div>
          </Card>

          {/* ── Informations personnelles ── */}
          <Card className="rounded-2xl p-6 border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-gray-100">
              <Icon icon="ph:user" className="w-5 h-5 text-primary" />
              Informations personnelles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Prénom <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("first_name")}
                  className={`mt-1 ${errors.first_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.first_name?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">
                  Nom <span className="text-red-500">*</span>
                </Label>
                <Input
                  {...register("last_name")}
                  className={`mt-1 ${errors.last_name ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.last_name?.message} />
              </div>

              <div className="md:col-span-2">
                <Label className="text-gray-700 dark:text-gray-300">Bio</Label>
                <Textarea
                  {...register("bio")}
                  rows={3}
                  placeholder="Parlez de vous, de votre parcours, de vos passions..."
                  className={`mt-1 ${errors.bio ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.bio?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Téléphone</Label>
                <Input
                  type="tel"
                  {...register("phone_number")}
                  placeholder="+33 6 12 34 56 78"
                  className={`mt-1 ${errors.phone_number ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.phone_number?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Ville</Label>
                <Input
                  {...register("city")}
                  placeholder="Paris"
                  className={`mt-1 ${errors.city ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.city?.message} />
              </div>

              <div>
                <Label className="text-gray-700 dark:text-gray-300">Pays</Label>
                <Input
                  {...register("country")}
                  placeholder="France"
                  className={`mt-1 ${errors.country ? "border-red-500 focus-visible:ring-red-500" : ""}`}
                />
                <FieldError message={errors.country?.message} />
              </div>

            </div>
          </Card>

          {/* ── Actions ── */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              className="rounded-full px-6"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isUpdating || !isDirty}
              className="bg-primary hover:bg-primary-dark rounded-full px-6"
            >
              {isUpdating ? (
                <>
                  <Icon icon="ph:spinner" className="w-4 h-4 mr-2 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Enregistrer les modifications"
              )}
            </Button>
          </div>

        </form>
      </div>

      <LanguageModal
        open={langModalOpen}
        onClose={() => setLangModalOpen(false)}
        onAdd={(lang) => appendLang(lang)}
        existing={languageFields}
      />
    </div>
  );
}
