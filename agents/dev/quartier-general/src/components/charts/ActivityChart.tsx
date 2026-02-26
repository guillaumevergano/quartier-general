'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts';
import { ChartData } from '@/types/database';

interface ActivityChartProps {
  data: ChartData[];
  title: string;
  type?: 'line' | 'area';
}

export default function ActivityChart({ 
  data, 
  title, 
  type = 'area' 
}: ActivityChartProps) {
  // Couleurs pour les différents agents
  const agentColors: Record<string, string> = {
    'Berthier': '#C9A84C', // Or impérial
    'Murat': '#8B2232',    // Rouge napoléonien
    'Davout': '#2D6A4F',   // Vert
    'Vauban': '#6366F1'    // Indigo
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-imperial-navy border border-border/50 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-foreground mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-xs">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.dataKey}:</span>
              <span className="text-foreground font-medium">{entry.value}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  // Extraire les clés des agents (tout sauf 'date')
  const agentKeys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'date')
    : [];

  return (
    <Card className="card-imperial">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-imperial font-semibold text-imperial-gold">
            {title}
          </h3>
          <div className="text-xs text-muted-foreground font-cinzel">
            Activité des Maréchaux
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {type === 'area' ? (
              <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {agentKeys.map((agent, index) => (
                  <Area
                    key={agent}
                    type="monotone"
                    dataKey={agent}
                    stackId="1"
                    stroke={agentColors[agent] || `hsl(${index * 60}, 70%, 50%)`}
                    fill={agentColors[agent] || `hsl(${index * 60}, 70%, 50%)`}
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                ))}
              </AreaChart>
            ) : (
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3} 
                />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                {agentKeys.map((agent, index) => (
                  <Line
                    key={agent}
                    type="monotone"
                    dataKey={agent}
                    stroke={agentColors[agent] || `hsl(${index * 60}, 70%, 50%)`}
                    strokeWidth={2}
                    dot={{ fill: agentColors[agent] || `hsl(${index * 60}, 70%, 50%)`, strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>

        {/* Légende */}
        <div className="flex flex-wrap gap-4 mt-4 pt-4 border-t border-border/30">
          {agentKeys.map((agent, index) => (
            <div key={agent} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full" 
                style={{ backgroundColor: agentColors[agent] || `hsl(${index * 60}, 70%, 50%)` }}
              />
              <span className="text-xs text-muted-foreground">{agent}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}