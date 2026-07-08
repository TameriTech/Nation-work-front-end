// app/page.tsx - Ajout de la section FAQ
"use client";

import { useState, useEffect } from "react";
import { Header } from "@/app/components/layouts/headers/GuestHeader";
import { Footer } from "@/app/components/layouts/footer/GuestFooter";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { cn } from "@/app/lib/utils";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const categories = ["Tous", "Plomberie", "Électricité", "Ménage", "Informatique", "Jardinage", "Couture"];
  
  const services = [
    { name: "Plomberie", icon: "ph:wrench", description: "Dépannage, installation et réparation", badge: "Urgence 24/7", color: "from-primary to-primary/80", jobs: 1245 },
    { name: "Électricité", icon: "ph:lightbulb", description: "Installation électrique et dépannage", badge: "Certifié", color: "from-primary to-secondary", jobs: 982 },
    { name: "Ménage", icon: "ph:broom", description: "Nettoyage complet de votre domicile", badge: "Best seller", color: "from-secondary to-secondary/80", jobs: 2156 },
    { name: "Informatique", icon: "ph:computer", description: "Support technique et dépannage", badge: "Nouveau", color: "from-primary to-primary/70", jobs: 754 },
    { name: "Jardinage", icon: "ph:flower", description: "Entretien de vos espaces verts", badge: "", color: "from-secondary to-secondary/70", jobs: 623 },
    { name: "Couture", icon: "ph:scissors", description: "Retouches et créations sur mesure", badge: "", color: "from-primary to-primary/60", jobs: 487 },
  ];

  const stats = [
    { value: 200, label: "Freelances actifs", suffix: "+", icon: "ph:users", color: "from-primary to-primary/80" },
    { value: 5000, label: "Missions réalisées", suffix: "+", icon: "ph:briefcase", color: "from-secondary to-secondary/80" },
    { value: 98, label: "Satisfaction client", suffix: "%", icon: "ph:smiley", color: "from-primary to-primary/70" },
    { value: 24, label: "Support 7j/7", suffix: "/7", icon: "ph:headset", color: "from-secondary to-secondary/70" },
  ];

  const testimonials = [
    { name: "Sophie Martin", role: "Cliente", text: "Service impeccable ! J'ai trouvé un plombier en moins de 10 minutes. Je recommande vivement Tameri Work.", rating: 5, avatar: "S" },
    { name: "Thomas Bernard", role: "Freelance", text: "Grâce à Tameri Work, j'ai doublé mon chiffre d'affaires en 6 mois. La plateforme est super intuitive.", rating: 5, avatar: "T" },
    { name: "Marie Laure", role: "Chef d'entreprise", text: "Une solution fiable pour nos besoins professionnels. Gain de temps considérable.", rating: 5, avatar: "M" },
    { name: "Abdoulaye Diop", role: "Client", text: "Service rapide, professionnel et tarifs transparents. Je suis ravi !", rating: 5, avatar: "A" },
  ];

  // FAQ Data
  const faqs = [
    {
      question: "Comment fonctionne Tameri Work ?",
      answer: "Tameri Work met en relation des clients avec des freelances qualifiés. Vous publiez votre besoin, recevez des devis, comparez les profils et choisissez le prestataire qui vous convient. Le paiement est sécurisé et vous n'êtes débité qu'une fois le service rendu.",
      icon: "ph:question"
    },
    {
      question: "Les freelances sont-ils vérifiés ?",
      answer: "Oui ! Tous nos freelances passent par un processus de vérification rigoureux : validation des compétences, vérification des diplômes et expériences, et recueil d'avis clients. Vous pouvez consulter leur taux de satisfaction et le nombre de missions réalisées.",
      icon: "ph:shield-check"
    },
    {
      question: "Comment se passe le paiement ?",
      answer: "Le paiement est entièrement sécurisé via notre plateforme. Les fonds sont bloqués jusqu'à validation de la prestation par le client. Vous pouvez payer par carte bancaire, mobile money ou virement. La plateforme prélève une commission transparente sur chaque mission.",
      icon: "ph:credit-card"
    },
    {
      question: "Que faire en cas de litige ?",
      answer: "Notre équipe support est disponible 24/7 pour vous assister. En cas de problème, nous ouvrons un ticket et analysons la situation. Nous disposons d'un système de médiation et d'une assurance pour protéger les deux parties. Votre satisfaction est notre priorité.",
      icon: "ph:handshake"
    },
    {
      question: "Comment devenir freelance sur Tameri Work ?",
      answer: "L'inscription est gratuite et rapide. Créez votre profil, renseignez vos compétences, et soumettez vos documents pour validation. Une fois approuvé, vous pouvez postuler aux missions et commencer à gagner de l'argent. Nous vous accompagnons dans vos premiers pas.",
      icon: "ph:rocket"
    },
    {
      question: "Quels types de services puis-je trouver ?",
      answer: "Nous couvrons de nombreux domaines : plomberie, électricité, ménage, jardinage, informatique, couture, assistance administrative, cours particuliers, déménagement, et bien plus encore. Si vous avez un besoin spécifique, publiez-le, un freelance compétent vous contactera.",
      icon: "ph:grid-four"
    },
  ];

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <>
      
      <main className="pt-16 bg-background dark:bg-gray-900">
        
        {/* Hero Section */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-surface to-secondary/5 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800"></div>
          <div className="absolute top-20 right-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: "2s" }}></div>
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-8 animate-float">
                <Icon icon="ph:star-fill" className="w-4 h-4 text-secondary" />
                <span>+2000 freelances disponibles</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold mb-6 tracking-tight">
                Besoin d&apos;un
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> coup de main</span>
                <br />
                <span className="text-text-primary dark:text-gray-100">? Trouvez-le ici</span>
              </h1>

              <p className="text-lg sm:text-xl text-text-secondary dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                Des professionnels qualifiés et vérifiés pour tous vos besoins. Rapide, simple et 100% sécurisé.
              </p>

              <div className="bg-surface dark:bg-gray-800 rounded-2xl shadow-2xl p-2 max-w-2xl mx-auto mb-12 border border-gray-100 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="flex-1 flex items-center px-5">
                    <Icon icon="ph:magnifying-glass" className="w-5 h-5 text-text-secondary dark:text-gray-400" />
                    <input
                      type="text"
                      placeholder="Que recherchez-vous ? (ex: plomberie, ménage...)"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full px-4 py-3 outline-none bg-transparent text-text-primary dark:text-gray-100 placeholder:text-text-secondary dark:placeholder:text-gray-400"
                    />
                  </div>
                  <button className="px-6 py-3 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all">
                    Rechercher
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
                {stats.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-2xl sm:text-3xl font-bold text-text-primary dark:text-gray-100">
                      {stat.value}{stat.suffix}
                    </div>
                    <div className="text-sm text-text-secondary dark:text-gray-400">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Icon icon="ph:sparkle" className="w-3 h-3" />
                <span>Nos services</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-gray-100 mb-3">
                Ce que nos clients
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> recherchent le plus</span>
              </h2>
              <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
                Découvrez nos services les plus populaires auprès de notre communauté
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, idx) => (
                <div
                  key={service.name}
                  className={cn(
                    "group rounded-2xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border",
                    "bg-surface dark:bg-gray-800",
                    "border-gray-100 dark:border-gray-700"
                  )}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 bg-gradient-to-br ${service.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                      <Icon icon={service.icon} className="w-7 h-7 text-white" />
                    </div>
                    {service.badge && (
                      <span className="text-xs px-2 py-1 bg-secondary/10 text-secondary dark:bg-secondary/20 rounded-full">
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2">{service.name}</h3>
                  <p className="text-text-secondary dark:text-gray-400 text-sm mb-3">{service.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                    <span className="text-xs text-text-secondary dark:text-gray-400">{service.jobs}+ missions</span>
                    <button className="text-primary font-medium text-sm hover:gap-2 transition-all inline-flex items-center gap-1">
                      En savoir plus
                      <Icon icon="ph:arrow-right" className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-10">
              <Link href="/services" className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all">
                Voir tous les services
                <Icon icon="ph:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 bg-surface dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Icon icon="ph:compass" className="w-3 h-3" />
                <span>Comment ça marche</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-gray-100 mb-3">
                3 étapes pour
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> trouver votre prestataire</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { step: "01", title: "Recherchez", description: "Trouvez le service dont vous avez besoin", icon: "ph:magnifying-glass", color: "from-primary to-primary/80" },
                { step: "02", title: "Comparez", description: "Consultez les profils, avis et tarifs", icon: "ph:chart-bar", color: "from-primary to-secondary" },
                { step: "03", title: "Réservez", description: "Choisissez et payez en toute sécurité", icon: "ph:calendar-check", color: "from-secondary to-secondary/80" },
              ].map((item, idx) => (
                <div key={idx} className="relative group">
                  <div className="absolute -top-4 -left-4 text-7xl font-bold bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-700 bg-clip-text text-transparent opacity-50">
                    {item.step}
                  </div>
                  <div className="relative pt-8 text-center">
                    <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center shadow-lg mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon icon={item.icon} className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary dark:text-gray-100 mb-2">{item.title}</h3>
                    <p className="text-text-secondary dark:text-gray-400">{item.description}</p>
                  </div>
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-1/3 -right-6 text-text-secondary dark:text-gray-500">
                      <Icon icon="ph:arrow-right" className="w-6 h-6" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Banner */}
        <section className="py-16 bg-gradient-to-r from-primary to-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {[
                { value: "200+", label: "Freelances" },
                { value: "5000+", label: "Missions" },
                { value: "98%", label: "Satisfaction" },
                { value: "24/7", label: "Support" },
              ].map((stat) => (
                <div key={stat.label} className="text-white">
                  <div className="text-3xl md:text-4xl font-bold mb-2">{stat.value}</div>
                  <div className="text-sm opacity-90">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section - Nouvelle section ajoutée */}
        <section className="py-20 bg-gray-50 dark:bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Icon icon="ph:chat-circle" className="w-3 h-3" />
                <span>Questions fréquentes</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-gray-100 mb-3">
                Vous avez des
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> questions ?</span>
              </h2>
              <p className="text-text-secondary dark:text-gray-400 max-w-2xl mx-auto">
                Retrouvez les réponses aux questions les plus fréquemment posées sur Tameri Work
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className={cn(
                    "mb-4 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 border",
                    "bg-surface dark:bg-gray-800",
                    "border-gray-100 dark:border-gray-700"
                  )}
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 flex items-center justify-center flex-shrink-0">
                        <Icon icon={faq.icon} className="w-5 h-5 text-primary" />
                      </div>
                      <span className="font-semibold text-text-primary dark:text-gray-100 text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <Icon
                      icon={openFaqIndex === index ? "ph:minus" : "ph:plus"}
                      className="w-5 h-5 text-primary flex-shrink-0 transition-transform duration-300"
                    />
                  </button>
                  
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaqIndex === index ? "max-h-96" : "max-h-0"
                    }`}
                  >
                    <div className="p-6 pt-0 pl-16 text-text-secondary dark:text-gray-400 leading-relaxed">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Lien vers la page FAQ complète */}
            <div className="text-center mt-8">
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 text-primary font-semibold hover:gap-3 transition-all"
              >
                Voir toutes les questions
                <Icon icon="ph:arrow-right" className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-20 bg-surface dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-4">
                <Icon icon="ph:chat" className="w-3 h-3" />
                <span>Témoignages</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-text-primary dark:text-gray-100 mb-3">
                Ils nous
                <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> font confiance</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial, idx) => (
                <div key={idx} className={cn(
                  "rounded-2xl p-6 shadow-sm hover:shadow-md transition-all border",
                  "bg-gray-50 dark:bg-gray-800",
                  "border-gray-100 dark:border-gray-700"
                )}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary dark:text-gray-100 text-sm">{testimonial.name}</h4>
                      <p className="text-xs text-text-secondary dark:text-gray-400">{testimonial.role}</p>
                      <div className="flex text-secondary text-xs mt-1">
                        {"★".repeat(testimonial.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-text-secondary dark:text-gray-400 italic">"{testimonial.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-20 bg-gradient-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="bg-gradient-to-r from-primary to-secondary rounded-3xl p-8 md:p-12 shadow-2xl">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4">
                Prêt à rejoindre l&apos;aventure ?
              </h2>
              <p className="text-primary-100 mb-6 max-w-md mx-auto">
                Que vous soyez client ou freelance, Tameri Work est là pour vous accompagner.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  href="/auth/signup"
                  className="px-6 py-3 bg-white text-primary rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all"
                >
                  Créer un compte
                </Link>
                <Link
                  href="/devenir-freelance"
                  className="px-6 py-3 bg-transparent border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition-all"
                >
                  Devenir freelance
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

    </>
  );
}