// app/dashboard/customer/payments/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Input } from "@/app/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { usePayments } from "@/app/hooks/payments/use-payments";
import PaymentSummarySkeleton  from "./loading";
import  PaymentError  from "./error";

// Types
interface Transaction {
  id: string;
  service_id: number;
  service_title: string;
  provider_id: number;
  provider_name: string;
  amount: number;
  status: "pending" | "paid" | "failed" | "refunded";
  payment_method: "card" | "mobile_money" | "bank_transfer";
  created_at: string;
  paid_at?: string;
  transaction_id?: string;
}

interface PaymentSummary {
  total_spent: number;
  pending_payments: number;
  completed_payments: number;
  failed_payments: number;
  recent_transactions: Transaction[];
}

// Composant StatCard
const StatCard = ({
  title,
  value,
  icon,
  bgColor = "bg-white",
  textColor = "text-gray-900",
  iconBgColor = "bg-blue-100",
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  bgColor?: string;
  textColor?: string;
  iconBgColor?: string;
}) => (
  <Card className={`${bgColor} ${textColor} rounded-[30px] border-0 shadow-lg`}>
    <CardContent className="p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm opacity-90">{title}</p>
          <span className="text-3xl font-bold">{value}</span>
        </div>
        <div
          className={`w-12 h-12 rounded-full ${iconBgColor} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
    </CardContent>
  </Card>
);

// Badge de statut
const StatusBadge = ({ status }: { status: Transaction["status"] }) => {
  const config = {
    pending: {
      label: "En attente",
      className: "bg-orange-100 text-orange-700 border-orange-200",
      icon: "bi:clock-history",
    },
    paid: {
      label: "Payé",
      className: "bg-green-100 text-green-700 border-green-200",
      icon: "bi:check-circle",
    },
    failed: {
      label: "Échoué",
      className: "bg-red-100 text-red-700 border-red-200",
      icon: "bi:x-circle",
    },
    refunded: {
      label: "Remboursé",
      className: "bg-purple-100 text-purple-700 border-purple-200",
      icon: "bi:arrow-return-left",
    },
  }[status];

  return (
    <Badge variant="outline" className={`${config.className} border-0`}>
      <span className="flex items-center gap-1.5">
        <Icon icon={config.icon} className="w-3.5 h-3.5" />
        {config.label}
      </span>
    </Badge>
  );
};

export default function CustomerPaymentsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { userSummary, isLoadingUserSummary, formatAmount, generateInvoice, exportTransactions } = usePayments(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});

  if (isLoadingUserSummary) {
    return <PaymentSummarySkeleton />;
  }

  // Données simulées en attendant l'API réelle
  const mockSummary: PaymentSummary = {
    total_spent: 1250000,
    pending_payments: 350000,
    completed_payments: 900000,
    failed_payments: 0,
    recent_transactions: [
      {
        id: "tx_1",
        service_id: 1,
        service_title: "Catering pour événement - Cuisine camerounaise",
        provider_id: 101,
        provider_name: "Marie Claire",
        amount: 150000,
        status: "paid",
        payment_method: "mobile_money",
        created_at: "2026-03-10T14:30:00Z",
        paid_at: "2026-03-10T14:32:00Z",
        transaction_id: "MTN123456",
      },
      {
        id: "tx_2",
        service_id: 2,
        service_title: "Développement site e-commerce",
        provider_id: 102,
        provider_name: "Jean Paul",
        amount: 350000,
        status: "pending",
        payment_method: "bank_transfer",
        created_at: "2026-03-12T09:15:00Z",
      },
      {
        id: "tx_3",
        service_id: 3,
        service_title: "Photographie mariage",
        provider_id: 103,
        provider_name: "Sophie N.",
        amount: 250000,
        status: "paid",
        payment_method: "card",
        created_at: "2026-03-08T11:00:00Z",
        paid_at: "2026-03-08T11:05:00Z",
      },
      {
        id: "tx_4",
        service_id: 4,
        service_title: "Nettoyage bureaux",
        provider_id: 104,
        provider_name: "Clemence T.",
        amount: 75000,
        status: "paid",
        payment_method: "mobile_money",
        created_at: "2026-03-05T10:30:00Z",
        paid_at: "2026-03-05T10:35:00Z",
      },
      {
        id: "tx_5",
        service_id: 5,
        service_title: "Consulting marketing digital",
        provider_id: 105,
        provider_name: "Pierre K.",
        amount: 425000,
        status: "failed",
        payment_method: "card",
        created_at: "2026-03-11T16:45:00Z",
      },
    ],
  };

  // Filtrer les transactions
  const filteredTransactions = mockSummary.recent_transactions.filter((t) => {
    const matchesSearch =
      t.service_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.provider_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.transaction_id?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || t.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Mes paiements
          </h1>
          <p className="text-gray-500 mt-1">
            Gérez vos transactions et effectuez des paiements
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => exportTransactions("excel")}
            className="gap-2 rounded-full"
          >
            <Icon icon="bi:download" className="w-4 h-4" />
            Exporter
          </Button>
          <Button
            onClick={() => router.push("/dashboard/customer/payments/new")}
            className="gap-2 rounded-full bg-blue-600 hover:bg-blue-700"
          >
            <Icon icon="bi:plus" className="w-4 h-4" />
            Nouveau paiement
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-4">
        <StatCard
          title="Total dépensé"
          value={formatAmount(mockSummary.total_spent)}
          icon={<Icon icon="bi:wallet2" className="w-6 h-6 text-blue-600" />}
          bgColor="bg-gradient-to-br from-blue-900 to-blue-800"
          textColor="text-white"
          iconBgColor="bg-white/20"
        />
        <StatCard
          title="En attente"
          value={formatAmount(mockSummary.pending_payments)}
          icon={<Icon icon="bi:clock-history" className="w-6 h-6 text-orange-600" />}
          iconBgColor="bg-orange-100"
        />
        <StatCard
          title="Complétés"
          value={formatAmount(mockSummary.completed_payments)}
          icon={<Icon icon="bi:check-circle" className="w-6 h-6 text-green-600" />}
          iconBgColor="bg-green-100"
        />
        <StatCard
          title="Échoués"
          value={mockSummary.failed_payments}
          icon={<Icon icon="bi:x-circle" className="w-6 h-6 text-red-600" />}
          iconBgColor="bg-red-100"
        />
      </div>

      {/* Transactions Table */}
      <Card className="bg-white rounded-[30px] border-0 shadow-lg">
        <CardHeader className="flex-col gap-4 lg:flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Historique des transactions
          </CardTitle>

          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 rounded-full"
              />
              <Icon
                icon="bi:search"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              />
            </div>

            {/* Status Filter */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40 rounded-full">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent>
          {filteredTransactions.length === 0 ? (
            <div className="text-center py-12">
              <Icon
                icon="bi:wallet"
                className="w-16 h-16 text-gray-300 mx-auto mb-4"
              />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucune transaction
              </h3>
              <p className="text-gray-500 mb-4">
                Vous n'avez pas encore effectué de paiement
              </p>
              <Button
                onClick={() => router.push("/dashboard/customer/payments/new")}
                className="rounded-full"
              >
                Effectuer un paiement
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-gray-200 bg-gray-50">
                    <TableHead className="rounded-l-lg">Date</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Prestataire</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Référence</TableHead>
                    <TableHead className="rounded-r-lg w-32"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredTransactions.map((transaction) => (
                    <TableRow
                      key={transaction.id}
                      className="border-b border-gray-100 hover:bg-gray-50"
                    >
                      <TableCell className="whitespace-nowrap">
                        {new Date(transaction.created_at).toLocaleDateString(
                          "fr-FR",
                          {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          }
                        )}
                        <br />
                        <span className="text-xs text-gray-400">
                          {new Date(transaction.created_at).toLocaleTimeString(
                            "fr-FR",
                            {
                              hour: "2-digit",
                              minute: "2-digit",
                            }
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {transaction.service_title}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium text-gray-600">
                              {transaction.provider_name.charAt(0)}
                            </span>
                          </div>
                          <span className="text-sm">
                            {transaction.provider_name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatAmount(transaction.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Icon
                            icon={
                              transaction.payment_method === "mobile_money"
                                ? "bi:phone"
                                : transaction.payment_method === "bank_transfer"
                                ? "bi:bank"
                                : "bi:credit-card"
                            }
                            className="w-4 h-4 text-gray-400"
                          />
                          <span className="text-sm text-gray-600">
                            {transaction.payment_method === "mobile_money"
                              ? "Mobile Money"
                              : transaction.payment_method === "bank_transfer"
                              ? "Virement"
                              : "Carte"}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={transaction.status} />
                      </TableCell>
                      <TableCell>
                        <span className="text-xs text-gray-400">
                          {transaction.transaction_id || "-"}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 hover:bg-gray-100"
                            title="Voir détails"
                            onClick={() =>
                              router.push(
                                `/dashboard/customer/payments/${transaction.id}`
                              )
                            }
                          >
                            <Icon
                              icon="bi:eye"
                              className="h-4 w-4 text-gray-500"
                            />
                          </Button>
                          {transaction.status === "paid" && (
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 hover:bg-gray-100"
                              title="Télécharger la facture"
                              onClick={() => generateInvoice(transaction.id)}
                            >
                              <Icon
                                icon="bi:file-pdf"
                                className="h-4 w-4 text-red-500"
                              />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
