// components/features/profile/modals/AddEducationModal.tsx
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
import { CreateEducationDto } from "@/app/types/user";

interface AddEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateEducationDto) => Promise<void>;
  initialData?: CreateEducationDto;
}

export function AddEducationModal({
  isOpen,
  onClose,
  onSave,
  initialData,
}: AddEducationModalProps) {
  const [formData, setFormData] = useState<CreateEducationDto>(
    initialData || {
      school: "",
      degree: "",
      field_of_study: "",
      description: "",
      start_date: "",
      end_date: "",
      is_current: false,
      grade: "",
    },
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Error saving education:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {initialData ? "Modifier" : "Ajouter"} une formation
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">Établissement *</Label>
            <Input
              id="school"
              value={formData.school}
              onChange={(e) =>
                setFormData({ ...formData, school: e.target.value })
              }
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="degree">Diplôme</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) =>
                  setFormData({ ...formData, degree: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fieldOfStudy">Domaine d'étude</Label>
              <Input
                id="fieldOfStudy"
                value={formData.field_of_study}
                onChange={(e) =>
                  setFormData({ ...formData, field_of_study: e.target.value })
                }
              />
            </div>
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
            <Label htmlFor="isCurrent">Je suis actuellement en formation</Label>
          </div>

          <div className="space-y-2">
            <Label htmlFor="grade">Mention/Grade</Label>
            <Input
              id="grade"
              value={formData.grade}
              onChange={(e) =>
                setFormData({ ...formData, grade: e.target.value })
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={3}
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
