"use client"
// hooks/useFreelancerProfile.ts
import { useState, useEffect, useCallback } from 'react';
import * as userService from '@/app/services/users.service';
import { 
  FreelancerFullProfile, 
  ProfessionalExperience, 
  Education,
  FreelancerSkill,
  UpdateFreelancerProfileDto,
  CreateExperienceDto,
  CreateEducationDto
} from '@/app/types/user';
import { useToast } from '@/app/components/ui/use-toast';

export const useFreelancerProfile = () => {
  const [profile, setProfile] = useState<FreelancerFullProfile | null>(null);
  const [experiences, setExperiences] = useState<ProfessionalExperience[]>([]);
  const [educations, setEducations] = useState<Education[]>([]);
  const [skills, setSkills] = useState<FreelancerSkill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userService.getMyFreelancerProfile();
      setProfile(data);
      setExperiences(data.experiences || []);
      setEducations(data.educations || []);
      setSkills(data.skills || []);
      setError(null);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const updateProfile = async (data: UpdateFreelancerProfileDto) => {
    try {
      setLoading(true);
      const updated = await userService.updateMyFreelancerProfile(data);
      setProfile(updated);
      toast({
        title: "Succès",
        description: "Profil mis à jour avec succès",
      });
      return updated;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour du profil",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Expériences
  const addExperience = async (data: CreateExperienceDto) => {
    try {
      const newExp = await userService.addExperience(data);
      setExperiences(prev => [newExp, ...prev]);
      toast({
        title: "Succès",
        description: "Expérience ajoutée avec succès",
      });
      return newExp;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de l'expérience",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateExperience = async (id: number, data: CreateExperienceDto) => {
    try {
      const updated = await userService.updateExperience(id, data);
      setExperiences(prev => prev.map(exp => exp.id === id ? updated : exp));
      toast({
        title: "Succès",
        description: "Expérience mise à jour avec succès",
      });
      return updated;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de l'expérience",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteExperience = async (id: number) => {
    try {
      await userService.deleteExperience(id);
      setExperiences(prev => prev.filter(exp => exp.id !== id));
      toast({
        title: "Succès",
        description: "Expérience supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de l'expérience",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Formations
  const addEducation = async (data: CreateEducationDto) => {
    try {
      const newEdu = await userService.addEducation(data);
      setEducations(prev => [newEdu, ...prev]);
      toast({
        title: "Succès",
        description: "Formation ajoutée avec succès",
      });
      return newEdu;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la formation",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateEducation = async (id: number, data: CreateEducationDto) => {
    try {
      const updated = await userService.updateEducation(id, data);
      setEducations(prev => prev.map(edu => edu.id === id ? updated : edu));
      toast({
        title: "Succès",
        description: "Formation mise à jour avec succès",
      });
      return updated;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la mise à jour de la formation",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteEducation = async (id: number) => {
    try {
      await userService.deleteEducation(id);
      setEducations(prev => prev.filter(edu => edu.id !== id));
      toast({
        title: "Succès",
        description: "Formation supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de la formation",
        variant: "destructive",
      });
      throw err;
    }
  };

  // Compétences
  const addSkill = async (skillId: number, skillType: string = 'primary', proficiency: number = 3) => {
    try {
      const result = await userService.addSkill(skillId, skillType, proficiency);
      await loadProfile(); // Recharger pour avoir la compétence avec les détails
      toast({
        title: "Succès",
        description: "Compétence ajoutée avec succès",
      });
      return result;
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de l'ajout de la compétence",
        variant: "destructive",
      });
      throw err;
    }
  };

  const removeSkill = async (skillId: number) => {
    try {
      await userService.removeSkill(skillId);
      setSkills(prev => prev.filter(s => s.id !== skillId));
      toast({
        title: "Succès",
        description: "Compétence supprimée avec succès",
      });
    } catch (err) {
      toast({
        title: "Erreur",
        description: "Échec de la suppression de la compétence",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    profile,
    experiences,
    educations,
    skills,
    loading,
    error,
    loadProfile,
    updateProfile,
    addExperience,
    updateExperience,
    deleteExperience,
    addEducation,
    updateEducation,
    deleteEducation,
    addSkill,
    removeSkill
  };
};
