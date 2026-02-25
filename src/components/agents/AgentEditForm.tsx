"use client";

import { useState } from "react";
import { Agent } from "@/types/database";
import { Edit3, Save, X } from "lucide-react";
import AvatarUpload from "./AvatarUpload";

interface AgentEditFormProps {
  agent: Agent;
  onUpdate: (updatedAgent: Partial<Agent>) => void;
}

export default function AgentEditForm({ agent, onUpdate }: AgentEditFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: agent.name,
    title: agent.title || "",
    grade: agent.grade || "",
    description: agent.description || "",
    avatar_url: agent.avatar_url || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la sauvegarde");
      }

      onUpdate(result.agent);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarUpdate = (avatarUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: avatarUrl }));
  };

  if (!isEditing) {
    return (
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditing(true)}
          className="btn-imperial-primary"
        >
          <Edit3 className="w-4 h-4 mr-2" />
          Modifier
        </button>
      </div>
    );
  }

  return (
    <div className="card-imperial">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-xl text-imperial-gold">
          Modifier les informations
        </h3>
        <button
          onClick={() => {
            setIsEditing(false);
            setFormData({
              name: agent.name,
              title: agent.title || "",
              grade: agent.grade || "",
              description: agent.description || "",
              avatar_url: agent.avatar_url || "",
            });
            setError(null);
          }}
          className="btn-imperial-secondary"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex justify-center">
          <AvatarUpload
            agent={{ ...agent, avatar_url: formData.avatar_url }}
            onAvatarUpdate={handleAvatarUpdate}
            disabled={saving}
          />
        </div>

        {/* Nom */}
        <div>
          <label className="block text-sm font-subtitle text-imperial-muted mb-2">
            Nom *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="input-imperial w-full"
            required
            disabled={saving}
          />
        </div>

        {/* Titre */}
        <div>
          <label className="block text-sm font-subtitle text-imperial-muted mb-2">
            Titre
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="input-imperial w-full"
            placeholder="ex: Chef d'état-major"
            disabled={saving}
          />
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-subtitle text-imperial-muted mb-2">
            Grade
          </label>
          <input
            type="text"
            value={formData.grade}
            onChange={(e) => setFormData(prev => ({ ...prev, grade: e.target.value }))}
            className="input-imperial w-full"
            placeholder="ex: Maréchal d'Empire"
            disabled={saving}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-subtitle text-imperial-muted mb-2">
            Description
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            className="input-imperial w-full h-32 resize-none"
            placeholder="Description libre de l'agent..."
            disabled={saving}
          />
        </div>

        {/* Erreur */}
        {error && (
          <div className="text-imperial-error text-sm bg-imperial-error/10 border border-imperial-error/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-imperial-gold/10">
          <button
            type="button"
            onClick={() => setIsEditing(false)}
            className="btn-imperial-secondary"
            disabled={saving}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="btn-imperial-primary"
            disabled={saving}
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Sauvegarde..." : "Sauvegarder"}
          </button>
        </div>
      </form>
    </div>
  );
}