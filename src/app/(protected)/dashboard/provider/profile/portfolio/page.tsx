// app/(dashboard)/provider/profile/portfolio/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@iconify/react";
import { Button } from "@/app/components/ui/button";
import { Card } from "@/app/components/ui/card";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { Textarea } from "@/app/components/ui/textarea";
import { Badge } from "@/app/components/ui/badge";
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

// Types
interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  category: string;
  image_url?: string;
  project_url?: string;
  technologies: string[];
  completion_date: string;
  is_featured: boolean;
}

// Composant pour la carte du portfolio
function PortfolioCard({ item, onEdit, onDelete }: { item: PortfolioItem; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="group bg-surface dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all">
      {/* Image placeholder */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
        {item.image_url ? (
          <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
        ) : (
          <Icon icon="ph:image" className="w-12 h-12 text-primary/40" />
        )}
        {item.is_featured && (
          <Badge className="absolute top-3 right-3 bg-amber-500 text-white border-0">
            <Icon icon="ph:star-fill" className="w-3 h-3 mr-1" />
            À la une
          </Badge>
        )}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          <button onClick={onEdit} className="p-2 bg-white rounded-full hover:bg-gray-100">
            <Icon icon="ph:pencil" className="w-4 h-4 text-primary" />
          </button>
          <button onClick={onDelete} className="p-2 bg-white rounded-full hover:bg-red-100">
            <Icon icon="ph:trash" className="w-4 h-4 text-red-500" />
          </button>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-text-primary dark:text-gray-100 mb-1">{item.title}</h3>
        <p className="text-sm text-text-secondary line-clamp-2 mb-3">{item.description}</p>
        <div className="flex flex-wrap gap-1 mb-3">
          {item.technologies.slice(0, 3).map((tech) => (
            <span key={tech} className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-text-secondary">
              {tech}
            </span>
          ))}
          {item.technologies.length > 3 && (
            <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-text-secondary">
              +{item.technologies.length - 3}
            </span>
          )}
        </div>
        <div className="flex justify-between items-center text-xs text-text-secondary">
          <span>{item.category}</span>
          <span>{new Date(item.completion_date).getFullYear()}</span>
        </div>
      </div>
    </div>
  );
}

// Composant pour les vignettes (view mode)
function PortfolioGrid({ items, onEdit, onDelete }: { items: PortfolioItem[]; onEdit: (item: PortfolioItem) => void; onDelete: (id: number) => void }) {
  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {items.map((item) => (
        <PortfolioCard
          key={item.id}
          item={item}
          onEdit={() => onEdit(item)}
          onDelete={() => onDelete(item.id)}
        />
      ))}
    </div>
  );
}

export default function PortfolioPage() {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<PortfolioItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    project_url: "",
    technologies: "",
    completion_date: "",
    is_featured: false,
  });

  // Données mockées (à remplacer par vos appels API)
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([
    {
      id: 1,
      title: "E-commerce Fashion",
      description: "Plateforme e-commerce complète avec panier, paiement sécurisé et tableau de bord admin. Interface responsive et moderne.",
      category: "Développement Web",
      technologies: ["React", "Next.js", "TailwindCSS", "Stripe"],
      completion_date: "2024-02-15",
      is_featured: true,
    },
    {
      id: 2,
      title: "Application de livraison",
      description: "Application mobile pour les livreurs avec suivi GPS en temps réel, notifications push et gestion des commandes.",
      category: "Mobile",
      technologies: ["React Native", "Node.js", "MongoDB", "Socket.io"],
      completion_date: "2024-01-20",
      is_featured: false,
    },
    {
      id: 3,
      title: "Dashboard Analytics",
      description: "Tableau de bord interactif pour la visualisation de données avec graphiques personnalisables.",
      category: "Data Visualisation",
      technologies: ["Vue.js", "D3.js", "Express", "PostgreSQL"],
      completion_date: "2023-12-10",
      is_featured: false,
    },
    {
      id: 4,
      title: "Site vitrine Restaurant",
      description: "Site vitrine moderne pour un restaurant avec réservation en ligne et galerie photo.",
      category: "Site Web",
      technologies: ["WordPress", "PHP", "jQuery", "MySQL"],
      completion_date: "2023-11-05",
      is_featured: false,
    },
  ]);

  const categories = ["Tous", "Développement Web", "Mobile", "Design", "Data Visualisation", "Site Web", "Autre"];

  const filteredItems = selectedCategory === "all" 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  const handleAdd = () => {
    setEditingItem(null);
    setFormData({
      title: "",
      description: "",
      category: "",
      project_url: "",
      technologies: "",
      completion_date: "",
      is_featured: false,
    });
    setModalOpen(true);
  };

  const handleEdit = (item: PortfolioItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      project_url: item.project_url || "",
      technologies: item.technologies.join(", "),
      completion_date: item.completion_date,
      is_featured: item.is_featured,
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce projet ?")) {
      setPortfolioItems(portfolioItems.filter(item => item.id !== id));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newItem: PortfolioItem = {
      id: editingItem ? editingItem.id : Date.now(),
      title: formData.title,
      description: formData.description,
      category: formData.category,
      project_url: formData.project_url,
      technologies: formData.technologies.split(",").map(t => t.trim()).filter(t => t),
      completion_date: formData.completion_date,
      is_featured: formData.is_featured,
    };

    if (editingItem) {
      setPortfolioItems(portfolioItems.map(item => item.id === editingItem.id ? newItem : item));
    } else {
      setPortfolioItems([newItem, ...portfolioItems]);
    }
    
    setModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            <Icon icon="ph:arrow-left" className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-text-primary dark:text-gray-100">
              Mon portfolio
            </h1>
            <p className="text-text-secondary dark:text-gray-400">
              Présentez vos meilleurs projets et réalisations
            </p>
          </div>
          <Button onClick={handleAdd} className="rounded-full">
            <Icon icon="ph:plus" className="w-4 h-4 mr-2" />
            Ajouter un projet
          </Button>
        </div>

        {/* Filtres */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat === "Tous" ? "all" : cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                (cat === "Tous" && selectedCategory === "all") || selectedCategory === cat
                  ? "bg-primary text-white shadow-md"
                  : "bg-gray-100 dark:bg-gray-800 text-text-secondary hover:bg-gray-200 dark:hover:bg-gray-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grille des projets */}
        {filteredItems.length === 0 ? (
          <Card className="rounded-2xl p-12 text-center">
            <Icon icon="ph:images" className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucun projet dans votre portfolio</h3>
            <p className="text-text-secondary mb-4">Ajoutez vos premières réalisations pour attirer plus de clients.</p>
            <Button onClick={handleAdd} variant="outline" className="rounded-full">
              <Icon icon="ph:plus" className="w-4 h-4 mr-2" />
              Ajouter un projet
            </Button>
          </Card>
        ) : (
          <PortfolioGrid items={filteredItems} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {/* Message si aucun projet dans la catégorie */}
        {filteredItems.length === 0 && portfolioItems.length > 0 && (
          <Card className="rounded-2xl p-12 text-center">
            <Icon icon="ph:funnel" className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-text-secondary">Aucun projet dans cette catégorie</p>
          </Card>
        )}

        {/* Bouton retour */}
        <div className="mt-8 flex justify-end">
          <Button variant="outline" onClick={() => router.push("/dashboard/provider/profile")} className="rounded-full">
            Retour au profil
          </Button>
        </div>
      </div>

      {/* Modal Ajouter/Modifier */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-[550px] max-h-[90vh] overflow-y-auto dark:bg-gray-800">
          <DialogHeader>
            <DialogTitle>{editingItem ? "Modifier le projet" : "Ajouter un projet"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Titre du projet *</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Ex: Application de livraison"
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Catégorie *</Label>
              <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Sélectionnez une catégorie" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Développement Web">Développement Web</SelectItem>
                  <SelectItem value="Mobile">Mobile</SelectItem>
                  <SelectItem value="Design">Design</SelectItem>
                  <SelectItem value="Data Visualisation">Data Visualisation</SelectItem>
                  <SelectItem value="Site Web">Site Web</SelectItem>
                  <SelectItem value="Autre">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Décrivez votre projet, vos réalisations et les technologies utilisées..."
                rows={4}
                required
                className="mt-1"
              />
            </div>

            <div>
              <Label>Technologies utilisées</Label>
              <Input
                value={formData.technologies}
                onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                placeholder="React, Node.js, MongoDB (séparés par des virgules)"
                className="mt-1"
              />
              <p className="text-xs text-text-secondary mt-1">Séparez chaque technologie par une virgule</p>
            </div>

            <div>
              <Label>URL du projet (optionnel)</Label>
              <Input
                value={formData.project_url}
                onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                placeholder="https://..."
                type="url"
                className="mt-1"
              />
            </div>

            <div>
              <Label>Date de réalisation *</Label>
              <Input
                type="date"
                value={formData.completion_date}
                onChange={(e) => setFormData({ ...formData, completion_date: e.target.value })}
                required
                className="mt-1"
              />
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="is_featured"
                checked={formData.is_featured}
                onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              <Label htmlFor="is_featured" className="cursor-pointer">
                Mettre ce projet en avant (apparaîtra en tête de liste)
              </Label>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setModalOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" className="bg-primary">
                {editingItem ? "Modifier" : "Ajouter"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}