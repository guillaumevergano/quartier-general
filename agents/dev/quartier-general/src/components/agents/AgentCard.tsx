import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Agent, AgentStats } from '@/types/database';
import { getStatusColor, getGradeIcon, formatCurrency, formatNumber } from '@/lib/utils';
import { Activity, DollarSign, MessageSquare, Clock } from 'lucide-react';

interface AgentCardProps {
  agent: Agent;
  stats?: AgentStats;
}

export default function AgentCard({ agent, stats }: AgentCardProps) {
  return (
    <Card className="card-imperial hover:border-imperial-gold/50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Avatar className="h-12 w-12">
              <AvatarImage src={agent.avatar_url} alt={agent.name} />
              <AvatarFallback className="bg-imperial-gold text-imperial-night font-bold">
                {agent.name.substring(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div 
              className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background ${getStatusColor(agent.status)}`}
            />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-imperial font-bold text-imperial-gold">
                {agent.name}
              </h3>
              <div className="text-lg">
                {getGradeIcon(agent.grade)}
              </div>
            </div>
            <p className="text-sm text-muted-foreground font-cinzel">
              {agent.title}
            </p>
            <div className="flex items-center space-x-2 mt-1">
              <Badge 
                variant="secondary"
                className="text-xs bg-imperial-navy text-parchment-cream"
              >
                {agent.grade}
              </Badge>
              <Badge 
                variant="outline"
                className={`text-xs ${
                  agent.status === 'online' ? 'text-green-400 border-green-500' :
                  agent.status === 'busy' ? 'text-yellow-400 border-yellow-500' :
                  'text-gray-400 border-gray-500'
                }`}
              >
                {agent.status === 'online' ? 'En service' :
                 agent.status === 'busy' ? 'Occupé' : 'Hors service'}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Model Info */}
        <div className="p-3 rounded-lg bg-imperial-night/30">
          <div className="text-xs text-muted-foreground font-cinzel mb-1">
            Modèle d&apos;Intelligence
          </div>
          <div className="text-sm font-medium text-foreground">
            {agent.model}
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Workspace: {agent.workspace}
          </div>
        </div>

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <MessageSquare className="h-4 w-4 text-imperial-gold" />
              </div>
              <div className="text-lg font-bold font-mono text-imperial-gold">
                {formatNumber(stats.messageCount)}
              </div>
              <div className="text-xs text-muted-foreground">
                Messages
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-1">
                <DollarSign className="h-4 w-4 text-imperial-gold" />
              </div>
              <div className="text-lg font-bold font-mono text-imperial-gold">
                {formatCurrency(stats.cost)}
              </div>
              <div className="text-xs text-muted-foreground">
                Coût
              </div>
            </div>
          </div>
        )}

        {/* Channels */}
        {agent.channels && Object.keys(agent.channels).length > 0 && (
          <div>
            <div className="text-xs text-muted-foreground font-cinzel mb-2">
              Canaux Connectés
            </div>
            <div className="flex flex-wrap gap-1">
              {Object.keys(agent.channels).map((channel) => (
                <Badge 
                  key={channel}
                  variant="outline" 
                  className="text-xs"
                >
                  {channel}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2 border-t border-border/30">
          <button className="flex-1 px-3 py-1.5 text-xs bg-imperial-gold text-imperial-night rounded-md hover:bg-imperial-gold/90 transition-colors font-medium">
            Voir Détails
          </button>
          <button className="flex-1 px-3 py-1.5 text-xs border border-border/50 text-foreground rounded-md hover:bg-imperial-night/50 transition-colors font-medium">
            Historique
          </button>
        </div>
      </CardContent>
    </Card>
  );
}