// app/dashboard/customer/payments/new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { toast } from "sonner";
import { z } from "zod";

import { Card, CardContent } from "@/app/components/ui/card";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/app/components/ui/radio-group";
import { useAuth } from "@/app/hooks/auth/use-auth";
import { usePayments } from "@/app/hooks/payments/use-payments";

// Schéma de validation
const paymentSchema = z.object({
  service_id: z.number().min(1, "Veuillez sélectionner un service"),
  provider_id: z.number().min(1, "Veuillez sélectionner un prestataire"),
  amount: z.number().min(100, "Le montant minimum est de 100"),
  payment_method: z.enum(["mobile_money", "bank_transfer", "card"]),
  mobile_number: z.string().optional(),
  bank_account: z.string().optional(),
  card_number: z.string().optional(),
  card_expiry: z.string().optional(),
  card_cvv: z.string().optional(),
  description: z.string().optional(),
}).refine((data) => {
  // Validation conditionnelle selon la méthode de paiement
  if (data.payment_method === "mobile_money" && !data.mobile_number) {
    return false;
  }
  if (data.payment_method === "bank_transfer" && !data.bank_account) {
    return false;
  }
  if (data.payment_method === "card" && (!data.card_number || !data.card_expiry || !data.card_cvv)) {
    return false;
  }
  return true;
}, {
  message: "Veuillez remplir tous les champs requis",
  path: ["payment_method"],
});

type PaymentFormData = z.infer<typeof paymentSchema>;

// Types pour les services et freelances
interface Service {
  id: number;
  title: string;
  proposed_amount: number;
  provider_id: number;
  provider_name: string;
  status: string;
}

export default function NewPaymentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const { formatAmount } = usePayments(false);
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoadingServices, setIsLoadingServices] = useState(true);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      service_id: searchParams.get("serviceId") ? Number(searchParams.get("serviceId")) : undefined,
      provider_id: searchParams.get("providerId") ? Number(searchParams.get("providerId")) : undefined,
      amount: searchParams.get("amount") ? Number(searchParams.get("amount")) : undefined,
      payment_method: "mobile_money",
    },
  });

  const paymentMethod = watch("payment_method");
  const amount = watch("amount");

  // Charger les services du client
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Simuler un appel API - À remplacer par votre vrai service
        await new Promise(resolve => setTimeout(resolve, 1000));
        const mockServices: Service[] = [
          {
            id: 1,
            title: "Catering pour événement - Cuisine camerounaise",
            proposed_amount: 150000,
            provider_id: 101,
            provider_name: "Marie Claire",
            status: "accepted",
          },
          {
            id: 2,
            title: "Développement site e-commerce",
            proposed_amount: 350000,
            provider_id: 102,
            provider_name: "Jean Paul",
            status: "in_progress",
          },
          {
            id: 3,
            title: "Photographie mariage",
            proposed_amount: 250000,
            provider_id: 103,
            provider_name: "Sophie N.",
            status: "completed",
          },
        ];
        setServices(mockServices);
        
        // Si un serviceId est passé en paramètre, le sélectionner automatiquement
        const serviceId = searchParams.get("serviceId");
        if (serviceId) {
          const service = mockServices.find(s => s.id === Number(serviceId));
          if (service) {
            setSelectedService(service);
            setValue("service_id", service.id);
            setValue("provider_id", service.provider_id);
            setValue("amount", service.proposed_amount);
          }
        }
      } catch (error) {
        toast.error("Erreur lors du chargement des services");
      } finally {
        setIsLoadingServices(false);
      }
    };

    fetchServices();
  }, [searchParams, setValue]);

  const handleServiceChange = (serviceId: string) => {
    const service = services.find(s => s.id === Number(serviceId));
    if (service) {
      setSelectedService(service);
      setValue("service_id", service.id);
      setValue("provider_id", service.provider_id);
      setValue("amount", service.proposed_amount);
    }
  };

  const onSubmit = async (data: PaymentFormData) => {
    try {
      
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Paiement effectué avec succès !");
      router.push("/dashboard/customer/payments?success=true");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Une erreur est survenue");
    }
  };

  const handleCancel = () => router.back();

  if (isLoadingServices) {
    return (
      <div className="min-h-screen bg-white py-8">
        <div className="mx-auto px-4 max-w-3xl">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-100 rounded-2xl"></div>
            <div className="h-64 bg-gray-100 rounded-2xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="mx-auto px-4 max-w-3xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Effectuer un paiement
          </h1>
          <button
            type="button"
            onClick={handleCancel}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Icon icon="mdi:close" className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Section 1: Sélection du service */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                1. Sélectionner le service
              </h2>
              
              <div>
                <Label htmlFor="service">Service à payer *</Label>
                <Select
                  value={selectedService?.id.toString()}
                  onValueChange={handleServiceChange}
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue placeholder="Choisir un service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id.toString()}>
                        <div className="flex justify-between items-center w-full">
                          <span className="truncate max-w-[300px]">{service.title}</span>
                          <span className="ml-4 font-medium text-blue-600">
                            {formatAmount(service.proposed_amount)}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service_id && (
                  <p className="text-sm text-red-500 mt-1">{errors.service_id.message}</p>
                )}
              </div>

              {selectedService && (
                <div className="bg-blue-50 rounded-lg p-4 mt-4">
                  <div className="flex items-start gap-3">
                    <Icon icon="bi:info-circle" className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 font-medium">
                        {selectedService.title}
                      </p>
                      <p className="text-xs text-blue-700 mt-1">
                        Prestataire : {selectedService.provider_name}
                      </p>
                      <p className="text-xs text-blue-700">
                        Montant : {formatAmount(selectedService.proposed_amount)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Section 2: Montant */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                2. Montant du paiement
              </h2>
              
              <div>
                <Label htmlFor="amount">Montant (FCFA) *</Label>
                <div className="relative mt-1.5">
                  <Input
                    type="number"
                    min="100"
                    step="100"
                    {...register("amount", { valueAsNumber: true })}
                    className="pl-4 pr-16"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    FCFA
                  </span>
                </div>
                {errors.amount && (
                  <p className="text-sm text-red-500 mt-1">{errors.amount.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description (optionnelle)</Label>
                <Input
                  type="text"
                  {...register("description")}
                  placeholder="Ex: Paiement final, Acompte, etc."
                  className="mt-1.5"
                />
              </div>
            </CardContent>
          </Card>

          {/* Section 3: Mode de paiement */}
          <Card className="rounded-2xl border border-gray-100 shadow-sm">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">
                3. Mode de paiement
              </h2>
              
              <RadioGroup
                value={paymentMethod}
                onValueChange={(value: any) => setValue("payment_method", value)}
                className="space-y-3"
              >
                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="mobile_money" id="mobile_money" />
                  <Label htmlFor="mobile_money" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon icon="bi:phone" className="w-5 h-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Mobile Money</p>
                        <p className="text-xs text-gray-500">MTN, Orange, Moov</p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="bank_transfer" id="bank_transfer" />
                  <Label htmlFor="bank_transfer" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon icon="bi:bank" className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="font-medium">Virement bancaire</p>
                        <p className="text-xs text-gray-500">Traitement sous 24-48h</p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 border rounded-lg p-4 hover:bg-gray-50">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <Icon icon="bi:credit-card" className="w-5 h-5 text-purple-600" />
                      <div>
                        <p className="font-medium">Carte bancaire</p>
                        <p className="text-xs text-gray-500">Visa, Mastercard</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>

              {/* Champs conditionnels selon le mode de paiement */}
              {paymentMethod === "mobile_money" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="mobile_number">Numéro de téléphone *</Label>
                  <Input
                    {...register("mobile_number")}
                    placeholder="Ex: 6XXXXXXXX"
                    className="mt-1.5"
                  />
                  {errors.mobile_number && (
                    <p className="text-sm text-red-500 mt-1">{errors.mobile_number.message}</p>
                  )}
                  <p className="text-xs text-gray-500 mt-2">
                    Vous recevrez une demande de confirmation sur votre téléphone
                  </p>
                </div>
              )}

              {paymentMethod === "bank_transfer" && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <Label htmlFor="bank_account">Compte bancaire *</Label>
                  <Input
                    {...register("bank_account")}
                    placeholder="Numéro de compte"
                    className="mt-1.5"
                  />
                  {errors.bank_account && (
                    <p className="text-sm text-red-500 mt-1">{errors.bank_account.message}</p>
                  )}
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-xs text-blue-700 flex items-center gap-2">
                      <Icon icon="bi:info-circle" className="w-4 h-4" />
                      Les coordonnées bancaires vous seront communiquées par email
                    </p>
                  </div>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <Label htmlFor="card_number">Numéro de carte *</Label>
                    <Input
                      {...register("card_number")}
                      placeholder="XXXX XXXX XXXX XXXX"
                      className="mt-1.5"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label htmlFor="card_expiry">Date d'expiration *</Label>
                      <Input
                        {...register("card_expiry")}
                        placeholder="MM/AA"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="card_cvv">CVV *</Label>
                      <Input
                        {...register("card_cvv")}
                        type="password"
                        maxLength={3}
                        placeholder="XXX"
                        className="mt-1.5"
                      />
                    </div>
                  </div>
                  {(errors.card_number || errors.card_expiry || errors.card_cvv) && (
                    <p className="text-sm text-red-500">
                      Veuillez remplir tous les champs de la carte
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Récapitulatif */}
          {amount > 0 && (
            <Card className="rounded-2xl border border-blue-100 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-blue-700">Total à payer</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatAmount(amount)}
                    </p>
                  </div>
                  <Icon icon="bi:shield-check" className="w-8 h-8 text-blue-600" />
                </div>
                <p className="text-xs text-blue-600 mt-2 flex items-center gap-1">
                  <Icon icon="bi:lock" className="w-3 h-3" />
                  Paiement sécurisé
                </p>
              </CardContent>
            </Card>
          )}

          {/* Boutons */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              className="rounded-full px-8"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedService}
              className="rounded-full px-8 bg-blue-600 hover:bg-blue-700"
            >
              {isSubmitting ? (
                <>
                  <Icon icon="mdi:loading" className="animate-spin mr-2 h-4 w-4" />
                  Traitement...
                </>
              ) : (
                <>
                  <Icon icon="bi:check-lg" className="mr-2 h-4 w-4" />
                  Confirmer le paiement
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
