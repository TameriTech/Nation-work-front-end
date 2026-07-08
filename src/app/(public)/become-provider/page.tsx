// app/(public)/devenir-freelance/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { cn } from "@/app/lib/utils";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

// Schéma de validation
const BecomeproviderSchema = z.object({
  full_name: z.string().min(2, "Le nom complet est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  profession: z.string().min(2, "La profession est requise"),
  experience: z.string().min(1, "Veuillez sélectionner votre niveau d'expérience"),
  skills: z.string().min(3, "Veuillez décrire vos compétences"),
  portfolio: z.string().optional(),
  message: z.string().optional(),
});

type BecomeproviderFormData = z.infer<typeof BecomeproviderSchema>;

// Composant d'avantage
function AdvantageCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm hover:shadow-md transition-all group">
      <div className="w-14 h-14 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon icon={icon} className="w-7 h-7 text-primary" />
      </div>
      <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-2">
        {title}
      </h3>
      <p className="text-sm text-text-secondary dark:text-gray-400">
        {description}
      </p>
    </div>
  );
}

// Version alternative avec effet de connexion entre les cartes
function StepCard({ number, title, description, icon, isLast }: { number: number; title: string; description: string; icon: string; isLast?: boolean }) {
  return (
    <div className="relative">
      {/* Ligne de connexion (sauf dernière) */}
      {!isLast && (
        <div className="hidden lg:block absolute top-1/2 left-full w-full -translate-y-1/2 z-0">
          <div className="relative w-12">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-primary/30 to-primary/10"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          </div>
        </div>
      )}

      {/* Carte */}
      <div className="group relative bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 dark:border-gray-700 hover:border-primary/30 z-10">
        {/* Numéro décoratif en cercle */}
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-bold shadow-lg">
          {number}
        </div>

        <div className="pt-2">
          {/* Icône animée */}
          <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-all group-hover:scale-110 duration-300">
            <Icon icon={icon} className="w-7 h-7 text-primary" />
          </div>

          {/* Titre */}
          <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-2">
            {title}
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary dark:text-gray-400">
            {description}
          </p>

          {/* Indicateur de progression */}
          <div className="mt-4 flex items-center gap-2">
            <div className="w-full h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-500 group-hover:opacity-100"
                style={{ width: `${(number / 4) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Version avec timeline verticale pour mobile
function StepCardTimeline({ number, title, description, icon, isLast }: { number: number; title: string; description: string; icon: string; isLast?: boolean }) {
  return (
    <div className="relative flex gap-4">
      {/* Colonne gauche avec timeline */}
      <div className="flex flex-col items-center">
        {/* Cercle de progression */}
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 text-white flex items-center justify-center text-lg font-bold shadow-lg z-10">
          {number}
        </div>
        
        {/* Ligne de connexion (sauf dernière) */}
        {!isLast && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-primary/10 my-2 min-h-[60px]"></div>
        )}
      </div>

      {/* Contenu */}
      <div className="flex-1 pb-8">
        <div className="bg-surface dark:bg-gray-800 rounded-xl p-5 shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon icon={icon} className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-semibold text-text-primary dark:text-gray-100">{title}</h3>
          </div>
          <p className="text-sm text-text-secondary dark:text-gray-400 pl-0">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

// Composant témoignage
function TestimonialCard({ name, role, content, avatar }: { name: string; role: string; content: string; avatar: string }) {
  return (
    <div className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-white font-bold text-lg">
          {avatar}
        </div>
        <div>
          <h4 className="font-semibold text-text-primary dark:text-gray-100">{name}</h4>
          <p className="text-xs text-text-secondary dark:text-gray-400">{role}</p>
        </div>
      </div>
      <div className="flex mb-3">
        {[...Array(5)].map((_, i) => (
          <Icon key={i} icon="ph:star-fill" className="w-4 h-4 text-yellow-500" />
        ))}
      </div>
      <p className="text-sm text-text-secondary dark:text-gray-300 italic">
        "{content}"
      </p>
    </div>
  );
}

export default function BecomeproviderPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<BecomeproviderFormData>({
    resolver: zodResolver(BecomeproviderSchema),
    defaultValues: {
      full_name: "",
      email: "",
      phone: "",
      profession: "",
      experience: "",
      skills: "",
      portfolio: "",
      message: "",
    },
  });

  const onSubmit = async (data: BecomeproviderFormData) => {
    setIsSubmitting(true);
    try {
      // Appel API à implémenter
      console.log("Formulaire soumis:", data);
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success("Demande envoyée avec succès !");
      toast.info("Nous vous contacterons dans les plus brefs délais");
      
      reset();
      router.push("/");
    } catch (error) {
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 dark:from-primary-400/5 dark:via-primary-400/10 dark:to-primary-400/5">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-30"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 mt-16 relative">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6">
              <Icon icon="ph:rocket" className="w-4 h-4" />
              <span>Rejoignez notre communauté</span>
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-text-primary dark:text-gray-100 mb-6">
              Devenez freelance sur{" "}
              <span className="text-primary">Nation Work</span>
            </h1>
            <p className="text-lg text-text-secondary dark:text-gray-400 mb-8 max-w-2xl mx-auto">
              Rejoignez la plus grande plateforme de freelances au Sénégal.
              Trouvez des missions, gérez votre activité et développez votre carrière.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="#inscription">
                <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl px-8 py-3 text-lg">
                  Commencer maintenant
                  <Icon icon="ph:arrow-right" className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="#avantages">
                <Button variant="outline" className="rounded-xl px-8 py-3 text-lg bg-transparent text-white border-primary/20 hover:border-primary/40 hover:bg-primary/10">
                  Découvrir les avantages
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary">200+</div>
              <div className="text-sm text-text-secondary dark:text-gray-400">Freelances actifs</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">1500+</div>
              <div className="text-sm text-text-secondary dark:text-gray-400">Missions réalisées</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">98%</div>
              <div className="text-sm text-text-secondary dark:text-gray-400">Taux de satisfaction</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24/7</div>
              <div className="text-sm text-text-secondary dark:text-gray-400">Support disponible</div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section id="avantages" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-4">
              Pourquoi rejoindre{" "}
              <span className="text-primary">Nation Work ?</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez tous les avantages de travailler avec nous
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <AdvantageCard
              icon="ph:clock"
              title="Gérez votre temps"
              description="Travaillez quand vous voulez, où vous voulez. Gérez votre emploi du temps librement."
            />
            <AdvantageCard
              icon="ph:currency-circle-euro"
              title="Gagnez plus"
              description="Fixez vos propres tarifs et gagnez ce que vous méritez. Pas de commission cachée."
            />
            <AdvantageCard
              icon="ph:users"
              title="Large réseau"
              description="Accédez à des milliers de clients potentiels et développez votre carrière."
            />
            <AdvantageCard
              icon="ph:shield-check"
              title="Paiement sécurisé"
              description="Soyez payé en toute sécurité. Nos systèmes protègent vos transactions."
            />
          </div>
        </div>
      </section>

      {/* Comment ça marche Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-4">
              Comment{" "}
              <span className="text-primary">ça marche ?</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Rejoignez-nous en quelques étapes simples
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <StepCard
              number={1}
              icon="ph:user-plus"
              title="Créez votre compte"
              description="Inscrivez-vous gratuitement et créez votre profil professionnel"
            />
            <StepCard
              number={2}
              icon="ph:file-text"
              title="Complétez votre profil"
              description="Ajoutez vos compétences, expériences et votre portfolio"
            />
            <StepCard
              number={3}
              icon="ph:magnifying-glass"
              title="Trouvez des missions"
              description="Parcourez les offres et postulez aux missions qui vous correspondent"
            />
            <StepCard
              number={4}
              icon="ph:handshake"
              title="Réalisez et gagnez"
              description="Réalisez les missions et recevez vos paiements en toute sécurité"
              isLast={true}
            />
          </div>
        </div>
      </section>

      {/* Témoignages Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-4">
              Ils nous font{" "}
              <span className="text-primary">confiance</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
              Découvrez ce que nos freelances pensent de Nation Work
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard
              name="Mamadou Diop"
              role="Développeur Full-Stack"
              content="Grâce à Nation Work, j'ai pu développer mon activité et trouver des clients réguliers. La plateforme est simple et efficace."
              avatar="M"
            />
            <TestimonialCard
              name="Fatou Sow"
              role="Designer UI/UX"
              content="Une excellente plateforme pour les freelances. Les paiements sont sécurisés et le support est très réactif."
              avatar="F"
            />
            <TestimonialCard
              name="Oumar Fall"
              role="Marketing Digital"
              content="Je recommande Nation Work à tous les freelances. J'ai trouvé des missions intéressantes et bien rémunérées."
              avatar="O"
            />
          </div>
        </div>
      </section>

      {/* Formulaire d'inscription Section */}
      <section id="inscription" className="py-20 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Formulaire */}
            <div className="bg-surface dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-text-primary dark:text-gray-100">
                  Devenir freelance
                </h2>
                <p className="text-text-secondary dark:text-gray-400 mt-2">
                  Remplissez le formulaire et nous vous contacterons
                </p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Nom complet */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                    Nom complet
                  </label>
                  <Input
                    {...register("full_name")}
                    placeholder="Jean Dupont"
                    className={cn(errors.full_name && "border-red-500")}
                  />
                  {errors.full_name && (
                    <p className="text-xs text-red-500 mt-1">{errors.full_name.message}</p>
                  )}
                </div>

                {/* Email et Téléphone */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                      Email
                    </label>
                    <Input
                      {...register("email")}
                      type="email"
                      placeholder="jean@exemple.com"
                      className={cn(errors.email && "border-red-500")}
                    />
                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                      Téléphone
                    </label>
                    <Input
                      {...register("phone")}
                      placeholder="+33 6 12 34 56 78"
                      className={cn(errors.phone && "border-red-500")}
                    />
                    {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>}
                  </div>
                </div>

                {/* Profession et Expérience */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                      Profession
                    </label>
                    <Input
                      {...register("profession")}
                      placeholder="Développeur Web"
                      className={cn(errors.profession && "border-red-500")}
                    />
                    {errors.profession && <p className="text-xs text-red-500 mt-1">{errors.profession.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                      Niveau d'expérience
                    </label>
                    <Select onValueChange={(value) => setValue("experience", value)}>
                      <SelectTrigger className={cn(errors.experience && "border-red-500")}>
                        <SelectValue placeholder="Sélectionnez" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="debutant">Débutant (moins d'1 an)</SelectItem>
                        <SelectItem value="intermediaire">Intermédiaire (1-3 ans)</SelectItem>
                        <SelectItem value="confirme">Confirmé (3-5 ans)</SelectItem>
                        <SelectItem value="expert">Expert (5+ ans)</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.experience && <p className="text-xs text-red-500 mt-1">{errors.experience.message}</p>}
                  </div>
                </div>

                {/* Compétences */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                    Compétences
                  </label>
                  <Textarea
                    {...register("skills")}
                    placeholder="Décrivez vos compétences principales (ex: React, Node.js, UI/UX Design...)"
                    rows={3}
                    className={cn(errors.skills && "border-red-500")}
                  />
                  {errors.skills && <p className="text-xs text-red-500 mt-1">{errors.skills.message}</p>}
                </div>

                {/* Portfolio (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                    Portfolio / Site web <span className="text-text-secondary">(optionnel)</span>
                  </label>
                  <Input
                    {...register("portfolio")}
                    placeholder="https://monportfolio.com"
                  />
                </div>

                {/* Message (optionnel) */}
                <div>
                  <label className="block text-sm font-medium text-text-primary dark:text-gray-300 mb-1">
                    Message <span className="text-text-secondary">(optionnel)</span>
                  </label>
                  <Textarea
                    {...register("message")}
                    placeholder="Informations complémentaires..."
                    rows={2}
                  />
                </div>

                {/* Bouton submission */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl py-3"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <Icon icon="ph:spinner" className="w-5 h-5 animate-spin" />
                      Envoi en cours...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Envoyer ma candidature
                      <Icon icon="ph:arrow-right" className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </div>

            {/* Right Column - Informations supplémentaires */}
            <div className="space-y-6">
              <div className="bg-surface dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon icon="ph:check-circle" className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100">
                    Ce qui vous attend
                  </h3>
                </div>
                <ul className="space-y-3">
                  {[
                    "Accès à des milliers de missions",
                    "Paiements sécurisés et ponctuels",
                    "Support dédié 24h/24 et 7j/7",
                    "Formations et ressources exclusives",
                    "Communauté de freelances active",
                    "Visibilité auprès de grands clients",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-3">
                      <Icon icon="ph:check" className="w-5 h-5 text-success" />
                      <span className="text-text-secondary dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-primary/10 dark:from-primary-400/5 dark:to-primary-400/10 rounded-2xl p-8 border border-primary/20 dark:border-primary-400/20">
                <h3 className="text-lg font-semibold text-text-primary dark:text-gray-100 mb-3 text-center">
                  Déjà plus de 200 freelances nous font confiance
                </h3>
                <div className="flex justify-center -space-x-2 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="w-10 h-10 rounded-full bg-primary/20 border-2 border-white dark:border-gray-800 flex items-center justify-center text-primary font-semibold"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                </div>
                <p className="text-sm text-text-secondary dark:text-gray-400 text-center">
                  Rejoignez les meilleurs freelances du Sénégal
                </p>
              </div>

              <div className="bg-surface dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-4 text-center">
                  Questions ? Contactez-nous
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:phone" className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary dark:text-gray-300">+221 33 123 45 67</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <Icon icon="ph:envelope" className="w-4 h-4 text-primary" />
                    <span className="text-text-secondary dark:text-gray-300">freelance@nationwork.com</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-text-primary dark:text-gray-100 mb-4">
              Foire aux{" "}
              <span className="text-primary">questions</span>
            </h2>
            <p className="text-text-secondary dark:text-gray-400">
              Tout ce que vous devez savoir pour devenir freelance
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                q: "Comment sont calculées les commissions ?",
                a: "Nous appliquons une commission transparente de 10% sur chaque mission réalisée. Pas de frais cachés ni d'abonnement."
              },
              {
                q: "Quand suis-je payé ?",
                a: "Les paiements sont effectués sous 48h après validation de la mission par le client. Vous pouvez retirer vos gains à tout moment."
              },
              {
                q: "Puis-je fixer mes propres tarifs ?",
                a: "Oui, vous êtes libre de définir vos tarifs en fonction de votre expérience et du marché."
              },
              {
                q: "Comment trouver mes premières missions ?",
                a: "Notre algorithme vous propose des missions adaptées à votre profil. Vous pouvez également postuler aux offres qui vous intéressent."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-surface dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-2">
                  {faq.q}
                </h3>
                <p className="text-text-secondary dark:text-gray-400">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-r from-primary to-primary/80 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Prêt à rejoindre l'aventure ?
          </h2>
          <p className="text-primary-100 mb-6">
            Inscrivez-vous maintenant et commencez à gagner votre vie
          </p>
          <Link href="#inscription">
            <Button className="bg-white text-primary hover:bg-gray-100 rounded-xl px-8 py-3 text-lg font-semibold">
              Devenir freelance
              <Icon icon="ph:arrow-right" className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}