'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArmyMember } from '@/types/database';
import { User, Bot } from 'lucide-react';

interface ArmyMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (member: Partial<ArmyMember>) => void;
  member?: ArmyMember | null;
}

const defaultMember: Partial<ArmyMember> = {
  name: '',
  position: '',
  hourly_rate: 0,
  type: 'human',
  photo_url: '',
  model: '',
  emoji: '',
  contract_type: '',
  status: 'offline'
};

export default function ArmyMemberModal({ isOpen, onClose, onSave, member }: ArmyMemberModalProps) {
  const [formData, setFormData] = useState<Partial<ArmyMember>>(defaultMember);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (member) {
      setFormData(member);
    } else {
      setFormData(defaultMember);
    }
  }, [member]);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFieldChange = (field: keyof ArmyMember, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-imperial-navy border-imperial-gold/30">
        <DialogHeader>
          <DialogTitle className="text-imperial-gold font-imperial">
            {member ? 'Modifier' : 'Ajouter'} un membre
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Type */}
          <div>
            <Label className="text-foreground">Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: 'human' | 'agent') => handleFieldChange('type', value)}
            >
              <SelectTrigger className="bg-imperial-night border-border/30">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="human">
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Humain
                  </div>
                </SelectItem>
                <SelectItem value="agent">
                  <div className="flex items-center">
                    <Bot className="h-4 w-4 mr-2" />
                    Agent
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Nom */}
          <div>
            <Label className="text-foreground">Nom</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleFieldChange('name', e.target.value)}
              className="bg-imperial-night border-border/30"
              placeholder="Nom du membre"
            />
          </div>

          {/* Poste */}
          <div>
            <Label className="text-foreground">Poste</Label>
            <Input
              value={formData.position}
              onChange={(e) => handleFieldChange('position', e.target.value)}
              className="bg-imperial-night border-border/30"
              placeholder="Poste occupé"
            />
          </div>

          {/* Tarif horaire */}
          <div>
            <Label className="text-foreground">Tarif horaire (€/h)</Label>
            <Input
              type="number"
              value={formData.hourly_rate}
              onChange={(e) => handleFieldChange('hourly_rate', parseFloat(e.target.value) || 0)}
              className="bg-imperial-night border-border/30"
              placeholder="0"
            />
          </div>

          {/* URL Photo */}
          <div>
            <Label className="text-foreground">URL Photo</Label>
            <Input
              value={formData.photo_url}
              onChange={(e) => handleFieldChange('photo_url', e.target.value)}
              className="bg-imperial-night border-border/30"
              placeholder="https://..."
            />
          </div>

          {/* Emoji */}
          <div>
            <Label className="text-foreground">Emoji</Label>
            <Input
              value={formData.emoji}
              onChange={(e) => handleFieldChange('emoji', e.target.value)}
              className="bg-imperial-night border-border/30"
              placeholder="👨‍💼"
              maxLength={2}
            />
          </div>

          {/* Champs spécifiques aux humains */}
          {formData.type === 'human' && (
            <div>
              <Label className="text-foreground">Type de contrat</Label>
              <Select
                value={formData.contract_type}
                onValueChange={(value) => handleFieldChange('contract_type', value)}
              >
                <SelectTrigger className="bg-imperial-night border-border/30">
                  <SelectValue placeholder="Sélectionner..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CDI">CDI</SelectItem>
                  <SelectItem value="Freelance">Freelance</SelectItem>
                  <SelectItem value="CDD">CDD</SelectItem>
                  <SelectItem value="Stage">Stage</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Champs spécifiques aux agents */}
          {formData.type === 'agent' && (
            <>
              <div>
                <Label className="text-foreground">Modèle IA</Label>
                <Select
                  value={formData.model}
                  onValueChange={(value) => handleFieldChange('model', value)}
                >
                  <SelectTrigger className="bg-imperial-night border-border/30">
                    <SelectValue placeholder="Sélectionner..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sonnet 4">Sonnet 4</SelectItem>
                    <SelectItem value="Opus 4">Opus 4</SelectItem>
                    <SelectItem value="Haiku 4">Haiku 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-foreground">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value: 'online' | 'offline' | 'busy') => handleFieldChange('status', value)}
                >
                  <SelectTrigger className="bg-imperial-night border-border/30">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="online">En service</SelectItem>
                    <SelectItem value="busy">Occupé</SelectItem>
                    <SelectItem value="offline">Hors service</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isLoading}
            className="bg-imperial-gold text-imperial-night hover:bg-imperial-gold/90"
          >
            {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}