"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Wallet,
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
  Landmark,
  Smartphone,
  CreditCard,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  User,
  FileText,
  Plus,
  MoreHorizontal,
  Ban,
  Check,
  Send,
  Printer,
  Mail,
  Copy,
  ExternalLink,
} from "lucide-react";

import {
  getPayouts,
  processPayout,
  exportTransactions,
} from "@/app/services/payments.service";
import type {
  Payout,
  PayoutFilters,
  PaginatedResponse,
} from "@/app/types/admin";
import { payments as mockPayments } from "@/data/admin-mock-data";

// Composant de statistiques
const StatsCard = ({
  title,
  value,
  subValue,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  subValue?: string;
  icon: any;
  color: string;
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 border border-gray-200 dark:border-slate-700">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-600 dark:text-gray-400">{title}</p>
        <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">
          {value}
        </p>
        {subValue && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {subValue}
          </p>
        )}
      </div>
      <div
        className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center text-white shadow-lg`}
      >
        <Icon className="w-6 h-6" />
      </div>
    </div>
  </div>
);

// Composant de filtre
const PayoutFilters = ({
  filters,
  onFilterChange,
  onSearch,
}: {
  filters: PayoutFilters;
  onFilterChange: (filters: PayoutFilters) => void;
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
              placeholder="ID reversement, nom du freelancer..."
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
            <option value="processed">Traité</option>
            <option value="paid">Payé</option>
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
            <option value="bank_transfer">Virement bancaire</option>
            <option value="mobile_money">Mobile Money</option>
            <option value="paypal">PayPal</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Date début */}
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
const PayoutTable = ({
  payouts,
  onSort,
  sortBy,
  sortOrder,
  onView,
  onProcess,
  loading,
}: {
  payouts: Payout[];
  onSort: (field: string) => void;
  sortBy: string;
  sortOrder: "asc" | "desc";
  onView: (payout: Payout) => void;
  onProcess: (payout: Payout) => void;
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
        processed: {
          color:
            "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800",
          icon: Check,
          label: "Traité",
        },
        pending: {
          color:
            "bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
          icon: Clock,
          label: "En attente",
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
      bank_transfer: Landmark,
      mobile_money: Smartphone,
      paypal: CreditCard,
    };
    const Icon = icons[method] || Landmark;
    return <Icon className="w-4 h-4" />;
  };

  const getMethodLabel = (method: string) => {
    const labels: Record<string, string> = {
      bank_transfer: "Virement",
      mobile_money: "Mobile Money",
      paypal: "PayPal",
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
                  ID Reversement
                  <SortIcon field="id" />
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
                onClick={() => onSort("method")}
              >
                <div className="flex items-center">
                  Méthode
                  <SortIcon field="method" />
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
                onClick={() => onSort("requested_at")}
              >
                <div className="flex items-center">
                  Demandé le
                  <SortIcon field="requested_at" />
                </div>
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-600 transition"
                onClick={() => onSort("period")}
              >
                <div className="flex items-center">
                  Période
                  <SortIcon field="period" />
                </div>
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-slate-800 divide-y divide-gray-200 dark:divide-slate-700">
            {payouts.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="px-6 py-12 text-center text-gray-500 dark:text-gray-400"
                >
                  Aucun reversement trouvé
                </td>
              </tr>
            ) : (
              payouts.map((payout) => (
                <tr
                  key={payout.id}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payout.id}
                    </div>
                    {payout.transaction_id && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {payout.transaction_id}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {payout.freelancer.avatar ? (
                        <img
                          src={payout.freelancer.avatar}
                          alt={payout.freelancer.name}
                          className="w-8 h-8 rounded-full mr-3 object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-slate-700 flex items-center justify-center mr-3">
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        </div>
                      )}
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                          {payout.freelancer.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          ID: {payout.freelancer.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900 dark:text-gray-100">
                      {formatCurrency(payout.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      {getMethodIcon(payout.method)}
                      <span className="ml-1">
                        {getMethodLabel(payout.method)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(payout.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {new Date(payout.requested_at).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {payout.period}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => onView(payout)}
                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 p-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
                        title="Voir détails"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {payout.status === "pending" && (
                        <button
                          onClick={() => onProcess(payout)}
                          className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 p-1 rounded hover:bg-green-50 dark:hover:bg-green-900/30 transition"
                          title="Traiter le reversement"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      )}
                      {payout.status === "processed" && (
                        <button
                          onClick={() => onView(payout)}
                          className="text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 p-1 rounded hover:bg-purple-50 dark:hover:bg-purple-900/30 transition"
                          title="Voir les détails de traitement"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      )}
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

// Modal de traitement de reversement
const ProcessPayoutModal = ({
  isOpen,
  onClose,
  payout,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  payout: Payout | null;
  onConfirm: (transactionId: string, notes?: string) => void;
}) => {
  const [transactionId, setTransactionId] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState("");

  if (!isOpen || !payout) return null;

  const handleSubmit = () => {
    if (!transactionId.trim()) {
      setError("L'ID de transaction est requis");
      return;
    }
    onConfirm(transactionId, notes);
    setTransactionId("");
    setNotes("");
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Traiter le reversement
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Vous êtes sur le point de traiter le reversement{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {payout.id}
          </span>{" "}
          pour{" "}
          <span className="font-medium text-gray-900 dark:text-gray-100">
            {payout.freelancer.name}
          </span>
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Montant à reverser
          </label>
          <input
            type="text"
            value={`${payout.amount} €`}
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Méthode de paiement
          </label>
          <input
            type="text"
            value={
              payout.method === "bank_transfer"
                ? "Virement bancaire"
                : payout.method === "mobile_money"
                  ? "Mobile Money"
                  : "PayPal"
            }
            disabled
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            ID de transaction *
          </label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="Ex: TR123456789"
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
          />
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1">
              {error}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Notes (optionnel)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            placeholder="Informations complémentaires..."
          />
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-300 transition"
          >
            Annuler
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Confirmer le traitement
          </button>
        </div>
      </div>
    </div>
  );
};

// Modal de détails du reversement
const PayoutDetailsModal = ({
  isOpen,
  onClose,
  payout,
}: {
  isOpen: boolean;
  onClose: () => void;
  payout: Payout | null;
}) => {
  if (!isOpen || !payout) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "EUR",
    }).format(amount);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full p-6 border border-gray-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
          Détails du reversement {payout.id}
        </h3>

        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
          {/* Informations générales */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Informations générales
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Montant
                </p>
                <p className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {formatCurrency(payout.amount)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Statut
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {payout.status === "paid" && "Payé"}
                  {payout.status === "processed" && "Traité"}
                  {payout.status === "pending" && "En attente"}
                  {payout.status === "failed" && "Échoué"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Méthode
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {payout.method === "bank_transfer" && "Virement bancaire"}
                  {payout.method === "mobile_money" && "Mobile Money"}
                  {payout.method === "paypal" && "PayPal"}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Période
                </p>
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">
                  {payout.period}
                </p>
              </div>
            </div>
          </div>

          {/* Informations du freelancer */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Freelancer
            </h4>
            <div className="flex items-center">
              {payout.freelancer.avatar ? (
                <img
                  src={payout.freelancer.avatar}
                  alt={payout.freelancer.name}
                  className="w-12 h-12 rounded-full mr-4 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-slate-600 flex items-center justify-center mr-4">
                  <User className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                </div>
              )}
              <div>
                <p className="font-medium text-gray-900 dark:text-gray-100">
                  {payout.freelancer.name}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  ID: {payout.freelancer.id}
                </p>
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chronologie
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  Demandé le
                </span>
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {formatDate(payout.requested_at)}
                </span>
              </div>
              {payout.processed_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Traité le
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(payout.processed_at)}
                  </span>
                </div>
              )}
              {payout.paid_at && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Payé le
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {formatDate(payout.paid_at)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Transaction ID */}
          {payout.transaction_id && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Transaction
              </h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  ID Transaction
                </span>
                <span className="text-sm font-mono font-medium text-gray-900 dark:text-gray-100">
                  {payout.transaction_id}
                </span>
              </div>
            </div>
          )}

          {/* Notes */}
          {payout.notes && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Notes
              </h4>
              <p className="text-sm text-gray-900 dark:text-gray-100">
                {payout.notes}
              </p>
            </div>
          )}

          {/* Coordonnées bancaires (si disponibles) */}
          {payout.bank_details && (
            <div className="bg-gray-50 dark:bg-slate-700/50 rounded-lg p-4">
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Coordonnées bancaires
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Banque
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payout.bank_details.bank_name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    Compte
                  </span>
                  <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {payout.bank_details.account_number}
                  </span>
                </div>
                {payout.bank_details.iban && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      IBAN
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payout.bank_details.iban}
                    </span>
                  </div>
                )}
                {payout.bank_details.bic && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      BIC
                    </span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {payout.bank_details.bic}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};

// Page principale
export default function PayoutsPage() {
  const router = useRouter();

  // États
  const [loading, setLoading] = useState(true);
  const [payouts, setPayouts] = useState<Payout[]>([]);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    per_page: 10,
    total_pages: 1,
  });
  const [filters, setFilters] = useState<PayoutFilters>({
    page: 1,
    per_page: 10,
    sort_by: "requested_at",
    sort_order: "desc",
  });
  const [selectedPayout, setSelectedPayout] = useState<Payout | null>(null);
  const [processModal, setProcessModal] = useState(false);
  const [detailsModal, setDetailsModal] = useState(false);

  // Statistiques calculées
  const stats = {
    total: payouts.reduce((sum, p) => sum + p.amount, 0),
    pending: payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + p.amount, 0),
    processed: payouts
      .filter((p) => p.status === "processed")
      .reduce((sum, p) => sum + p.amount, 0),
    paid: payouts
      .filter((p) => p.status === "paid")
      .reduce((sum, p) => sum + p.amount, 0),
    count: {
      pending: payouts.filter((p) => p.status === "pending").length,
      processed: payouts.filter((p) => p.status === "processed").length,
      paid: payouts.filter((p) => p.status === "paid").length,
      failed: payouts.filter((p) => p.status === "failed").length,
    },
  };

  // Charger les données
  const loadPayouts = async () => {
    try {
      setLoading(true);

      // Utiliser les mock data
      const mockResponse = {
        items: mockPayments.payouts as Payout[],
        total: mockPayments.payouts.length,
        page: filters.page || 1,
        per_page: filters.per_page || 10,
        total_pages: Math.ceil(
          mockPayments.payouts.length / (filters.per_page || 10),
        ),
      };
      setPayouts(mockResponse.items);
      setPagination(mockResponse);
    } catch (error) {
      console.error("Erreur chargement reversements:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPayouts();
  }, [filters.page, filters.per_page, filters.sort_by, filters.sort_order]);

  // Gestionnaires d'événements
  const handleFilterChange = (newFilters: PayoutFilters) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handleSearch = () => {
    loadPayouts();
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

  const handleViewDetails = (payout: Payout) => {
    setSelectedPayout(payout);
    setDetailsModal(true);
  };

  const handleProcess = (payout: Payout) => {
    setSelectedPayout(payout);
    setProcessModal(true);
  };

  const handleProcessConfirm = async (
    transactionId: string,
    notes?: string,
  ) => {
    if (!selectedPayout) return;
    try {
      await processPayout(selectedPayout.id, {
        transaction_id: transactionId,
        notes,
      });
      loadPayouts();
    } catch (error) {
      console.error("Erreur traitement reversement:", error);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await exportTransactions(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `reversements-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
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

  return (
    <div className="min-h-screen dark:bg-slate-950">
      <div className="container mx-auto">
        {/* En-tête */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-100 flex items-center">
            <Wallet className="w-6 h-6 mr-2 text-blue-400" />
            Gestion des reversements
          </h1>
          <p className="text-gray-400 mt-1">
            Gérez les paiements aux freelancers
          </p>
        </div>

        {/* Cartes de statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <StatsCard
            title="Total à reverser"
            value={formatCurrency(stats.total)}
            subValue={`${payouts.length} reversements`}
            icon={DollarSign}
            color="bg-blue-500"
          />
          <StatsCard
            title="En attente"
            value={formatCurrency(stats.pending)}
            subValue={`${stats.count.pending} reversements`}
            icon={Clock}
            color="bg-yellow-500"
          />
          <StatsCard
            title="Traités"
            value={formatCurrency(stats.processed)}
            subValue={`${stats.count.processed} reversements`}
            icon={Check}
            color="bg-purple-500"
          />
          <StatsCard
            title="Payés"
            value={formatCurrency(stats.paid)}
            subValue={`${stats.count.paid} reversements`}
            icon={CheckCircle}
            color="bg-green-500"
          />
        </div>

        {/* Actions rapides */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 border border-gray-200 dark:border-slate-700">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={loadPayouts}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Actualiser
            </button>
            <button
              onClick={handleExport}
              className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 border border-gray-300 dark:border-slate-600 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 flex items-center transition"
            >
              <Download className="w-4 h-4 mr-2" />
              Exporter CSV
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></div>
              En attente: {stats.count.pending}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-purple-500 mr-1"></div>
              Traités: {stats.count.processed}
            </span>
            <span className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div>
              Payés: {stats.count.paid}
            </span>
          </div>
        </div>

        {/* Filtres */}
        <PayoutFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
        />

        {/* Tableau */}
        <PayoutTable
          payouts={payouts}
          onSort={handleSort}
          sortBy={filters.sort_by || "requested_at"}
          sortOrder={filters.sort_order || "desc"}
          onView={handleViewDetails}
          onProcess={handleProcess}
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

      {/* Modals */}
      <ProcessPayoutModal
        isOpen={processModal}
        onClose={() => {
          setProcessModal(false);
          setSelectedPayout(null);
        }}
        payout={selectedPayout}
        onConfirm={handleProcessConfirm}
      />

      <PayoutDetailsModal
        isOpen={detailsModal}
        onClose={() => {
          setDetailsModal(false);
          setSelectedPayout(null);
        }}
        payout={selectedPayout}
      />

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1e293b;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #475569;
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #64748b;
        }
      `}</style>
    </div>
  );
}
