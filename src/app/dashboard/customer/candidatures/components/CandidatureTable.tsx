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
import { Candidature } from "@/app/types/candidature";

interface CandidatureTableProps {
  candidatures: Candidature[];
}

const statusConfig = {
  draft: {
    label: "draft",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  published: {
    label: "published",
    className: "bg-blue-900/20 text-primary border-blue-900/40",
  },
  closed: {
    label: "closed",
    className: "bg-emerald-100 text-emerald-700 border-emerald-200",
  },
  canceled: {
    label: "canceled",
    className: "bg-destructive/10 text-destructive border-destructive/20",
  },
  pending: {
    label: "pending",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
  accepted: {
    label: "accepted",
    className: "bg-blue-100 text-blue-700 border-blue-200",
  },
  rejected: {
    label: "rejected",
    className: "bg-red-100 text-red-700 border-red-200",
  },
} as const;

export const CandidatureTable = ({ candidatures }: CandidatureTableProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <Card className="bg-white text-gray-800 rounded-[30px]">
      <CardHeader className="flex-col gap-4 lg:flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Activité récente
        </CardTitle>

        <div className="flex flex-row md:flex-row md:items-center gap-4 md:gap-2">
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
                className="absolute right-8 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Icon icon={"bx:x"} className="text-2xl mr-5 text-blue-900" />
              </button>
            ) : null}
            <Icon
              icon={"bx:search"}
              className="absolute right-2 h-8 w-8 text-blue-900"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              className="gap-1 text-red-900 bg-transparent rounded-[50px] border border-red-900"
            >
              <Icon icon={"bi:x"} className="h-4 w-4" />
              Tout rejeter
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="border-b border-blue-900">
              <TableHead className="w-12">
                <Checkbox />
              </TableHead>
              <TableHead>Your offer</TableHead>
              <TableHead>Status of the offer</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Date of candidacy</TableHead>
              <TableHead>Average note</TableHead>
              <TableHead>Status Candidature</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {candidatures.map((candidature) => {
              const status = statusConfig[candidature.offerStatus];
              const statusCandidature =
                statusConfig[candidature.candidacyStatus];
              if (!status) return null;
              return (
                <TableRow
                  key={candidature.id}
                  className="border-b border-gray-300"
                >
                  <TableCell>
                    {/** change background when checkbox is checked */}
                    <Checkbox className="bg-gray-100" />
                  </TableCell>
                  <TableCell>{candidature.offerTitle}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={status.className}>
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full text-nowrap ${
                          candidature.offerStatus === "pending"
                            ? "bg-amber-500"
                            : candidature.offerStatus === "published"
                            ? "bg-blue-500"
                            : candidature.offerStatus === "closed"
                            ? "bg-emerald-500"
                            : candidature.offerStatus === "canceled"
                            ? "bg-destructive"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {candidature.provider ? (
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={candidature.provider.avatar}
                            alt={candidature.provider.name}
                          />
                          <AvatarFallback>
                            {candidature.provider.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-nowrap">
                            {candidature.provider.name}
                          </p>
                          <p className="text-xs text-muted-foreground text-nowrap">
                            {candidature.provider.phone}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-500 text-nowrap">
                    {candidature.candidacyDate}
                  </TableCell>
                  {/** use stars */}
                  <TableCell className="flex gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                      <Icon
                        icon={"bi:star"}
                        key={index}
                        className={
                          index < candidature.averageNote
                            ? "text-yellow-500"
                            : "text-gray-500"
                        }
                      />
                    ))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={statusCandidature.className}
                    >
                      <span
                        className={`mr-1.5 h-1.5 w-1.5 rounded-full text-nowrap ${
                          candidature.candidacyStatus === "pending"
                            ? "bg-amber-500"
                            : candidature.candidacyStatus === "accepted"
                            ? "bg-blue-500"
                            : candidature.candidacyStatus === "rejected"
                            ? "bg-red-500"
                            : "bg-muted-foreground"
                        }`}
                      />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-medium">
                    {candidature.amount}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon
                          icon={"bi:eye"}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon
                          icon={"bi:link-45deg"}
                          className="h-4 w-4 text-muted-foreground"
                        />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Icon
                          icon={"bi:trash"}
                          className="h-4 w-4 text-destructive"
                        />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
