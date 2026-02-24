"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Shield,
  ScrollText,
  Coins,
  Bell,
  Settings,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Crown,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Tableau de Campagne", href: "/", icon: LayoutDashboard },
  { name: "Les Maréchaux", href: "/marechaux", icon: Shield },
  { name: "Journal de Campagne", href: "/journal", icon: ScrollText },
  { name: "Trésor de Guerre", href: "/tresor", icon: Coins },
  { name: "Dépêches", href: "/depeches", icon: Bell },
  { name: "État-Major", href: "/etat-major", icon: Settings },
  { name: "Aide de Camp", href: "/aide", icon: BookOpen },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "h-screen sticky top-0 flex flex-col bg-imperial-bg-secondary border-r border-imperial-gold/20 transition-all duration-300",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-imperial-gold/20 flex items-center gap-3">
        <Crown className="w-8 h-8 text-imperial-gold flex-shrink-0" />
        {!collapsed && (
          <div>
            <h1 className="font-display text-lg text-imperial-gold leading-tight">
              Quartier Général
            </h1>
            <p className="text-xs text-imperial-muted font-subtitle">
              Centre de Commandement
            </p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 space-y-1 px-2">
        {navigation.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors duration-200",
                isActive
                  ? "bg-imperial-gold/10 text-imperial-gold border border-imperial-gold/30"
                  : "text-imperial-muted hover:text-imperial-cream hover:bg-white/5"
              )}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-3 border-t border-imperial-gold/20 text-imperial-muted hover:text-imperial-cream transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-5 h-5 mx-auto" />
        ) : (
          <ChevronLeft className="w-5 h-5" />
        )}
      </button>
    </aside>
  );
}
