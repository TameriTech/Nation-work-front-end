// app/dashboard/customer/profile/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";

import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Badge } from "@/app/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/app/components/ui/avatar";
import { Separator } from "@/app/components/ui/separator";
import { Switch } from "@/app/components/ui/switch";

import { useAuth } from "@/app/hooks/auth/use-auth";
import { useUser, useClientStats, useUserHistory } from "@/app/hooks/auth/use-user";
import { ChangePasswordFormData, ChangePasswordSchema, ProfileUpdateFormData, ProfileUpdateSchema } from "@/app/lib/validators";
import { formatDate } from "@/app/lib/utils";


// Options pour les sélecteurs
const languages = [
  { code: "fr", name: "Français" },
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "de", name: "Deutsch" },
  { code: "pt", name: "Português" },
  { code: "ar", name: "العربية" },
];

const currencies = [
  { code: "XOF", name: "FCFA", symbol: "FCFA" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "USD", name: "Dollar US", symbol: "$" },
  { code: "GBP", name: "Livre Sterling", symbol: "£" },
  { code: "CHF", name: "Franc Suisse", symbol: "CHF" },
  { code: "CAD", name: "Dollar Canadien", symbol: "CA$" },
];

const timezones = [
  "Africa/Douala",
  "Africa/Lagos",
  "Africa/Abidjan",
  "Africa/Cairo",
  "Africa/Johannesburg",
  "Europe/Paris",
  "Europe/London",
  "America/New_York",
  "America/Los_Angeles",
  "Asia/Dubai",
  "Asia/Tokyo",
  "Australia/Sydney",
];

// Composant de chargement
const ProfileSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="h-8 bg-gray-200 rounded w-1/4"></div>
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1">
        <div className="h-64 bg-gray-100 rounded-2xl"></div>
      </div>
      <div className="lg:col-span-2">
        <div className="h-96 bg-gray-100 rounded-2xl"></div>
      </div>
    </div>
  </div>
);

// Composant StatCard
const StatCard = ({ title, value, icon, trend }: { title: string; value: string | number; icon: string; trend?: { value: number; positive: boolean } }) => (
  <Card className="bg-white rounded-2xl border border-gray-100">
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {trend && (
            <div className="flex items-center gap-1">
              <Icon 
                icon={trend.positive ? "bi:arrow-up" : "bi:arrow-down"} 
                className={`w-4 h-4 ${trend.positive ? "text-green-500" : "text-red-500"}`}
              />
              <span className={`text-xs ${trend.positive ? "text-green-500" : "text-red-500"}`}>
                {trend.value}% ce mois
              </span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Icon icon={icon} className="w-6 h-6 text-blue-600" />
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function CustomerProfilePage() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isEditing, setIsEditing] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<Record<string, boolean>>({
    email_new_applications: true,
    email_messages: true,
    email_payments: true,
    push_notifications: true,
    newsletter: false,
    marketing_offers: false,
  });

  const {
    profile,
    isLoadingProfile,
    updateProfile,
    isUpdating,
    uploadAvatar,
    isUploading,
    changePassword,
    isChangingPassword,
    deleteAccount,
    isDeleting,
  } = useUser(user?.id);

  const { stats, isLoading: statsLoading } = useClientStats(user?.id || 0);
  const { history, isLoading: historyLoading } = useUserHistory(user?.id || 0);

  // Formulaire de profil
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateFormData>({
    resolver: zodResolver(ProfileUpdateSchema),
    defaultValues: {
      username: "",
      first_name: "",
      last_name: "",
      phone_number: "",
      profile_picture: "",
      language: "fr",
      timezone: "Africa/Douala",
      currency: "XOF",
      notification_preferences: notificationPrefs,
      social_links: {
        website: "",
        linkedin: "",
        twitter: "",
        github: "",
        behance: "",
        dribbble: "",
      },
    },
  });

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPassword,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  });

  // Watchers pour les champs conditionnels
  const selectedLanguage = watch("language");
  const selectedCurrency = watch("currency");
  const selectedTimezone = watch("timezone");

  // Mettre à jour les valeurs par défaut quand le profil est chargé
  useEffect(() => {
    if (profile) {
      reset({
        username: profile.username || "",
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone_number: profile.phone_number || "",
        profile_picture: profile.profile_picture || "",
        language: profile.language || "fr",
        timezone: profile.timezone || "Africa/Douala",
        currency: profile.currency || "XOF",
        notification_preferences: profile.notification_preferences || notificationPrefs,
        social_links: {
          website: profile.social_links?.website || "",
          linkedin: profile.social_links?.linkedin || "",
          twitter: profile.social_links?.twitter || "",
          github: profile.social_links?.github || "",
          behance: profile.social_links?.behance || "",
          dribbble: profile.social_links?.dribbble || "",
        },
      });

      if (profile.notification_preferences) {
        setNotificationPrefs(profile.notification_preferences);
      }
    }
  }, [profile, reset]);

  // Gérer l'upload d'avatar
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("L'image ne doit pas dépasser 5 Mo");
        return;
      }
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAvatarUpload = async () => {
    if (avatarFile) {
      await uploadAvatar(avatarFile);
      setAvatarFile(null);
      setAvatarPreview(null);
    }
  };

  // Gérer les changements de préférences de notification
  const handleNotificationChange = (key: string, checked: boolean) => {
    const updatedPrefs = { ...notificationPrefs, [key]: checked };
    setNotificationPrefs(updatedPrefs);
    setValue("notification_preferences", updatedPrefs);
  };

  // Soumettre le formulaire de profil
  const onProfileSubmit = async (data: ProfileUpdateFormData) => {
    if (user?.id) {
      await updateProfile({ id: user.id, data });
      setIsEditing(false);
      toast.success("Profil mis à jour avec succès");
    }
  };

  // Soumettre le formulaire de mot de passe
  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    await changePassword(data);
  };

  // Supprimer le compte
  const handleDeleteAccount = async (password: string) => {
    await deleteAccount(password);
  };

  if (authLoading || isLoadingProfile) {
    return <ProfileSkeleton />;
  }

  if (!user || !profile) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <Icon icon="bi:exclamation-triangle" className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900">Profil non trouvé</h2>
        <p className="text-gray-500 mt-2">Impossible de charger votre profil</p>
        <Button onClick={() => router.push("/")} className="mt-4 rounded-full">
          Retour à l'accueil
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white/50  px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
          <p className="text-gray-500 mt-1">Gérez vos informations personnelles</p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push("/dashboard/customer")}
          className="rounded-full"
        >
          <Icon icon="bi:arrow-left" className="mr-2 h-4 w-4" />
          Retour au tableau de bord
        </Button>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Services publiés"
          value={stats?.total_services || 0}
          icon="bi:grid"
          trend={{ value: 12, positive: true }}
        />
        <StatCard
          title="Dépenses totales"
          value={`${stats?.total_spent?.toLocaleString() || 0} ${profile.currency || 'FCFA'}`}
          icon="bi:wallet2"
          trend={{ value: 8, positive: false }}
        />
        <StatCard
          title="Candidatures reçues"
          value={stats?.total_applications || 0}
          icon="bi:people"
          trend={{ value: 15, positive: true }}
        />
        <StatCard
          title="Taux de réponse"
          value={`${stats?.response_rate || 0}%`}
          icon="bi:chat"
          trend={{ value: 5, positive: true }}
        />
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="bg-gray-100 p-1 rounded-full">
          <TabsTrigger value="profile" className="rounded-full data-[state=active]:bg-white">
            <Icon icon="bi:person" className="mr-2 h-4 w-4" />
            Informations personnelles
          </TabsTrigger>
          <TabsTrigger value="social" className="rounded-full data-[state=active]:bg-white">
            <Icon icon="bi:share" className="mr-2 h-4 w-4" />
            Réseaux sociaux
          </TabsTrigger>
          <TabsTrigger value="preferences" className="rounded-full data-[state=active]:bg-white">
            <Icon icon="bi:gear" className="mr-2 h-4 w-4" />
            Préférences
          </TabsTrigger>
          <TabsTrigger value="security" className="rounded-full data-[state=active]:bg-white">
            <Icon icon="bi:shield-lock" className="mr-2 h-4 w-4" />
            Sécurité
          </TabsTrigger>
          <TabsTrigger value="activity" className="rounded-full data-[state=active]:bg-white">
            <Icon icon="bi:clock-history" className="mr-2 h-4 w-4" />
            Activité récente
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne gauche - Avatar */}
            <Card className="lg:col-span-1 rounded-2xl border border-gray-100">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage
                        src={avatarPreview || profile.profile_picture || "/images/avatar-placeholder.png"}
                        alt={profile.username}
                      />
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl">
                        {profile.username?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <label
                      htmlFor="avatar-upload"
                      className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors"
                    >
                      <Icon icon="bi:camera" className="w-4 h-4 text-white" />
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleAvatarChange}
                    />
                  </div>

                  {avatarFile && (
                    <div className="mt-4 flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleAvatarUpload}
                        disabled={isUploading}
                        className="rounded-full"
                      >
                        {isUploading ? (
                          <Icon icon="mdi:loading" className="animate-spin mr-1 h-4 w-4" />
                        ) : (
                          <Icon icon="bi:check" className="mr-1 h-4 w-4" />
                        )}
                        Enregistrer
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setAvatarFile(null);
                          setAvatarPreview(null);
                        }}
                        className="rounded-full"
                      >
                        Annuler
                      </Button>
                    </div>
                  )}

                  <div className="mt-4 text-center">
                    <h3 className="font-semibold text-gray-900">
                      {profile.first_name && profile.last_name
                        ? `${profile.first_name} ${profile.last_name}`
                        : profile.username}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Membre depuis {formatDate(profile.created_at)}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {profile.id}
                    </p>
                  </div>

                  <Separator className="my-4" />

                  <div className="w-full space-y-3">
                    {profile.email && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="bi:envelope" className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.email}</span>
                      </div>
                    )}
                    {profile.phone_number && (
                      <div className="flex items-center gap-2 text-sm">
                        <Icon icon="bi:telephone" className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">{profile.phone_number}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="bi:translate" className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Langue: {languages.find(l => l.code === profile.language)?.name || profile.language}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Icon icon="bi:currency-exchange" className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">
                        Devise: {profile.currency}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Colonne droite - Formulaire */}
            <Card className="lg:col-span-2 rounded-2xl border border-gray-100">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Informations personnelles
                </CardTitle>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="rounded-full"
                  >
                    <Icon icon="bi:pencil" className="mr-2 h-4 w-4" />
                    Modifier
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        reset();
                      }}
                      className="rounded-full"
                    >
                      Annuler
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSubmit(onProfileSubmit)}
                      disabled={isUpdating}
                      className="rounded-full"
                    >
                      {isUpdating ? (
                        <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                      ) : (
                        <Icon icon="bi:check" className="mr-2 h-4 w-4" />
                      )}
                      Enregistrer
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit(onProfileSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="first_name">Prénom</Label>
                      <Input
                        id="first_name"
                        {...register("first_name")}
                        disabled={!isEditing}
                        className="mt-1.5"
                      />
                      {errors.first_name && (
                        <p className="text-sm text-red-500 mt-1">{errors.first_name.message}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="last_name">Nom</Label>
                      <Input
                        id="last_name"
                        {...register("last_name")}
                        disabled={!isEditing}
                        className="mt-1.5"
                      />
                      {errors.last_name && (
                        <p className="text-sm text-red-500 mt-1">{errors.last_name.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="username">Nom d'utilisateur</Label>
                    <Input
                      id="username"
                      {...register("username")}
                      disabled={!isEditing}
                      className="mt-1.5"
                    />
                    {errors.username && (
                      <p className="text-sm text-red-500 mt-1">{errors.username.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone_number">Téléphone</Label>
                    <Input
                      id="phone_number"
                      {...register("phone_number")}
                      disabled={!isEditing}
                      className="mt-1.5"
                      placeholder="+237 6XXXXXXXX"
                    />
                    {errors.phone_number && (
                      <p className="text-sm text-red-500 mt-1">{errors.phone_number.message}</p>
                    )}
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Réseaux sociaux */}
        <TabsContent value="social">
          <Card className="rounded-2xl border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Réseaux sociaux
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-full"
                >
                  <Icon icon="bi:pencil" className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="rounded-full"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(onProfileSubmit)}
                    disabled={isUpdating}
                    className="rounded-full"
                  >
                    {isUpdating ? (
                      <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Icon icon="bi:check" className="mr-2 h-4 w-4" />
                    )}
                    Enregistrer
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="website">Site web</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:globe" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="website"
                      {...register("social_links.website")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://..."
                    />
                  </div>
                  {errors.social_links?.website && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.website.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:linkedin" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="linkedin"
                      {...register("social_links.linkedin")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://linkedin.com/in/..."
                    />
                  </div>
                  {errors.social_links?.linkedin && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.linkedin.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="twitter">Twitter / X</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:twitter-x" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="twitter"
                      {...register("social_links.twitter")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://twitter.com/..."
                    />
                  </div>
                  {errors.social_links?.twitter && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.twitter.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:github" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="github"
                      {...register("social_links.github")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://github.com/..."
                    />
                  </div>
                  {errors.social_links?.github && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.github.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="behance">Behance</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:behance" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="behance"
                      {...register("social_links.behance")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://behance.net/..."
                    />
                  </div>
                  {errors.social_links?.behance && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.behance.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dribbble">Dribbble</Label>
                  <div className="relative mt-1.5">
                    <Icon icon="bi:dribbble" className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      id="dribbble"
                      {...register("social_links.dribbble")}
                      disabled={!isEditing}
                      className="pl-10"
                      placeholder="https://dribbble.com/..."
                    />
                  </div>
                  {errors.social_links?.dribbble && (
                    <p className="text-sm text-red-500 mt-1">{errors.social_links.dribbble.message}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences">
          <Card className="rounded-2xl border border-gray-100">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold text-gray-900">
                Préférences
              </CardTitle>
              {!isEditing ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="rounded-full"
                >
                  <Icon icon="bi:pencil" className="mr-2 h-4 w-4" />
                  Modifier
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      reset();
                    }}
                    className="rounded-full"
                  >
                    Annuler
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSubmit(onProfileSubmit)}
                    disabled={isUpdating}
                    className="rounded-full"
                  >
                    {isUpdating ? (
                      <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Icon icon="bi:check" className="mr-2 h-4 w-4" />
                    )}
                    Enregistrer
                  </Button>
                </div>
              )}
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Langue et région */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Langue et région</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="language">Langue</Label>
                    <select
                      id="language"
                      {...register("language")}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.name}
                        </option>
                      ))}
                    </select>
                    {errors.language && (
                      <p className="text-sm text-red-500 mt-1">{errors.language.message}</p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="currency">Devise</Label>
                    <select
                      id="currency"
                      {...register("currency")}
                      disabled={!isEditing}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currencies.map((cur) => (
                        <option key={cur.code} value={cur.code}>
                          {cur.name} ({cur.symbol})
                        </option>
                      ))}
                    </select>
                    {errors.currency && (
                      <p className="text-sm text-red-500 mt-1">{errors.currency.message}</p>
                    )}
                  </div>
                </div>
                <div>
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <select
                    id="timezone"
                    {...register("timezone")}
                    disabled={!isEditing}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-white mt-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {timezones.map((tz) => (
                      <option key={tz} value={tz}>
                        {tz.replace("_", " ")}
                      </option>
                    ))}
                  </select>
                  {errors.timezone && (
                    <p className="text-sm text-red-500 mt-1">{errors.timezone.message}</p>
                  )}
                </div>
              </div>

              <Separator />

              {/* Notifications email */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Notifications par email</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Nouvelles candidatures</p>
                      <p className="text-xs text-gray-500">
                        Recevoir un email quand un freelance postule
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_new_applications}
                      onCheckedChange={(checked) => handleNotificationChange("email_new_applications", checked)}
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Messages</p>
                      <p className="text-xs text-gray-500">
                        Recevoir un email pour les nouveaux messages
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_messages}
                      onCheckedChange={(checked) => handleNotificationChange("email_messages", checked)}
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Paiements</p>
                      <p className="text-xs text-gray-500">
                        Recevoir un email pour les confirmations de paiement
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.email_payments}
                      onCheckedChange={(checked) => handleNotificationChange("email_payments", checked)}
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Newsletter</p>
                      <p className="text-xs text-gray-500">
                        Recevoir notre newsletter mensuelle
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.newsletter}
                      onCheckedChange={(checked) => handleNotificationChange("newsletter", checked)}
                      disabled={!isEditing}
                    />
                  </label>

                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Offres marketing</p>
                      <p className="text-xs text-gray-500">
                        Recevoir des offres promotionnelles
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.marketing_offers}
                      onCheckedChange={(checked) => handleNotificationChange("marketing_offers", checked)}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>

              <Separator />

              {/* Notifications push */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-700">Notifications push</h3>
                <div className="space-y-3">
                  <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Alertes en temps réel</p>
                      <p className="text-xs text-gray-500">
                        Recevoir des notifications dans le navigateur
                      </p>
                    </div>
                    <Switch
                      checked={notificationPrefs.push_notifications}
                      onCheckedChange={(checked) => handleNotificationChange("push_notifications", checked)}
                      disabled={!isEditing}
                    />
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Changer le mot de passe */}
            <Card className="rounded-2xl border border-gray-100">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  Changer le mot de passe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handlePasswordSubmit(onPasswordSubmit)} className="space-y-4">
                  <div>
                    <Label htmlFor="current_password">Mot de passe actuel *</Label>
                    <Input
                      id="current_password"
                      type="password"
                      {...registerPassword("current_password")}
                      className="mt-1.5"
                    />
                    {passwordErrors.current_password && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordErrors.current_password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="new_password">Nouveau mot de passe *</Label>
                    <Input
                      id="new_password"
                      type="password"
                      {...registerPassword("new_password")}
                      className="mt-1.5"
                    />
                    {passwordErrors.new_password && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordErrors.new_password.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="confirm_password">Confirmer le mot de passe *</Label>
                    <Input
                      id="confirm_password"
                      type="password"
                      {...registerPassword("confirm_password")}
                      className="mt-1.5"
                    />
                    {passwordErrors.confirm_password && (
                      <p className="text-sm text-red-500 mt-1">
                        {passwordErrors.confirm_password.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={isChangingPassword}
                    className="w-full rounded-full mt-2"
                  >
                    {isChangingPassword ? (
                      <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                    ) : (
                      <Icon icon="bi:shield-check" className="mr-2 h-4 w-4" />
                    )}
                    Mettre à jour le mot de passe
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Supprimer le compte */}
            <Card className="rounded-2xl border border-red-100 bg-red-50">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-red-900">
                  Zone dangereuse
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-red-700 mb-4">
                  Une fois votre compte supprimé, toutes vos données seront définitivement effacées.
                  Cette action est irréversible.
                </p>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" className="rounded-full">
                      <Icon icon="bi:trash" className="mr-2 h-4 w-4" />
                      Supprimer mon compte
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Êtes-vous absolument sûr ?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Cette action est irréversible. Toutes vos données personnelles, vos services
                        et votre historique seront définitivement supprimés.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-4">
                      <Label htmlFor="confirm-password">Confirmez votre mot de passe</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        placeholder="Entrez votre mot de passe"
                        className="mt-1.5"
                        onChange={(e) => {
                          // Stocker le mot de passe dans une variable d'état si nécessaire
                        }}
                      />
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="rounded-full">Annuler</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          const password = (document.getElementById("confirm-password") as HTMLInputElement)?.value;
                          if (password) handleDeleteAccount(password);
                        }}
                        className="bg-red-600 hover:bg-red-700 rounded-full"
                      >
                        {isDeleting ? (
                          <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                        ) : (
                          <Icon icon="bi:trash" className="mr-2 h-4 w-4" />
                        )}
                        Supprimer définitivement
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Activité récente */}
        <TabsContent value="activity">
          <Card className="rounded-2xl border border-gray-100">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-gray-900">
                Historique des activités
              </CardTitle>
            </CardHeader>
            <CardContent>
              {historyLoading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                  ))}
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <Icon icon="bi:clock-history" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Aucune activité récente</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {history.items.map((item: any) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon
                          icon={
                            item.type === "service"
                              ? "bi:grid"
                              : item.type === "payment"
                              ? "bi:wallet2"
                              : "bi:chat"
                          }
                          className="w-5 h-5 text-blue-600"
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.description}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(item.created_at)}
                        </p>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          item.status === "success"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : item.status === "pending"
                            ? "bg-orange-100 text-orange-700 border-orange-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                        }
                      >
                        {item.status === "success"
                          ? "Succès"
                          : item.status === "pending"
                          ? "En attente"
                          : "Terminé"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
