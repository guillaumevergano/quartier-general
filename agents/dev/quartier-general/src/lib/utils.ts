import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(value);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('fr-FR').format(value);
}

export function getStatusColor(status: 'online' | 'offline' | 'busy'): string {
  switch (status) {
    case 'online':
      return 'bg-green-400';
    case 'busy':
      return 'bg-yellow-400';
    case 'offline':
    default:
      return 'bg-gray-400';
  }
}

export function getGradeIcon(grade: string): string {
  // Associer les grades militaires français à des étoiles/médailles
  const gradeIcons: Record<string, string> = {
    'Maréchal': '⭐⭐⭐⭐⭐',
    'Général': '⭐⭐⭐⭐',
    'Colonel': '⭐⭐⭐',
    'Lieutenant-Colonel': '⭐⭐',
    'Commandant': '⭐⭐',
    'Capitaine': '⭐',
    'Lieutenant': '🔵',
    'Sous-Lieutenant': '🔹',
    'Agent': '🔶',
    'Opérateur': '⚪',
  };
  
  return gradeIcons[grade] || '⚪';
}