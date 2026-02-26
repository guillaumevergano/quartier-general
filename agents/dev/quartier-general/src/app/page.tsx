import { MessageSquare, DollarSign, Activity, Clock } from 'lucide-react';
import KPICard from '@/components/layout/KPICard';
import ActivityChart from '@/components/charts/ActivityChart';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

// Données de démonstration
const mockKPIs = {
  messagesTotal: 1247,
  costTotal: 12.3456,
  actionsTotal: 2890,
  avgResponseTime: 1850 // en ms
};

const mockActivityData = [
  { date: '18/02', Berthier: 45, Murat: 32, Davout: 28, Vauban: 15 },
  { date: '19/02', Berthier: 52, Murat: 41, Davout: 35, Vauban: 22 },
  { date: '20/02', Berthier: 48, Murat: 38, Davout: 42, Vauban: 18 },
  { date: '21/02', Berthier: 61, Murat: 45, Davout: 38, Vauban: 25 },
  { date: '22/02', Berthier: 55, Murat: 42, Davout: 41, Vauban: 28 },
  { date: '23/02', Berthier: 67, Murat: 38, Davout: 45, Vauban: 31 },
  { date: '24/02', Berthier: 72, Murat: 49, Davout: 52, Vauban: 35 }
];

const mockRecentActions = [
  {
    id: '1',
    agent: 'Berthier',
    action: 'Message envoyé sur Discord',
    time: 'il y a 2min',
    cost: 0.0023,
    status: 'success' as const
  },
  {
    id: '2',
    agent: 'Murat',
    action: 'Commande exec réussie',
    time: 'il y a 5min',
    cost: 0.0156,
    status: 'success' as const
  },
  {
    id: '3',
    agent: 'Davout',
    action: 'Erreur d\'authentification',
    time: 'il y a 8min',
    cost: 0.0012,
    status: 'error' as const
  },
  {
    id: '4',
    agent: 'Vauban',
    action: 'Repository créé sur GitHub',
    time: 'il y a 12min',
    cost: 0.0089,
    status: 'success' as const
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-imperial font-bold text-imperial-gold">
            Tableau de Campagne
          </h1>
          <p className="text-muted-foreground font-garamond mt-1">
            Vue d&apos;ensemble des opérations en cours — Situation au 24 février 2026
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-muted-foreground font-cinzel">
            Dernière mise à jour
          </div>
          <Badge variant="outline" className="text-imperial-gold border-imperial-gold">
            En temps réel
          </Badge>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Messages Traités"
          value={formatNumber(mockKPIs.messagesTotal)}
          change={{ value: 12, label: '7j', positive: true }}
          icon={MessageSquare}
          description="Total des messages échangés"
        />
        <KPICard
          title="Coût Total"
          value={formatCurrency(mockKPIs.costTotal)}
          change={{ value: 8, label: '7j', positive: false }}
          icon={DollarSign}
          description="Dépenses en tokens IA"
        />
        <KPICard
          title="Actions Exécutées"
          value={formatNumber(mockKPIs.actionsTotal)}
          change={{ value: 15, label: '7j', positive: true }}
          icon={Activity}
          description="Commandes et opérations"
        />
        <KPICard
          title="Temps de Réponse"
          value={`${(mockKPIs.avgResponseTime / 1000).toFixed(1)}s`}
          change={{ value: 5, label: '7j', positive: false }}
          icon={Clock}
          description="Moyenne de réactivité"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityChart
          data={mockActivityData}
          title="Activité sur 7 jours"
          type="area"
        />

        {/* Recent Actions */}
        <Card className="card-imperial">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-imperial font-semibold text-imperial-gold">
                Dernières Actions
              </h3>
              <div className="text-xs text-muted-foreground font-cinzel">
                En Temps Réel
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockRecentActions.map((action) => (
                <div key={action.id} className="flex items-center justify-between p-3 rounded-lg bg-imperial-night/50">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <Badge
                        variant="outline"
                        className="text-xs font-cinzel"
                      >
                        {action.agent}
                      </Badge>
                      <div className={`w-2 h-2 rounded-full ${
                        action.status === 'success' ? 'bg-green-500' : 'bg-red-500'
                      }`} />
                    </div>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {action.action}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {action.time}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-mono text-imperial-gold">
                      {formatCurrency(action.cost)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Overview */}
      <Card className="card-imperial">
        <CardHeader>
          <h3 className="text-lg font-imperial font-semibold text-imperial-gold">
            État des Maréchaux
          </h3>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Berthier', title: 'Chef d\'état-major', status: 'online', model: 'Claude Opus', messages: 182 },
              { name: 'Murat', title: 'Cavalerie', status: 'busy', model: 'Claude Sonnet', messages: 94 },
              { name: 'Davout', title: 'Logistique', status: 'online', model: 'Claude Sonnet', messages: 67 },
              { name: 'Vauban', title: 'Fortifications', status: 'online', model: 'Claude Sonnet', messages: 45 }
            ].map((agent) => (
              <div key={agent.name} className="p-4 rounded-lg bg-imperial-night/30 border border-border/20">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-imperial font-semibold text-foreground">
                    {agent.name}
                  </h4>
                  <div className={`w-3 h-3 rounded-full ${
                    agent.status === 'online' ? 'bg-green-500' :
                    agent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                </div>
                <p className="text-xs text-muted-foreground font-cinzel mb-2">
                  {agent.title}
                </p>
                <div className="space-y-1">
                  <div className="text-xs text-muted-foreground">
                    Modèle: {agent.model}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Messages: {agent.messages} aujourd&apos;hui
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}