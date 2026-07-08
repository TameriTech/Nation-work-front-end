// app/(dashboard)/provider/profile/finances/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Badge } from "@/app/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/components/ui/tabs";
import { usePayments } from "@/app/hooks/payments/use-payments";

// Types
interface BankAccount {
  id: number;
  bank_name: string;
  account_holder: string;
  iban: string;
  bic: string;
  is_default: boolean;
  is_verified: boolean;
}

interface PaymentHistory {
  id: number;
  amount: number;
  status: "pending" | "completed" | "failed";
  date: string;
  mission_title: string;
  transaction_id: string;
}

interface WithdrawalRequest {
  id: number;
  amount: number;
  status: "pending" | "processing" | "completed" | "rejected";
  date: string;
  payment_method: string;
}

export default function FinancesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [addBankModal, setAddBankModal] = useState(false);
  const [withdrawModal, setWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");

  const {
    payouts,
    stats,
    summary
  } = usePayments();

  console.log("Payouts:", payouts);
  console.log("Stats:", stats.data);
  console.log("Summary:", summary);

  // Données mockées (à remplacer par vos appels API)
  const balance = {
    total_earned: 245000,
    available: 18750,
    pending: 12500,
    withdrawn: 213750,
  };

  const bankAccounts: BankAccount[] = [
    {
      id: 1,
      bank_name: "Banque Atlantique",
      account_holder: "Mamadou Diop",
      iban: "SN06 0001 0001 2345 6789 0123 45",
      bic: "BATLSNDA",
      is_default: true,
      is_verified: true,
    },
    {
      id: 2,
      bank_name: "Ecobank",
      account_holder: "Mamadou Diop",
      iban: "SN08 0002 0002 3456 7890 1234 56",
      bic: "ECOBSNDA",
      is_default: false,
      is_verified: true,
    },
  ];

  const paymentHistory: PaymentHistory[] = [
    {
      id: 1,
      amount: 50000,
      status: "completed",
      date: "2024-03-15",
      mission_title: "Développement site e-commerce",
      transaction_id: "TRX-001234",
    },
    {
      id: 2,
      amount: 35000,
      status: "completed",
      date: "2024-03-10",
      mission_title: "Application mobile",
      transaction_id: "TRX-001235",
    },
    {
      id: 3,
      amount: 25000,
      status: "pending",
      date: "2024-03-18",
      mission_title: "Refonte site vitrine",
      transaction_id: "TRX-001236",
    },
  ];

  const withdrawalHistory: WithdrawalRequest[] = [
    {
      id: 1,
      amount: 50000,
      status: "completed",
      date: "2024-03-01",
      payment_method: "Banque Atlantique",
    },
    {
      id: 2,
      amount: 75000,
      status: "completed",
      date: "2024-02-15",
      payment_method: "Ecobank",
    },
    {
      id: 3,
      amount: 30000,
      status: "pending",
      date: "2024-03-16",
      payment_method: "Banque Atlantique",
    },
  ];

  const handleWithdraw = () => {
    console.log("Retrait demandé:", { amount: withdrawAmount, bankId: selectedBank });
    setWithdrawModal(false);
    setWithdrawAmount("");
  };

  const handleAddBank = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Ajout compte bancaire");
    setAddBankModal(false);
  };

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string; icon: string }> = {
      pending: { label: "En attente", className: "bg-yellow-100 text-yellow-700", icon: "ph:clock" },
      processing: { label: "En cours", className: "bg-blue-100 text-blue-700", icon: "ph:arrow-clockwise" },
      completed: { label: "Terminé", className: "bg-green-100 text-green-700", icon: "ph:check-circle" },
      rejected: { label: "Rejeté", className: "bg-red-100 text-red-700", icon: "ph:x-circle" },
      disputed: { label: "En disput", className: "bg-orange-100 text-orange-700", icon: "ph:exclamation-triangle" },
    };
    return config[status] || config.pending;
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Mes finances
            </h1>
            <p className="text-text-secondary dark:text-gray-400">
              Gérez vos gains, retraits et informations bancaires
            </p>
          </div>
        </div>

        {/* Cartes de solde */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="rounded-2xl p-6 bg-gradient-to-br from-primary to-primary/80 text-white">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm opacity-90">Total gagné</span>
              <Icon icon="ph:currency-circle-euro" className="w-5 h-5 opacity-90" />
            </div>
            <div className="text-3xl font-bold">{balance.total_earned.toLocaleString()}€</div>
            <div className="text-xs opacity-75 mt-2">Depuis le début</div>
          </Card>

          <Card className="rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Disponible</span>
              <Icon icon="ph:wallet" className="w-5 h-5 text-success" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{balance.available.toLocaleString()}€</div>
            <button 
              onClick={() => setWithdrawModal(true)}
              className="mt-3 text-sm text-primary hover:underline flex items-center gap-1"
            >
              Retirer <Icon icon="ph:arrow-right" className="w-3 h-3" />
            </button>
          </Card>

          <Card className="rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">En attente</span>
              <Icon icon="ph:clock" className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{balance.pending.toLocaleString()}€</div>
            <div className="text-xs text-text-secondary mt-2">Paiements en cours de validation</div>
          </Card>

          <Card className="rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-text-secondary">Retiré</span>
              <Icon icon="ph:bank" className="w-5 h-5 text-primary" />
            </div>
            <div className="text-2xl font-bold text-text-primary">{balance.withdrawn.toLocaleString()}€</div>
            <div className="text-xs text-text-secondary mt-2">Total retiré vers vos comptes</div>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-surface dark:bg-gray-800 p-1 rounded-xl mb-6">
            <TabsTrigger value="overview" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Historique
            </TabsTrigger>
            <TabsTrigger value="withdrawals" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Retraits
            </TabsTrigger>
            <TabsTrigger value="bank" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white">
              Comptes bancaires
            </TabsTrigger>
          </TabsList>

          {/* Onglet Aperçu */}
          <TabsContent value="overview" className="space-y-6">
            {/* Graphique des gains (à implémenter avec une librairie comme recharts) */}
            <Card className="rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Évolution des gains</h2>
                <Select defaultValue="6">
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Période" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 mois</SelectItem>
                    <SelectItem value="6">6 mois</SelectItem>
                    <SelectItem value="12">12 mois</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                <div className="text-center text-text-secondary">
                  <Icon icon="ph:chart-line" className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Graphique des gains</p>
                  <p className="text-xs">(Intégration avec Recharts)</p>
                </div>
              </div>
            </Card>

            {/* Derniers paiements */}
            <Card className="rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Derniers paiements</h2>
                <button onClick={() => setActiveTab("history")} className="text-sm text-primary hover:underline">
                  Voir tout
                </button>
              </div>
              <div className="space-y-3">
                {summary?.slice(0, 3).map((payment:any) => (
                  <div key={payment.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                    <div>
                      <p className="font-medium">{payment.service_title}</p>
                      <p className="text-xs text-text-secondary">{new Date(payment.created_at).toLocaleDateString("fr-FR")}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-success">{payment.amount.toLocaleString()}€</p>
                      <Badge className={getStatusBadge(payment.status).className}>
                        {getStatusBadge(payment.status).label}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </TabsContent>

          {/* Onglet Historique des paiements */}
          <TabsContent value="history">
            <Card className="rounded-2xl p-6">
              <h2 className="text-lg font-semibold mb-4">Historique des paiements</h2>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-gray-200 dark:border-gray-700">
                    <tr className="text-left text-sm text-text-secondary">
                      <th className="pb-3">Mission</th>
                      <th className="pb-3">Date</th>
                      <th className="pb-3">Transaction</th>
                      <th className="pb-3 text-right">Montant</th>
                      <th className="pb-3">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {summary?.map((payment: any) => (
                      <tr key={payment.id} className="text-sm">
                        <td className="py-3 font-medium">{payment.service_title}</td>
                        <td className="py-3 text-text-secondary">{new Date(payment.created_at).toLocaleDateString("fr-FR")}</td>
                        <td className="py-3 text-text-secondary">{payment.invoice_number}</td>
                        <td className="py-3 text-right font-semibold">{payment.amount.toLocaleString()}€</td>
                        <td className="py-3">
                          <Badge className={getStatusBadge(payment.status).className}>
                            {getStatusBadge(payment.status).label}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </TabsContent>

          {/* Onglet Historique des retraits */}
          <TabsContent value="withdrawals">
            <Card className="rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Historique des retraits</h2>
                <Button onClick={() => setWithdrawModal(true)} className="rounded-full">
                  <Icon icon="ph:arrow-up" className="w-4 h-4 mr-2" />
                  Nouveau retrait
                </Button>
              </div>
              <div className="space-y-3">
                {withdrawalHistory.map((withdrawal) => {
                  const statusConfig = getStatusBadge(withdrawal.status);
                  return (
                    <div key={withdrawal.id} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
                      <div>
                        <p className="font-medium">{withdrawal.payment_method}</p>
                        <p className="text-xs text-text-secondary">{new Date(withdrawal.date).toLocaleDateString("fr-FR")}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">{withdrawal.amount.toLocaleString()}€</p>
                        <Badge className={statusConfig.className}>
                          <Icon icon={statusConfig.icon} className="w-3 h-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </TabsContent>

          {/* Onglet Comptes bancaires */}
          <TabsContent value="bank" className="space-y-6">
            <Card className="rounded-2xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Mes comptes bancaires</h2>
                <Button onClick={() => setAddBankModal(true)} className="rounded-full">
                  <Icon icon="ph:plus" className="w-4 h-4 mr-2" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-4">
                {bankAccounts.map((account) => (
                  <div key={account.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon icon="ph:bank" className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">{account.bank_name}</h3>
                          {account.is_default && (
                            <Badge className="bg-primary/10 text-primary">Principal</Badge>
                          )}
                          {account.is_verified && (
                            <Badge className="bg-success/10 text-success">
                              <Icon icon="ph:check-circle" className="w-3 h-3 mr-1" />
                              Vérifié
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-text-secondary">Titulaire: {account.account_holder}</p>
                        <p className="text-sm text-text-secondary font-mono">IBAN: {account.iban}</p>
                        <p className="text-sm text-text-secondary font-mono">BIC: {account.bic}</p>
                      </div>
                      <div className="flex gap-2">
                        {!account.is_default && (
                          <button className="p-2 text-primary hover:bg-primary/10 rounded-lg">
                            <Icon icon="ph:star" className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-2 text-red-500 hover:bg-red-100 rounded-lg">
                          <Icon icon="ph:trash" className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-2xl p-6 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800">
              <div className="flex gap-3">
                <Icon icon="ph:info" className="w-5 h-5 text-amber-600 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-amber-800 dark:text-amber-300">Informations importantes</p>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    Les retraits sont traités sous 24-48h ouvrées. Assurez-vous que vos informations bancaires sont correctes pour éviter tout retard.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/dashboard/provider/profile")} className="rounded-full">
            Retour au profil
          </Button>
        </div>
      </div>

      {/* Modal de retrait */}
      <Dialog open={withdrawModal} onOpenChange={setWithdrawModal}>
        <DialogContent className="sm:max-w-[450px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Effectuer un retrait</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Montant disponible</Label>
              <div className="text-2xl font-bold text-primary mt-1">{balance.available.toLocaleString()}€</div>
            </div>
            <div>
              <Label>Montant à retirer *</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">€</span>
                <Input
                  type="number"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  placeholder="0.00"
                  className="pl-8"
                />
              </div>
            </div>
            <div>
              <Label>Compte bancaire *</Label>
              <Select value={selectedBank} onValueChange={setSelectedBank}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez un compte" />
                </SelectTrigger>
                <SelectContent>
                  {bankAccounts.map((account) => (
                    <SelectItem key={account.id} value={account.id.toString()}>
                      {account.bank_name} - {account.iban.slice(-8)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setWithdrawModal(false)}>Annuler</Button>
            <Button onClick={handleWithdraw} disabled={!withdrawAmount || !selectedBank} className="bg-primary">
              Confirmer le retrait
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal ajout compte bancaire */}
      <Dialog open={addBankModal} onOpenChange={setAddBankModal}>
        <DialogContent className="sm:max-w-[500px] dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>Ajouter un compte bancaire</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddBank} className="space-y-4">
            <div>
              <Label>Nom de la banque *</Label>
              <Input name="bank_name" required placeholder="Ex: Banque Atlantique" className="mt-1" />
            </div>
            <div>
              <Label>Titulaire du compte *</Label>
              <Input name="account_holder" required placeholder="Nom complet" className="mt-1" />
            </div>
            <div>
              <Label>IBAN *</Label>
              <Input name="iban" required placeholder="Ex: SN06 0001 0001 2345 6789 0123 45" className="mt-1 font-mono" />
            </div>
            <div>
              <Label>Code BIC / SWIFT *</Label>
              <Input name="bic" required placeholder="Ex: BATLSNDA" className="mt-1 uppercase" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setAddBankModal(false)}>Annuler</Button>
              <Button type="submit" className="bg-primary">Ajouter</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
