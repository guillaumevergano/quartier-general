import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface KPICardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    label: string;
    positive?: boolean;
  };
  icon: LucideIcon;
  description?: string;
  className?: string;
}

export default function KPICard({
  title,
  value,
  change,
  icon: Icon,
  description,
  className
}: KPICardProps) {
  return (
    <Card className={cn("card-imperial", className)}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-md bg-imperial-gold/20">
              <Icon className="h-4 w-4 text-imperial-gold" />
            </div>
            <h3 className="text-sm font-medium text-muted-foreground font-garamond">
              {title}
            </h3>
          </div>
          {change && (
            <Badge 
              variant={change.positive ? "default" : "secondary"}
              className={cn(
                "text-xs",
                change.positive 
                  ? "bg-green-500/20 text-green-400 border-green-500/30" 
                  : "bg-red-500/20 text-red-400 border-red-500/30"
              )}
            >
              {change.positive ? '+' : ''}{change.value}% {change.label}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-2xl font-imperial font-bold text-imperial-gold">
            {value}
          </div>
          {description && (
            <p className="text-xs text-muted-foreground">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}