// app/(dashboard)/provider/jobs/history/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Badge } from "@/app/components/ui/badge";
import { MissionCard } from "@/app/components/ui/Cards/mission";
import { useproviderServices } from "@/app/hooks/services/use-provider-service";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/app/components/ui/tabs";
import { cn } from "@/app/lib/utils";

type HistoryStatus = "all" | "pending" | "accepted" | "rejected" | "completed";

export default function JobHistoryPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<HistoryStatus>("all");
  const { applications, isLoadingAvailable, isFavorite, toggleFavorite } = useproviderServices();

  const getStatusInfo = (status: string) => {
    const statusMap: Record<string, { label: string; color: string; icon: string }> = {
      pending: { label: "En attente", color: "bg-secondary/10 text-secondary border-secondary/20 dark:bg-secondary/20 dark:text-secondary-400", icon: "ph:clock" },
      accepted: { label: "Acceptée", color: "bg-success/10 text-success border-success/20 dark:bg-success/20 dark:text-green-400", icon: "ph:check-circle" },
      rejected: { label: "Refusée", color: "bg-error/10 text-error border-error/20 dark:bg-error/20 dark:text-red-400", icon: "ph:x-circle" },
      completed: { label: "Terminée", color: "bg-primary/10 text-primary border-primary/20 dark:bg-primary/20 dark:text-primary-400", icon: "ph:check" },
    };
    return statusMap[status] || statusMap.pending;
  };

  const filteredApplications = applications?.filter((app: any) => {
    const matchesSearch = app.title?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "all" || app.user_candidature_status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  console.log("Applications:", applications); // Debug log to check the structure of applications

  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter((a: any) => a.user_candidature_status === "pending").length || 0,
    accepted: applications?.filter((a: any) => a.user_candidature_status === "accepted").length || 0,
    rejected: applications?.filter((a: any) => a.user_candidature_status === "rejected").length || 0,
    completed: applications?.filter((a: any) => a.user_candidature_status === "completed").length || 0,
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <Link 
                href="/dashboard/provider/missions" 
                className="text-primary hover:text-primary/80 dark:text-primary-400 dark:hover:text-primary-300 hover:underline mb-2 inline-flex items-center gap-1 text-sm"
              >
                <Icon icon="ph:arrow-left" className="w-4 h-4" />
                Retour aux missions
              </Link>
              <h1 className="text-3xl font-bold text-text-primary dark:text-gray-100 mt-2">
                Historique des candidatures
              </h1>
              <p className="text-text-secondary dark:text-gray-400 mt-2">
                Suivez toutes vos candidatures et leur statut
              </p>
            </div>
            
            <Link href="/dashboard/provider/missions/favorites">
              <Button variant="outline" className="rounded-xl border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/40 dark:border-primary-400/30 dark:text-primary-400 dark:hover:bg-primary/20 dark:hover:border-primary-400/50">
                <Icon icon="ph:heart" className="w-4 h-4 mr-2" />
                Mes favoris
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-text-primary dark:text-gray-100">{stats.total}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">Total</p>
              </div>
              <Icon icon="ph:briefcase" className="w-8 h-8 text-gray-400 dark:text-gray-500" />
            </div>
          </div>
          
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-secondary dark:text-secondary-400">{stats.pending}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">En attente</p>
              </div>
              <Icon icon="ph:clock" className="w-8 h-8 text-secondary dark:text-secondary-400" />
            </div>
          </div>
          
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-success dark:text-green-400">{stats.accepted}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">Acceptées</p>
              </div>
              <Icon icon="ph:check-circle" className="w-8 h-8 text-success dark:text-green-400" />
            </div>
          </div>
          
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-error dark:text-red-400">{stats.rejected}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">Refusées</p>
              </div>
              <Icon icon="ph:x-circle" className="w-8 h-8 text-error dark:text-red-400" />
            </div>
          </div>
          
          <div className="bg-surface dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-primary dark:text-primary-400">{stats.completed}</p>
                <p className="text-xs text-text-secondary dark:text-gray-400">Terminées</p>
              </div>
              <Icon icon="ph:check" className="w-8 h-8 text-primary dark:text-primary-400" />
            </div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans l'historique..."
              className={cn(
                "pl-10 h-12 rounded-xl focus:ring-2 focus:ring-primary",
                "border-gray-200 dark:border-gray-700",
                "bg-surface dark:bg-gray-800",
                "text-text-primary dark:text-gray-100",
                "placeholder:text-text-secondary dark:placeholder:text-gray-500"
              )}
            />
            <Icon
              icon="ph:magnifying-glass"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <Icon icon="ph:x" className="w-4 h-4 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300" />
              </button>
            )}
          </div>
        </div>

        {/* Status Tabs */}
        <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as HistoryStatus)} className="mb-6">
          <TabsList className="bg-surface dark:bg-gray-800 p-1 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
            <TabsTrigger value="all" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Toutes
              <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                {stats.total}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              En attente
              <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                {stats.pending}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="accepted" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Acceptées
              <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                {stats.accepted}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Refusées
              <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                {stats.rejected}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg data-[state=active]:bg-primary data-[state=active]:text-white dark:data-[state=active]:bg-primary-600">
              Terminées
              <Badge variant="secondary" className="ml-2 bg-gray-100 dark:bg-gray-700 text-text-secondary dark:text-gray-300">
                {stats.completed}
              </Badge>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={statusFilter} className="mt-6">
            {isLoadingAvailable ? (
              <div className="text-center py-16">
                <Icon icon="ph:spinner" className="w-12 h-12 text-primary dark:text-primary-400 animate-spin mx-auto" />
                <p className="mt-4 text-text-secondary dark:text-gray-400">Chargement de l'historique...</p>
              </div>
            ) : filteredApplications.length === 0 ? (
              <div className="text-center py-16 bg-surface dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
                <Icon icon="ph:clock-counter-clockwise" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-text-primary dark:text-gray-100 mb-2">
                  {searchQuery ? "Aucun résultat trouvé" : "Aucune candidature"}
                </h3>
                <p className="text-text-secondary dark:text-gray-400 mb-6">
                  {searchQuery 
                    ? "Essayez une autre recherche" 
                    : "Vous n'avez pas encore postulé à des missions"}
                </p>
                {!searchQuery && (
                  <Link href="/dashboard/provider/missions">
                    <Button className="bg-primary hover:bg-primary/90 text-white rounded-xl">
                      Explorer les missions
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <>
                <div className="mb-4">
                  <p className="text-sm text-text-secondary dark:text-gray-400">
                    <span className="font-semibold text-text-primary dark:text-gray-100">
                      {filteredApplications.length}
                    </span>{" "}
                    candidature{filteredApplications.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-5">
                  {filteredApplications.map((application: any) => {
                    const statusInfo = getStatusInfo(application.status);
                    return (
                      <div key={application.id} className="relative">
                        <MissionCard
                          key={application.id}
                          service={application}
                          variant="provider"
                          hasApplied={application.user_candidature_id !== null}
                          isFavorite={application.is_favorited}
                          onFavoriteClick={() => toggleFavorite(application.code)}
                        />
                        {application.applied_date && (
                          <div className="absolute top-4 right-4 text-xs text-text-secondary dark:text-gray-400">
                            Postulé le {new Date(application.applied_date).toLocaleDateString('fr-FR')}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
