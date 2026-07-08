// app/admin/skills/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SkillCreateSchema, SkillCreateFormData, SkillUpdateFormData } from '@/app/lib/validators/skill.validator';
import type { CategoryOut, SkillOut } from '@/app/types';
import { SkillType } from '@/app/types/enums';
import { useAdminSkills } from '@/app/hooks/admin/use-admin-skills';
import { useAdminCategories } from '@/app/hooks/services/use-categories';
import { Dialog, DialogContent, DialogFooter } from '@/app/components/ui/dialog';
import { Button } from '@/app/components/ui/button';
import { Loader2 } from 'lucide-react';

// ==================== MODAL COMPONENT ====================

interface SkillFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: SkillCreateFormData | SkillUpdateFormData) => void;
  initialData?: SkillOut;
  isSubmitting?: boolean;
  categories?: CategoryOut[];
}

export const SkillFormModal: React.FC<SkillFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  isSubmitting = false,
  categories = [],
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SkillCreateFormData>({
    resolver: zodResolver(SkillCreateSchema),
    defaultValues: {
      name: '',
      description: '',
      category: '',
      type: SkillType.TECHNICAL,
      subcategory: '',
      aliases: [],
      keywords: [],
      icon_url: '',
    },
  });

  const [aliasesInput, setAliasesInput] = useState('');
  const [keywordsInput, setKeywordsInput] = useState('');

  useEffect(() => {
    if (initialData) {
      reset({
        name: initialData.name,
        description: initialData.description || '',
        category: initialData.category || '',
        type: initialData.type,
        subcategory: initialData.subcategory || '',
        aliases: initialData.aliases || [],
        keywords: initialData.keywords || [],
        icon_url: initialData.icon_url || '',
      });
      setAliasesInput((initialData.aliases || []).join(', '));
      setKeywordsInput((initialData.keywords || []).join(', '));
    } else {
      reset();
      setAliasesInput('');
      setKeywordsInput('');
    }
  }, [initialData, reset]);

  const onFormSubmit = (data: SkillCreateFormData) => {
    const formattedData = {
      ...data,
      aliases: aliasesInput.split(',').map(a => a.trim()).filter(a => a),
      keywords: keywordsInput.split(',').map(k => k.trim()).filter(k => k),
    };
    onSubmit(formattedData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div>
          <h2 className="text-lg font-medium leading-6 text-gray-900 dark:text-white mb-4">
            {initialData ? 'Modifier la compétence' : 'Créer une compétence'}
          </h2>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          <div className="space-y-4">
            {/* Nom */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Nom *
              </label>
              <input
                type="text"
                {...register('name')}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                {...register('description')}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white sm:text-sm"
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            {/* Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Type
              </label>
              <select
                {...register('type')}
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              >
                <option value="technical">Technique</option>
                <option value="professional">Professionnel</option>
                <option value="language">Langue</option>
                <option value="soft">Soft Skill</option>
                <option value="tool">Outil</option>
              </select>

              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            {/* Alias */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Alias (séparés par des virgules)
              </label>
              <input
                type="text"
                value={aliasesInput}
                onChange={(e) => setAliasesInput(e.target.value)}
                placeholder="ex: JS, JavaScript, ECMAScript"
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
              {errors.aliases && (
                <p className="mt-1 text-sm text-red-600">{errors.aliases.message}</p>
              )}
            </div>

            {/* Mots-clés */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Mots-clés (séparés par des virgules)
              </label>
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="ex: frontend, web, development"
                className="pl-10 w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
              />
              {errors.keywords && (
                <p className="mt-1 text-sm text-red-600">{errors.keywords.message}</p>
              )}
            </div>
          </div>

          {/* List all errors */}
          {Object.keys(errors).length > 0 && (
            <div className="mt-4 p-4 bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300">
              <p className="font-medium">Veuillez corriger les erreurs suivantes :</p>
              <ul className="list-disc list-inside mt-2">
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error.message}</li>
                ))}
              </ul>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button 
              variant="outline" 
              onClick={onClose} 
              disabled={isSubmitting}
              type="button"
            >
              Annuler
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {initialData ? 'Mise à jour...' : 'Création...'}
                </>
              ) : (
                initialData ? 'Mettre à jour' : 'Créer'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// ==================== MAIN PAGE ====================

export default function AdminSkillsPage() {
  const {
    skills,
    isLoading,
    createSkill,
    updateSkill,
    deleteSkill,
    isCreating,
    isUpdating,
  } = useAdminSkills();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<SkillOut | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (skill.description?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || skill.category === selectedCategory;
    const matchesType = !selectedType || skill.type === selectedType;
    return matchesSearch && matchesCategory && matchesType;
  });

  const handleCreate = () => {
    setEditingSkill(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (skill: SkillOut) => {
    setEditingSkill(skill);
    setIsModalOpen(true);
  };

  const handleDelete = async (skillId: number, skillName: string) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer la compétence "${skillName}" ?`)) {
      await deleteSkill(skillId);
    }
  };

  const handleSubmit = async (data: SkillCreateFormData | SkillUpdateFormData) => {
    if (editingSkill) {
      await updateSkill({ id: editingSkill.id, data });
    } else {
      await createSkill(data);
    }
    setIsModalOpen(false);
    setEditingSkill(undefined);
  };

  const getTypeBadgeColor = (type: SkillType) => {
    switch (type) {
      case SkillType.TECHNICAL:
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case SkillType.SOFT:
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case SkillType.LANGUAGE:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-gray-500">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Gestion des compétences
        </h1>
        <button
          onClick={handleCreate}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          + Nouvelle compétence
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        />
        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
        >
          <option value="">Tous les types</option>
          <option value={SkillType.TECHNICAL}>Technique</option>
          <option value={SkillType.SOFT}>Soft Skill</option>
          <option value={SkillType.LANGUAGE}>Langue</option>
        </select>
      </div>

      {/* Stats */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Total</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{skills.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Filtrés</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">{filteredSkills.length}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">Utilisation totale</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {skills.reduce((sum, s) => sum + (s.usage_count || 0), 0)}
          </div>
        </div>
      </div>

      {/* Skills Table */}
      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-md">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Nom
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Catégorie
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Utilisations
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredSkills.map((skill) => (
              <tr key={skill.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {skill.name}
                  </div>
                  {skill.description && (
                    <div className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-md">
                      {skill.description}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 dark:text-white">
                    {skill.category || '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getTypeBadgeColor(skill.type)}`}>
                    {skill.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {skill.usage_count || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(skill)}
                    className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 mr-3"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(skill.id, skill.name)}
                    className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSkills.length === 0 && (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            Aucune compétence trouvée
          </div>
        )}
      </div>

      {/* Modal */}
      <SkillFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingSkill(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={editingSkill}
        isSubmitting={isCreating || isUpdating}
      />
    </div>
  );
}
