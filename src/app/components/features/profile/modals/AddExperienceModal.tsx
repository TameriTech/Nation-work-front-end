// components/features/profile/modals/AddExperienceModal.tsx
"use client";
import { useState } from "react";
import { Button } from "@/app/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/app/components/ui/dialog";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Checkbox } from "@/app/components/ui/checkbox";
import { CreateExperienceDto } from "@/app/types/user";

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateExperienceDto) => Promise<void>;
  initialData?: CreateExperienceDto;
}

export function AddExperienceModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddExperienceModalProps) {
  const [formData, setFormData] = useState<CreateExperienceDto>(
    initialData || {
      position: "",
      company: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      location: "",
    },
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form with data: ", formData);

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving experience:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier" : "Ajouter"} une expérience
            professionnelle
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="position">Poste occupé *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) =>
                setFormData({ ...formData, position: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="company">Entreprise *</Label>
            <Input
              id="company"
              value={formData.company}
              onChange={(e) =>
                setFormData({ ...formData, company: e.target.value })
              }
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Lieu</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) =>
                setFormData({ ...formData, location: e.target.value })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Date de début *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.start_date}
                onChange={(e) =>
                  setFormData({ ...formData, start_date: e.target.value })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">Date de fin</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.end_date}
                onChange={(e) =>
                  setFormData({ ...formData, end_date: e.target.value })
                }
                disabled={formData.is_current}
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isCurrent"
              checked={formData.is_current}
              onCheckedChange={(checked) =>
                setFormData({
                  ...formData,
                  is_current: checked as boolean,
                  end_date: "",
                })
              }
            />
            <Label htmlFor="isCurrent">Je travaille actuellement ici</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading
                ? "Enregistrement..."
                : initialData
                  ? "Modifier"
                  : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
