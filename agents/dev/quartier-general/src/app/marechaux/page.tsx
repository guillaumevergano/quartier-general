'use client';

import { Crown, Users, Activity, BarChart3, Plus } from 'lucide-react';
import ArmyMemberCard from '@/components/army/ArmyMemberCard';
import ArmyMemberModal from '@/components/army/ArmyMemberModal';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArmyMember } from '@/types/database';
import { useState } from 'react';

// Données Mollien - Interface unifiée agents + humains
const armyMembers: ArmyMember[] = [
  // ÉQUIPE HUMAINE
  {
    id: 'guillaume',
    name: 'Guillaume',
    position: 'Directeur',
    hourly_rate: 120,
    type: 'human',
    photo_url: '/avatars/guillaume.jpg',
    emoji: '👨‍💼',
    contract_type: 'CDI'
  },
  {
    id: 'marie',
    name: 'Marie',
    position: 'DA',
    hourly_rate: 85,
    type: 'human',
    photo_url: '/avatars/marie.jpg',
    emoji: '🎨',
    contract_type: 'CDI'
  },
  {
    id: 'leana',
    name: 'Léana',
    position: 'UX/UI',
    hourly_rate: 75,
    type: 'human',
    photo_url: '/avatars/leana.jpg',
    emoji: '✏️',
    contract_type: 'Freelance'
  },
  {
    id: 'emilie',
    name: 'Emilie',
    position: 'Graphiste',
    hourly_rate: 65,
    type: 'human',
    photo_url: '/avatars/emilie.jpg',
    emoji: '🎭',
    contract_type: 'CDI'
  },
  {
    id: 'roland',
    name: 'Roland',
    position: 'Dev',
    hourly_rate: 80,
    type: 'human',
    photo_url: '/avatars/roland.jpg',
    emoji: '💻',
    contract_type: 'CDI'
  },
  
  // AGENTS
  {
    id: 'berthier',
    name: 'Berthier',
    position: 'Chef d\'état-major',
    hourly_rate: 18,
    type: 'agent',
    photo_url: '/avatars/berthier.jpg',
    emoji: '⭐',
    model: 'Sonnet 4',
    status: 'online'
  },
  {
    id: 'murat',
    name: 'Murat',
    position: 'Éclaireur',
    hourly_rate: 12,
    type: 'agent',
    photo_url: '/avatars/murat.jpg',
    emoji: '🔍',
    model: 'Sonnet 4',
    status: 'busy'
  },
  {
    id: 'davout',
    name: 'Davout',
    position: 'Gestionnaire',
    hourly_rate: 15,
    type: 'agent',
    photo_url: '/avatars/davout.jpg',
    emoji: '📊',
    model: 'Sonnet 4',
    status: 'online'
  },
  {
    id: 'vauban',
    name: 'Vauban',
    position: 'Ingénieur',
    hourly_rate: 40,
    type: 'agent',
    photo_url: '/avatars/vauban.jpg',
    emoji: '🏗️',
    model: 'Opus 4',
    status: 'online'
  },
  {
    id: 'mollien',
    name: 'Mollien',
    position: 'Trésorier',
    hourly_rate: 12,
    type: 'agent',
    photo_url: '/avatars/mollien.jpg',
    emoji: '💰',
    model: 'Sonnet 4',
    status: 'online'
  }
];

export default function ArmeePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<ArmyMember | null>(null);
  const [members, setMembers] = useState<ArmyMember[]>(armyMembers);
  
  const totalMembers = members.length;
  const humanMembers = members.filter(member => member.type === 'human').length;
  const agentMembers = members.filter(member => member.type === 'agent').length;
  const onlineAgents = members.filter(member => member.type === 'agent' && member.status === 'online').length;
  const totalCost = members.reduce((sum, member) => sum + member.hourly_rate, 0);

  const handleEdit = (member: ArmyMember) => {
    setEditingMember(member);
    setIsModalOpen(true);
  };

  const handleAdd = () => {
    setEditingMember(null);
    setIsModalOpen(true);
  };

  const handleSave = async (memberData: Partial<ArmyMember>) => {
    if (editingMember) {
      // Mise à jour
      setMembers(prev => prev.map(m => 
        m.id === editingMember.id ? { ...m, ...memberData } : m
      ));
    } else {
      // Ajout
      const newMember: ArmyMember = {
        id: Date.now().toString(),
        ...memberData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as ArmyMember;
      setMembers(prev => [...prev, newMember]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-imperial font-bold text-imperial-gold">
            Armée du Contingent
          </h1>
          <p className="text-muted-foreground font-garamond mt-1">
            Interface unifiée agents IA + équipe humaine — Forces complètes de l&apos;organisation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="outline" className="text-imperial-gold border-imperial-gold">
            <Crown className="h-3 w-3 mr-1" />
            {totalMembers} Membres
          </Badge>
          <Badge variant="outline" className="text-blue-400 border-blue-500">
            {humanMembers} Humains
          </Badge>
          <Badge variant="outline" className="text-green-400 border-green-500">
            {agentMembers} Agents
          </Badge>
          <Button 
            onClick={handleAdd}
            className="bg-imperial-gold text-imperial-night hover:bg-imperial-gold/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="card-imperial">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-md bg-imperial-gold/20">
                <Users className="h-5 w-5 text-imperial-gold" />
              </div>
              <div>
                <p className="text-2xl font-bold text-imperial-gold">{totalMembers}</p>
                <p className="text-sm text-muted-foreground">Total Membres</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-imperial">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-md bg-blue-500/20">
                <Users className="h-5 w-5 text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-400">{humanMembers}</p>
                <p className="text-sm text-muted-foreground">Équipe Humaine</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-imperial">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-md bg-green-500/20">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-400">{onlineAgents}</p>
                <p className="text-sm text-muted-foreground">Agents En Service</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="card-imperial">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-md bg-yellow-500/20">
                <BarChart3 className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-400">{totalCost}€/h</p>
                <p className="text-sm text-muted-foreground">Coût Horaire Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Army Members Grid */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-imperial font-semibold text-foreground">
            Membres de l&apos;Armée
          </h2>
          <div className="text-xs text-muted-foreground font-cinzel">
            Interface unifiée humains + agents
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <ArmyMemberCard
              key={member.id}
              member={member}
              onEdit={handleEdit}
            />
          ))}
        </div>
      </div>

      {/* Modal d'édition */}
      <ArmyMemberModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        member={editingMember}
      />
    </div>
  );
}