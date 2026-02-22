"use client";
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
import { useEffect, useState } from "react";
import ServiceFormWizard from "@/app/components/features/service-form/ServiceFormWizard";
import { Service } from "@/app/types/services";
import {
  destroyService,
  getClientServices,
} from "@/app/services/service.service";
import { toast } from "../../ui/sonner";
import { log } from "console";

const statusConfig = {
  draft: {
    label: "draft",
    className: "bg-amber-100 text-amber-700 border-amber-200",
  },
  in_progress: {
    label: "in progress",
    className: "bg-yellow-100 text-yellow-700 border-yellow-200",
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
  completed: {
    label: "completed",
    className: "bg-green-100 text-green-700 border-green-200",
  },
  pending: {
    label: "pending",
    className: "bg-orange-100 text-orange-700 border-orange-200",
  },
} as const;

export const ServicesTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [editServiceId, setEditServiceId] = useState<number | undefined>(
    undefined,
  );

  const [services, setServices] = useState<Service[]>([]);

  const fetchData = async () => {
    const data = await getClientServices();
    setServices(data.services as unknown as Service[]);
    console.log(data);
  };

  useEffect(() => {
    document.title = "Tableau de bord - Services";
    // load services data here
    fetchData();
  }, []);

  const deleteServices = async (serviceId: number) => {
    if (!confirm("Are you sure you want to delete this service?")) {
      return;
    }

    if (!serviceId) {
      toast.error("Service ID is missing.");
      console.log("Attempted to delete service but serviceId is undefined");
      return;
    }
    try {
      await destroyService(serviceId);

      toast.success("Service deleted successfully!");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete service.");
      console.error("Error deleting service:", error);
    }
  };

  const copyServiceLinkToClipboard = (link: string) => {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Service link copied to clipboard!");
      console.log("Service link copied to clipboard:", link);
    });
  };

  const viewServiceDetails = (serviceId: number) => {
    // navigate to service details page
    window.location.href = `/dashboard/customer/services/${serviceId}`;
  };

  const openFormWizard = (mode: "create" | "edit", serviceId?: number) => {
    setFormMode(mode);
    // set form wizard data if edit mode
    if (mode === "edit" && serviceId) {
      setEditServiceId(serviceId);
    }
    setIsOpen(true);
  };

  return (
    <Card className="relative bg-white text-gray-800 rounded-[30px]">
      <CardHeader className="flex-col lg:flex-row items-center gap-4 justify-between space-y-0 pb-4">
        <CardTitle className="text-sm font-semibold uppercase tracking-wide text-slate-400">
          My Services offers
        </CardTitle>

        <div className="flex items-center gap-4">
          {/* Search bar */}
          <div className="relative max-w-[400px] flex items-center gap-4">
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

          <div className="flex gap-2">
            <Button
              onClick={() => openFormWizard("create")}
              className="gap-2 bg-amber-600 rounded-[50px] hover:bg-orange-900 text-white"
            >
              <Icon icon={"bi:plus"} className="h-4 w-4" />
              Publier un service sur Nation Work
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
              <TableHead>Amount</TableHead>
              <TableHead>Candidates</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead className="w-24"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/** fix service.map is not a function */}
            {Array.isArray(services) && services.length > 0 ? (
              services.map((service) => {
                const status = statusConfig[service.status];
                if (!status) return null;
                return (
                  <TableRow
                    key={service.id}
                    className="border-b border-gray-300"
                  >
                    <TableCell>
                      <Checkbox className="bg-gray-100" />
                    </TableCell>

                    <TableCell>{service.title}</TableCell>

                    <TableCell>
                      <Badge variant="outline" className={status.className}>
                        <span
                          className={`mr-1.5 h-1.5 w-1.5 rounded-full text-nowrap ${
                            service.status === "in_progress"
                              ? "bg-amber-500"
                              : service.status === "published"
                                ? "bg-blue-500"
                                : service.status === "completed"
                                  ? "bg-emerald-500"
                                  : service.status === "canceled"
                                    ? "bg-destructive"
                                    : "bg-slate-400"
                          }`}
                        />
                        {status.label}
                      </Badge>
                    </TableCell>

                    {/** use stars */}

                    <TableCell className="font-medium">
                      {service.proposed_amount}
                    </TableCell>
                    <TableCell className="font-medium">
                      <div className="flex -space-x-5 overflow-hidden">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className="w-8 h-8 rounded-full border border-white bg-gray-300"
                          ></div>
                        ))}
                      </div>
                    </TableCell>

                    <TableCell>
                      {service.provider ? (
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={service.provider.avatar}
                              alt={service.provider.name}
                            />
                            <AvatarFallback>
                              {service.provider.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium text-nowrap">
                              {service.provider.name}
                            </p>
                            <p className="text-xs text-slate-400 text-nowrap">
                              {service.provider.phone}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-400">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => viewServiceDetails(service.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Icon
                            icon={"bi:eye"}
                            className="h-4 w-4 text-slate-400"
                          />
                        </Button>
                        <Button
                          onClick={() => openFormWizard("edit", service.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Icon
                            icon={"bi:pen"}
                            className="h-4 w-4 text-slate-400"
                          />
                        </Button>
                        <Button
                          onClick={() =>
                            copyServiceLinkToClipboard(
                              "/dashboard/customer/services/" + service.id,
                            )
                          }
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Icon
                            icon={"bi:link-45deg"}
                            className="h-4 w-4 text-slate-400"
                          />
                        </Button>
                        <Button
                          onClick={() => deleteServices(service.id)}
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                        >
                          <Icon
                            icon={"bi:trash"}
                            className="h-4 w-4 text-destructive"
                          />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No services found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
      {isOpen && (
        <ServiceFormWizard
          mode={formMode}
          serviceId={editServiceId}
          onCancel={() => setIsOpen(false)}
          fetchServices={fetchData}
        />
      )}
    </Card>
  );
};
