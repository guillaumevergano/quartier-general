import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCost(usd: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 4,
  }).format(usd);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat("fr-FR").format(n);
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const AGENT_COLORS: Record<string, string> = {
  main: "#C9A84C",
  murat: "#8B2232",
  davout: "#2D6A4F",
  vauban: "#4A6FA5",
};

export const AGENT_NAMES: Record<string, string> = {
  main: "Berthier",
  murat: "Murat",
  davout: "Davout",
  vauban: "Vauban",
};
