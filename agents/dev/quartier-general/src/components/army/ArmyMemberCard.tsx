import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArmyMember } from '@/types/database';
import { Edit, User, Bot } from 'lucide-react';

interface ArmyMemberCardProps {
  member: ArmyMember;
  onEdit: (member: ArmyMember) => void;
}

export default function ArmyMemberCard({ member, onEdit }: ArmyMemberCardProps) {
  const isAgent = member.type === 'agent';
  const statusColor = member.status === 'online' ? 'bg-green-500' :
                      member.status === 'busy' ? 'bg-yellow-500' : 
                      member.status === 'offline' ? 'bg-gray-500' : 'bg-gray-400';

  return (
    <Card className="card-imperial hover:border-imperial-gold/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={member.photo_url} alt={member.name} />
              <AvatarFallback className={`font-bold ${
                isAgent ? 'bg-blue-500/20 text-blue-400' : 'bg-imperial-gold text-imperial-night'
              }`}>
                {member.emoji || member.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {/* Status pour les agents seulement */}
            {isAgent && member.status && (
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${statusColor}`} />
            )}
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-imperial font-bold text-imperial-gold">
                {member.name}
              </h3>
              <Badge 
                variant={isAgent ? "secondary" : "default"}
                className={`text-xs ${
                  isAgent 
                    ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' 
                    : 'bg-imperial-gold text-imperial-night'
                }`}
              >
                {isAgent ? (
                  <>
                    <Bot className="h-3 w-3 mr-1" />
                    Agent
                  </>
                ) : (
                  <>
                    <User className="h-3 w-3 mr-1" />
                    Humain
                  </>
                )}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-cinzel">
              {member.position}
            </p>
            {member.contract_type && (
              <div className="text-xs text-muted-foreground mt-1">
                {member.contract_type}
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tarif */}
        <div className="p-3 rounded-lg bg-imperial-night/30">
          <div className="text-xs text-muted-foreground font-cinzel mb-1">
            Tarif Horaire
          </div>
          <div className="text-xl font-bold font-mono text-imperial-gold">
            {member.hourly_rate}€/h
          </div>
        </div>

        {/* Informations spécifiques aux agents */}
        {isAgent && member.model && (
          <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
            <div className="text-xs text-blue-400 font-cinzel mb-1">
              Modèle d&apos;Intelligence
            </div>
            <div className="text-sm font-medium text-blue-300">
              {member.model}
            </div>
            {member.status && (
              <div className="text-xs text-blue-400 mt-1">
                Status: {member.status === 'online' ? 'En service' :
                         member.status === 'busy' ? 'Occupé' : 'Hors service'}
              </div>
            )}
          </div>
        )}

        {/* Bouton d'édition */}
        <Button
          onClick={() => onEdit(member)}
          variant="outline"
          size="sm"
          className="w-full border-imperial-gold/30 text-imperial-gold hover:bg-imperial-gold/10"
        >
          <Edit className="h-4 w-4 mr-2" />
          Éditer
        </Button>
      </CardContent>
    </Card>
  );
}