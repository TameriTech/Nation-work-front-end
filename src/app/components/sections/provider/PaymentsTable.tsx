import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Badge } from "@/app/components/ui/badge";
import { Checkbox } from "@/app/components/ui/checkbox";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/app/components/ui/table";
import { Icon } from "@iconify/react";
import { useState } from "react";
import { PaymentProps } from "@/app/types/payments";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import { Pagination } from "@/app/components/ui/pagination";

interface PaymentsTableProps {
  payments: PaymentProps[];
}

const statusConfig = {
  canceled: {
    label: "canceled",
    className: "bg-red-100 text-red-700 border-red-200",
  },
  pending: {
    label: "pending",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  paid: {
    label: "paid",
    className: "bg-green-100 text-green-700 border-green-200",
  },
} as const;

export const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Card className="bg-white shadow-none text-gray-800 rounded-[30px] p-0">
      <CardHeader className="p-0">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-blue-900 mb-4">
          Historique des paiements
        </CardTitle>

        <div className="flex flex-wrap gap-2 items-center justify-start lg:justify-between space-y-0 pb-4">
          {/* Search bar */}
          <div className="relative max-w-[400px] flex items-center">
            <input
              type="text"
              placeholder="Effectuer une recherche"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-gray-900 placeholder:text-gray-500 border rounded-[50px] text-sm py-2 pr-10 pl-4 focus:outline-none transition-colors"
            />
            {searchQuery ? (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-8 text-slate-400 hover:text-foreground transition-colors"
              >
                <Icon icon={"bx:x"} className="text-2xl mr-5 text-blue-900" />
              </button>
            ) : null}
            <Icon
              icon={"bx:search"}
              className="absolute right-2 h-8 w-8 text-blue-900"
            />
          </div>

          <div className="relative max-w-[400px] flex items-center">
            <Select>
              <SelectTrigger className="w-[200px] rounded-full bg-white border-border">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="paid">Payé</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="canceled">Annulé</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button
            variant="ghost"
            className="text-sm text-white bg-blue-900 rounded-full"
          >
            <Icon icon={"bi:funnel"} className="h-4 w-4 text-white" />
            <span className="hidden">Filtres avancés</span>
          </Button>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-1 text-white bg-blue-900 rounded-[50px]"
            >
              {"Exporter l'historique"}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="text-sm text-blue-900 bg-white rounded-full border border-blue-900"
          >
            <Icon
              icon={"bx:bx-dots-vertical"}
              className="h-4 w-4 text-blue-900"
            />
            <span className="hidden">Filtres avancés</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-blue-900">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Date Of Transaction</TableHead>
              <TableHead>Bill Code</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Job</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payments.map((payment) => {
              const status = statusConfig[payment.status];
              return (
                <TableRow key={payment.id} className="border-b border-gray-300">
                  <TableCell>
                    {/** change background when checkbox is checked */}
                    <Checkbox className="bg-gray-100" />
                  </TableCell>
                  <TableCell>{payment.issue_date}</TableCell>
                  <TableCell>{payment.bill_number}</TableCell>
                  <TableCell>{payment.amount}</TableCell>

                  <TableCell>
                    {payment.job ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={payment.job.avatar}
                            alt={payment.job.provider}
                          />
                          <AvatarFallback className="bg-blue-300">
                            {payment.job.provider.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-nowrap">
                            {payment.job.provider}
                          </p>
                          <p className="text-xs text-slate-400 text-nowrap">
                            {payment.job.title}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full text-nowrap ${
                          payment.status === "pending"
                            ? "bg-amber-500"
                            : payment.status === "paid"
                            ? "bg-emerald-500"
                            : payment.status === "canceled"
                            ? "bg-red-500"
                            : "bg-slate-400"
                        }`}
                      />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon
                          icon={"bi:arrow-up"}
                          className="h-4 w-4 text-slate-400"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
        <Pagination />
      </CardContent>
    </Card>
  );
};
