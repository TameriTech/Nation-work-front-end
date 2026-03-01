// components/features/profile/modals/AddSkillModal.tsx
"use client";
import { useState, useEffect } from "react";
import { Button } from "@/app/components/ui/button";
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
import { Label } from "@/app/components/ui/label";
import { Input } from "@/app/components/ui/input";
import { Skill } from "@/app/types/user";

interface AddSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    skillId: number,
    skillType: string,
    proficiency: number,
  ) => Promise<void>;
  availableSkills: Skill[];
}

export function AddSkillModal({
  isOpen,
  onClose,
  onSave,
  availableSkills,
}: AddSkillModalProps) {
  const [skillId, setSkillId] = useState<number>(0);
  const [skillType, setSkillType] = useState("primary");
  const [proficiency, setProficiency] = useState(3);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!skillId) return;

    setLoading(true);
    try {
      await onSave(skillId, skillType, proficiency);
      resetForm();
      onClose();
    } catch (error) {
      console.error("Error saving skill:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setSkillId(0);
    setSkillType("primary");
    setProficiency(3);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Ajouter une compétence</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Compétence *</Label>
            <Select
              value={skillId.toString()}
              onValueChange={(value) => setSkillId(parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez une compétence" />
              </SelectTrigger>
              <SelectContent>
                {availableSkills.map((skill) => (
                  <SelectItem key={skill.id} value={skill.id.toString()}>
                    {skill.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="skillType">Type de compétence</Label>
            <Select value={skillType} onValueChange={setSkillType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="primary">Principale</SelectItem>
                <SelectItem value="secondary">Secondaire</SelectItem>
                <SelectItem value="other">Autre</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="proficiency">Niveau de compétence (1-5)</Label>
            <Input
              id="proficiency"
              type="number"
              min={1}
              max={5}
              value={proficiency}
              onChange={(e) => setProficiency(parseInt(e.target.value))}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !skillId}>
              {loading ? "Ajout..." : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
