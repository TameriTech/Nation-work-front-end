"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Star,
  Shield,
  CheckCircle,
  XCircle,
  Ban,
  Edit,
  Send,
  AlertCircle,
  Briefcase,
  DollarSign,
  TrendingUp,
  Users,
  MessageSquare,
  CreditCard,
  FileText,
  Scale,
  Activity,
  Download,
  Printer,
  MoreHorizontal,
  Loader2,
  User as UserIcon,
  UserCheck,
  UserX,
  UserMinus,
  Award,
  Globe,
  Link as LinkIcon,
  Github,
  Twitter,
  Linkedin,
  Facebook,
  Instagram,
} from "lucide-react";

import { getUserById, suspendUser, activateUser, sendUserEmail } from "@/app/services/users.service";
import type { User } from "@/app/types/admin";
import { users as mockUsers } from "@/data/admin-mock-data";

// Composant d'information
const InfoCard = ({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-lg p-6">
    <h3 className="text-lg font-semibold mb-4 flex items-center">
      <Icon className="w-5 h-5 mr-2 text-blue-600" />
      {title}
    </h3>
    <div className="space-y-3">
      {children}
    </div>
  </div>
);

// Badge de statut
const StatusBadge = ({ status }: { status: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    active: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: UserCheck,
      label: "Actif",
    },
    suspended: {
      color: "bg-red-100 text-red-700 border-red-200",
      icon: UserX,
      label: "Suspendu",
    },
    pending_verification: {
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      icon: AlertCircle,
      label: "En attente",
    },
    inactive: {
      color: "bg-gray-100 text-gray-700 border-gray-200",
      icon: UserMinus,
      label: "Inactif",
    },
  };
  const badge = badges[status] || badges.inactive;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

// Badge de rôle
const RoleBadge = ({ role }: { role: string }) => {
  const badges: Record<string, { color: string; icon: any; label: string }> = {
    admin: {
      color: "bg-purple-100 text-purple-700 border-purple-200",
      icon: Shield,
      label: "Administrateur",
    },
    freelancer: {
      color: "bg-blue-100 text-blue-700 border-blue-200",
      icon: Star,
      label: "Freelancer",
    },
    client: {
      color: "bg-green-100 text-green-700 border-green-200",
      icon: UserIcon,
      label: "Client",
    },
  };
  const badge = badges[role] || badges.client;
  const Icon = badge.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${badge.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {badge.label}
    </span>
  );
};

// Modal d'envoi d'email
const EmailModal = ({
  isOpen,
  onClose,
  user,
  onSend,
}: {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSend: (subject: string, message: string) => void;
}) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !user) return null;

  const handleSubmit = () => {
    if (!subject.trim()) {
      setError("Le sujet est requis");
      return;
    }
    if (!message.trim()) {
      setError("Le message est requis");
      return;
    }
    onSend(subject, message);
    setSubject("");
    setMessage("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full p-6">
        <h3 className="text-lg font-semibold mb-4">Envoyer un email à {user.username}</h3>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sujet *
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={6}
            className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {error && <p className="text-red-600 text-sm mt-1">{error}</p>}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Envoyer
          </button>
        </div>
      </div>
    </div>
  );
};

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = Number(params.userId);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "services" | "payments" | "disputes" | "logs">("info");
  const [emailModal, setEmailModal] = useState<{ isOpen: boolean }>({ isOpen: false });

  // Charger les données
  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        // Utiliser les mock data
        const foundUser = mockUsers.list.find((u) => u.id === userId) as User;
        setUser(foundUser || null);
        
        // Version API
        // const data = await getUserById(userId);
        // setUser(data);
      } catch (error) {
        console.error("Erreur chargement utilisateur:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  const handleSuspend = async () => {
    if (!user) return;
    const reason = prompt("Raison de la suspension:");
    if (reason) {
      try {
        await suspendUser(user.id, { reason, duration_days: 7 });
        // Recharger l'utilisateur
      } catch (error) {
        console.error("Erreur suspension:", error);
      }
    }
  };

  const handleActivate = async () => {
    if (!user) return;
    if (confirm("Réactiver cet utilisateur ?")) {
      try {
        await activateUser(user.id);
        // Recharger l'utilisateur
      } catch (error) {
        console.error("Erreur activation:", error);
      }
    }
  };

  const handleSendEmail = async (subject: string, message: string) => {
    if (!user) return;
    try {
      await sendUserEmail(user.id, { subject, message });
      alert("Email envoyé avec succès");
    } catch (error) {
      console.error("Erreur envoi email:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Utilisateur non trouvé</h2>
          <p className="text-gray-600 mb-4">L'utilisateur avec l'ID {userId} n'existe pas</p>
          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Barre de navigation */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour à la liste
          </button>
          <div className="flex space-x-2">
            <button
              onClick={() => setEmailModal({ isOpen: true })}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
            >
              <Send className="w-4 h-4 mr-2" />
              Envoyer un email
            </button>
            <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center">
              <Edit className="w-4 h-4 mr-2" />
              Modifier
            </button>
            {user.status === "active" ? (
              <button
                onClick={handleSuspend}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <Ban className="w-4 h-4 mr-2" />
                Suspendre
              </button>
            ) : user.status === "suspended" ? (
              <button
                onClick={handleActivate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center"
              >
                <UserCheck className="w-4 h-4 mr-2" />
                Réactiver
              </button>
            ) : null}
          </div>
        </div>

        {/* En-tête du profil */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center border-4 border-white shadow-lg">
                  <UserIcon className="w-12 h-12 text-gray-400" />
                </div>
              )}
            </div>
            <div className="ml-6 flex-1">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{user.username}</h1>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex space-x-3">
                  <StatusBadge status={user.status} />
                  <RoleBadge role={user.role} />
                </div>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <div className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="text-sm">
                    Inscrit le {new Date(user.created_at).toLocaleDateString("fr-FR")}
                  </span>
                </div>
                {user.last_login && (
                  <div className="flex items-center text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">
                      Dernière connexion {new Date(user.last_login).toLocaleDateString("fr-FR")}
                    </span>
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    <span className="text-sm">{user.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques rapides */}
        {user.stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Services</p>
                  <p className="text-2xl font-bold text-gray-800">{user.stats.services_completed || 0}</p>
                </div>
                <Briefcase className="w-8 h-8 text-blue-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Gains</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {user.stats.total_earned ? `${user.stats.total_earned}€` : "0€"}
                  </p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Note</p>
                  <p className="text-2xl font-bold text-gray-800">{user.stats.average_rating || "N/A"}</p>
                </div>
                <Star className="w-8 h-8 text-yellow-500 opacity-50" />
              </div>
            </div>
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Taux de réponse</p>
                  <p className="text-2xl font-bold text-gray-800">{user.stats.response_rate || 0}%</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-500 opacity-50" />
              </div>
            </div>
          </div>
        )}

        {/* Onglets */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Informations
            </button>
            <button
              onClick={() => setActiveTab("services")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "services"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Services
            </button>
            <button
              onClick={() => setActiveTab("payments")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "payments"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Paiements
            </button>
            <button
              onClick={() => setActiveTab("disputes")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "disputes"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Litiges
            </button>
            <button
              onClick={() => setActiveTab("logs")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "logs"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Journal d'activité
            </button>
          </nav>
        </div>

        {/* Contenu des onglets */}
        <div>
          {activeTab === "info" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Informations personnelles */}
              <InfoCard icon={UserIcon} title="Informations personnelles">
                <div className="space-y-3">
                  <div className="flex items-center text-gray-700">
                    <Mail className="w-4 h-4 mr-3 text-gray-400" />
                    <span className="flex-1">{user.email}</span>
                    {user.is_verified && (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    )}
                  </div>
                  {user.phone && (
                    <div className="flex items-center text-gray-700">
                      <Phone className="w-4 h-4 mr-3 text-gray-400" />
                      <span>{user.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-gray-700">
                    <Calendar className="w-4 h-4 mr-3 text-gray-400" />
                    <span>Membre depuis le {new Date(user.created_at).toLocaleDateString("fr-FR")}</span>
                  </div>
                </div>
              </InfoCard>

              {/* Profil freelancer */}
              {user.role === "freelancer" && user.freelancer_profile && (
                <InfoCard icon={Briefcase} title="Profil professionnel">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Tarif horaire</span>
                      <span className="font-medium">{user.freelancer_profile.hourly_rate}€/h</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Expérience</span>
                      <span className="font-medium">{user.freelancer_profile.years_experience} ans</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Compétence principale</span>
                      <span className="font-medium">{user.freelancer_profile.primary_skill}</span>
                    </div>
                    {user.freelancer_profile.secondary_skill && (
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">Compétence secondaire</span>
                        <span className="font-medium">{user.freelancer_profile.secondary_skill}</span>
                      </div>
                    )}
                    {user.freelancer_profile.city && (
                      <div className="flex items-center text-gray-700">
                        <MapPin className="w-4 h-4 mr-3 text-gray-400" />
                        <span>{user.freelancer_profile.city}, {user.freelancer_profile.country}</span>
                      </div>
                    )}
                  </div>
                </InfoCard>
              )}

              {/* Badges et vérifications */}
              <InfoCard icon={Award} title="Badges et certifications">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Vérification d'identité</span>
                    {user.is_verified ? (
                      <span className="inline-flex items-center text-green-600">
                        <CheckCircle className="w-4 h-4 mr-1" />
                        Vérifié
                      </span>
                    ) : (
                      <span className="inline-flex items-center text-yellow-600">
                        <AlertCircle className="w-4 h-4 mr-1" />
                        En attente
                      </span>
                    )}
                  </div>
                  {user.top_rated && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Top Rated</span>
                      <span className="inline-flex items-center text-yellow-600">
                        <Star className="w-4 h-4 mr-1 fill-current" />
                        Actif
                      </span>
                    </div>
                  )}
                  {user.pending_documents && user.pending_documents.length > 0 && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">Documents en attente:</p>
                      <ul className="space-y-2">
                        {user.pending_documents.map((doc, index) => (
                          <li key={index} className="flex items-center text-sm text-gray-600">
                            <FileText className="w-4 h-4 mr-2 text-gray-400" />
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </InfoCard>

              {/* Réseaux sociaux */}
              <InfoCard icon={Globe} title="Réseaux sociaux">
                <div className="space-y-3">
                  {user.freelancer_profile?.website && (
                    <a
                      href={user.freelancer_profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-blue-600"
                    >
                      <Globe className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Site web</span>
                    </a>
                  )}
                  {user.freelancer_profile?.linkedin && (
                    <a
                      href={user.freelancer_profile.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-blue-600"
                    >
                      <Linkedin className="w-4 h-4 mr-3 text-gray-400" />
                      <span>LinkedIn</span>
                    </a>
                  )}
                  {user.freelancer_profile?.github && (
                    <a
                      href={user.freelancer_profile.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-gray-900"
                    >
                      <Github className="w-4 h-4 mr-3 text-gray-400" />
                      <span>GitHub</span>
                    </a>
                  )}
                  {user.freelancer_profile?.twitter && (
                    <a
                      href={user.freelancer_profile.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-gray-700 hover:text-blue-400"
                    >
                      <Twitter className="w-4 h-4 mr-3 text-gray-400" />
                      <span>Twitter</span>
                    </a>
                  )}
                  {!user.freelancer_profile?.website &&
                   !user.freelancer_profile?.linkedin &&
                   !user.freelancer_profile?.github &&
                   !user.freelancer_profile?.twitter && (
                    <p className="text-gray-500 text-center py-4">Aucun réseau social renseigné</p>
                  )}
                </div>
              </InfoCard>
            </div>
          )}

          {activeTab === "services" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500 py-12">
                Historique des services à implémenter
              </p>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500 py-12">
                Historique des paiements à implémenter
              </p>
            </div>
          )}

          {activeTab === "disputes" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500 py-12">
                Historique des litiges à implémenter
              </p>
            </div>
          )}

          {activeTab === "logs" && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <p className="text-center text-gray-500 py-12">
                Journal d'activité à implémenter
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modal d'email */}
      <EmailModal
        isOpen={emailModal.isOpen}
        onClose={() => setEmailModal({ isOpen: false })}
        user={user}
        onSend={handleSendEmail}
      />
    </div>
  );
}