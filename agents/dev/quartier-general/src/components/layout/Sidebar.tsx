'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Crown, 
  ScrollText, 
  Coins, 
  Bell, 
  Settings, 
  BookOpen,
  Menu,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  href: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { icon: BarChart3, label: 'Tableau de Campagne', href: '/' },
  { icon: Crown, label: 'Armée', href: '/marechaux' },
  { icon: ScrollText, label: 'Journal de Campagne', href: '/journal' },
  { icon: Coins, label: 'Trésor de Guerre', href: '/tresor' },
  { icon: Bell, label: 'Dépêches', href: '/depeches', badge: 3 },
  { icon: Settings, label: 'État-Major', href: '/etat-major' },
  { icon: BookOpen, label: 'Aide de Camp', href: '/aide' }
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <aside className={cn(
      'bg-imperial-navy border-r border-border/30 transition-all duration-300 flex flex-col',
      isCollapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-imperial-gradient rounded-full flex items-center justify-center">
                <Crown className="h-4 w-4 text-imperial-night" />
              </div>
              <div>
                <h1 className="font-imperial text-lg font-bold text-imperial-gold">
                  Quartier Général
                </h1>
                <p className="text-xs text-muted-foreground font-cinzel">
                  État-Major OpenClaw
                </p>
              </div>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
          >
            {isCollapsed ? <Menu className="h-4 w-4" /> : <X className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2.5 text-sm font-medium rounded-md transition-colors group',
                    'hover:bg-imperial-gold/10 hover:text-imperial-gold',
                    isActive 
                      ? 'bg-imperial-gold text-imperial-night shadow-md' 
                      : 'text-muted-foreground',
                    isCollapsed && 'justify-center px-2'
                  )}
                >
                  <Icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className="ml-2 bg-imperial-red text-parchment-cream"
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Agent Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-border/30">
          <div className="text-xs text-muted-foreground font-cinzel mb-2">
            État des Maréchaux
          </div>
          <div className="space-y-2">
            {[
              { name: 'Berthier', status: 'online' },
              { name: 'Murat', status: 'busy' },
              { name: 'Davout', status: 'online' },
              { name: 'Vauban', status: 'offline' }
            ].map((agent) => (
              <div key={agent.name} className="flex items-center space-x-2">
                <div className={cn(
                  'w-2 h-2 rounded-full',
                  agent.status === 'online' && 'bg-green-500',
                  agent.status === 'busy' && 'bg-yellow-500',
                  agent.status === 'offline' && 'bg-gray-500'
                )} />
                <span className="text-xs text-muted-foreground">{agent.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="p-4 border-t border-border/30">
        {!isCollapsed && (
          <div className="text-center">
            <div className="text-xs text-muted-foreground font-cinzel">
              Vive l&apos;Empereur !
            </div>
            <div className="text-xs text-imperial-gold mt-1">
              🦅
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}