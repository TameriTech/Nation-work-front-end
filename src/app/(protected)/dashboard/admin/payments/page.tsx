"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  DollarSign,
  CreditCard,
  Wallet,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Eye,
  Download,
  RefreshCw,
  Loader2,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  Printer,
  Mail,
  Calendar,
  Percent,
  Users,
  Briefcase,
  Banknote,
  Landmark,
  Smartphone,
  Coffee,
  Shield,
} from "lucide-react";

import {
  getTransactions,
  getPaymentSummary,
  exportTransactions,
  generateInvoice,
} from "@/app/services/payments.service";
import type {
  Payment,
  PaymentFilters,
  PaginatedResponse,
  PaymentSummary,
} from "@/app/types/admin";
import { payments as mockPayments } from "@/data/admin-mock-data";

// Composant de statistiques
const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
  trend,
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: any;
  color: string;
  trend?: number;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between mb-4">
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
      {trend !== undefined && (
        <div
          className={`flex items-center text-sm font-semibold ${
            trend >= 0
              ? "text-green-600 dark:text-green-400"
              : "text-red-600 dark:text-red-400"
          }`}
        >
          {trend >= 0 ? (
            <TrendingUp className="w-4 h-4 mr-1" />
          ) : (
            <TrendingDown className="w-4 h-4 mr-1" />
          )}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <h3 className="text-gray-600 dark:text-gray-400 text-sm font-medium mb-1">
      {title}
    </h3>
    <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
      {value}
    </p>
    {subValue && (
      <p className="text-sm text-gray-500 dark:text-gray-400">{subValue}</p>
    )}
  </div>
);

// Composant de filtre
const PaymentFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: PaymentFilters;
  onFilterChange: (filters: PaymentFilters) => void;
  onSearch: () => void;
}) => {
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      onFilterChange({ ...filters, search: localSearch });
      onSearch();
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 border border-gray-200 dark:border-slate-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Recherche */}
        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Recherche
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4" />
            <input
              type="text"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="ID transaction, service, client..."
              className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Filtre par statut */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Statut
          </label>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                status: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Tous les statuts</option>
            <option value="pending">En attente</option>
            <option value="paid">Payé</option>
            <option value="escrow">Séquestre</option>
            <option value="refunded">Remboursé</option>
            <option value="failed">Échoué</option>
          </select>
        </div>

        {/* Filtre par méthode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Méthode
          </label>
          <select
            value={filters.method || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                method: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          >
            <option value="">Toutes les méthodes</option>
            <option value="card">Carte bancaire</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="cash">Espèces</option>
            <option value="bank_transfer">Virement</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {/* Date de début */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date début
          </label>
          <input
            type="date"
            value={filters.date_from || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_from: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Date fin */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Date fin
          </label>
          <input
            type="date"
            value={filters.date_to || ""}
            onChange={(e) =>
              onFilterChange({
                ...filters,
                date_to: e.target.value || undefined,
              })
            }
            className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        {/* Montant min/max */}
        <div className="flex space-x-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Min (€)
            </label>
            <input
              type="number"
              value={filters.min_amount || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  min_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="0"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Max (€)
            </label>
            <input
              type="number"
              value={filters.max_amount || ""}
              onChange={(e) =>
                onFilterChange({
                  ...filters,
                  max_amount: e.target.value
                    ? Number(e.target.value)
                    : undefined,
                })
              }
              placeholder="1000"
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-4 space-x-2">
        <button
          onClick={() => {
            onFilterChange({});
            setLocalSearch("");
            onSearch();
          }}
          className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition"
        >
          Réinitialiser
        </button>
        <button
          onClick={onSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center transition"
        >
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </button>
      </div>
    </div>
  );
};

// Composant de tableau
const PaymentTable = ({
  payments,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onExport,
  loading,
}: {
  payments: Payment[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (payment: Payment) => void;
  onExport: (payment: Payment) => void;
  loading: boolean;
}) => {
  const getStatusBadge = (status: string) => {
    const badges: Record<string, { color: string; icon: any; label: string }> =
      {
        paid: {
          color:
            "bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
          icon: CheckCircle,
          label: "Payé",
        },
        pending: {
          color:
            "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
          icon: Clock,
          label: "En attente",
        },
        escrow: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Shield,
          label: "Séquestre",
        },
        refunded: {
          color:
            "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:border-purple-800",
          icon: XCircle,
          label: "Remboursé",
        },
        failed: {
          color:
            "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
          icon: AlertCircle,
          label: "Échoué",
        },
      };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.color}`}
      >
        <Icon className="w-3 h-3 mr-1" />
        {badge.label}
      </span>
    );
  };

  const getMethodIcon = (method: string) => {
    const icons: Record<string, any> = {
      card: CreditCard,
      mobile_money: Smartphone,
      cash: Banknote,
      bank_transfer: Landmark,
    };
    const Icon = icons[method] || CreditCard;
    return <Icon className="w-4 h-4" />;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      card: "Carte",
      mobile_money: "Mobile Money",
      cash: "Espèces",
      bank_transfer: "Virement",
    };
    return labels[method] || method;
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortBy !== field)
      return (
        <ArrowUpDown className="w-4 h-4 ml-1 text-gray-400 dark:text-gray-500" />
      );
    return sortOrder === "asc" ? (
      <ArrowUp className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" />
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700">
        <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-gray-200 dark:border-slate-700">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-700">
            <tr>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("id")}
              >
                <div className="flex items-center">
                  Transaction
                  <SortIcon field="id" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("service_title")}
              >
                <div className="flex items-center">
                  Service
                  <SortIcon field="service_title" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("client")}
              >
                <div className="flex items-center">
                  Client
                  <SortIcon field="client" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("freelancer")}
              >
                <div className="flex items-center">
                  Freelancer
                  <SortIcon field="freelancer" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("amount")}
              >
                <div className="flex items-center">
                  Montant
                  <SortIcon field="amount" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("status")}
              >
                <div className="flex items-center">
                  Statut
                  <SortIcon field="status" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("payment_method")}
              >
                <div className="flex items-center">
                  Méthode
                  <SortIcon field="payment_method" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("created_at")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon field="created_at" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {payments.length === 0 ? (
              <tr>
                <td
                  colSpan={9}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucune transaction trouvée
                </td>
              </tr>
            ) : (
              payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payment.id}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {payment.transaction_id || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {payment.service_title}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      #{payment.service_id}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 dark:text-gray-100">
                      {payment.client.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.freelancer ? (
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {payment.freelancer.name}
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        -
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {formatCurrency(payment.amount)}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Frais: {formatCurrency(payment.platform_fee)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payment.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      {getMethodIcon(payment.payment_method)}
                      <span className="ml-1">
                        {getMethodLabel(payment.payment_method)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payment.created_at).toLocaleDateString("fr-FR")}
                    <span className="text-xs block">
                      {new Date(payment.created_at).toLocaleTimeString("fr-FR")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(payment)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onExport(payment)}
                        className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                        title="Télécharger facture"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Composant de pagination
const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  perPage: number;
  onPageChange: (page: number) => void;
}) => {
  const start = (currentPage - 1) * perPage + 1;
  const end = Math.min(currentPage * perPage, totalItems);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-gray-200 dark:border-slate-700">
      <div className="text-sm text-gray-700 dark:text-gray-300">
        Affichage de{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {start}
        </span>{" "}
        à{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {end}
        </span>{" "}
        sur{" "}
        <span className="font-medium text-gray-900 dark:text-gray-100">
          {totalItems}
        </span>{" "}
        résultats
      </div>
      <div className="flex space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <span className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-medium">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition text-gray-600 dark:text-gray-400"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Page principale
export default function PaymentsPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<PaymentFilters>({
    page: 1,
    per_page: 10,
    sort_by: "created_at",
    sort_order: "desc",
  });

  // Charger les données
  const loadPayments = async () => {
    try {
      setLoading(true);

      // Utiliser les mock data
      const mockResponse = {
        items: mockPayments.transactions as Payment[],
        total: mockPayments.transactions.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockPayments.transactions.length / (filters.per_page || 10),
        ),
      };
      setPayments(mockResponse.items);
      setPagination(mockResponse);
      setSummary(mockPayments.summary as PaymentSummary);
    } catch (error) {
      console.error("Erreur chargement paiements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayments();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: PaymentFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadPayments();
  };

  const handleSort = (field: string) => {
    const order =
      filters.sort_by === field && filters.sort_order === "asc"
        ? "desc"
        : "asc";
    setFilters({ ...filters, sort_by: field, sort_order: order });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  const handleViewPayment = (payment: Payment) => {
    router.push(`/dashboard/admin/payments/${payment.id}`);
  };

  const handleExport = async (payment?: Payment) => {
    try {
      if (payment) {
        // Exporter une seule facture
        const blob = await generateInvoice(payment.id);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `facture-${payment.id}.pdf`;
        a.click();
      } else {
        // Exporter toutes les transactions
        const blob = await exportTransactions(filters);
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `transactions-${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Erreur export:", error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("fr-FR").format(num);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <DollarSign className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des paiements
          </h1>
          <p className="text-gray-400 mt-1">
            Suivez et gérez toutes les transactions financières
          </p>
        </div>

        {/* Cartes de statistiques */}
        {summary && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <StatsCard
              title="Chiffre d'affaires"
              value={formatCurrency(summary.total_revenue)}
              subValue={`+${formatCurrency(summary.monthly_revenue)} ce mois`}
              icon={DollarSign}
              color="bg-green-500"
              trend={summary.monthly_growth}
            />
            <StatsCard
              title="Frais plateforme"
              value={formatCurrency(summary.platform_fees)}
              subValue="Commission 10%"
              icon={Percent}
              color="bg-blue-500"
            />
            <StatsCard
              title="En attente de paiement"
              value={formatCurrency(summary.pending_payouts)}
              subValue={`${summary.by_status.pending} transactions`}
              icon={Clock}
              color="bg-yellow-500"
            />
            <StatsCard
              title="Transactions"
              value={formatNumber(
                summary.by_status.paid + summary.by_status.pending,
              )}
              subValue={`${summary.by_status.paid} payées, ${summary.by_status.escrow} séquestre`}
              icon={CreditCard}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadPayments}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={() => handleExport()}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>Total: {formatCurrency(summary?.total_revenue || 0)}</span>
            <span className="hidden sm:inline">|</span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Payés: {summary?.by_status.paid || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              En attente: {summary?.by_status.pending || 0}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div>
              Séquestre: {summary?.by_status.escrow || 0}
            </span>
          </div>
        </div>

        {/* Filtres */}
        <PaymentFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <PaymentTable
          payments={payments}
          onSort={handleSort}
          sortBy={filters.sort_by || "created_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={handleViewPayment}
          onExport={handleExport}
          loading={loading}
        />

        {/* Pagination */}
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.total_pages}
          totalItems={pagination.total}
          perPage={pagination.per_page}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
