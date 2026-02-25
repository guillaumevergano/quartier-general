"use client";

import { useState, useRef } from "react";
import { Upload, User } from "lucide-react";
import { Agent } from "@/types/database";

interface AvatarUploadProps {
  agent: Agent;
  onAvatarUpdate: (avatarUrl: string) => void;
  disabled?: boolean;
}

export default function AvatarUpload({ agent, onAvatarUpdate, disabled }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await fetch(`/api/agents/${agent.id}/avatar`, {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de l'upload");
      }

      onAvatarUpdate(result.avatarUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur inconnue");
    } finally {
      setUploading(false);
      // Reset input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Avatar actuel */}
      <div className="relative group">
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-imperial-gold/10 border-2 border-imperial-gold/20 flex items-center justify-center">
          {agent.avatar_url ? (
            <img
              src={agent.avatar_url}
              alt={`Avatar de ${agent.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="text-imperial-gold text-xl font-display">
              {getInitials(agent.name)}
            </div>
          )}
        </div>

        {/* Overlay hover */}
        {!disabled && (
          <div className="absolute inset-0 bg-imperial-bg/80 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center"
               onClick={() => fileInputRef.current?.click()}>
            {uploading ? (
              <div className="text-imperial-gold animate-spin">
                <User className="w-6 h-6" />
              </div>
            ) : (
              <Upload className="w-6 h-6 text-imperial-gold" />
            )}
          </div>
        )}
      </div>

      {/* Input fichier caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        disabled={disabled || uploading}
      />

      {/* Bouton upload */}
      {!disabled && (
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="btn-imperial-secondary text-xs px-3 py-1.5 disabled:opacity-50"
        >
          {uploading ? "Upload..." : "Changer avatar"}
        </button>
      )}

      {/* Erreur */}
      {error && (
        <p className="text-imperial-error text-xs text-center">{error}</p>
      )}
    </div>
  );
}