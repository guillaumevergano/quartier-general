"use client";

import { useRouter } from "next/navigation";
import { AGENT_NAMES } from "@/lib/utils";
import { Search, X } from "lucide-react";
import { useState, useCallback } from "react";

interface Props {
  currentAgent?: string;
  currentType?: string;
  currentChannel?: string;
  currentDateFrom?: string;
  currentDateTo?: string;
  currentCostMin?: string;
  currentCostMax?: string;
  currentSearch?: string;
}

const actionTypes = ["message", "tool_call", "exec", "error", "system", "heartbeat", "subagent"];
const channels = ["discord", "telegram", "tui", "web"];

export default function JournalFilters({
  currentAgent,
  currentType,
  currentChannel,
  currentDateFrom,
  currentDateTo,
  currentCostMin,
  currentCostMax,
  currentSearch,
}: Props) {
  const router = useRouter();
  const [search, setSearch] = useState(currentSearch || "");

  const updateFilter = useCallback((key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/journal?${params.toString()}`);
  }, [router]);

  const submitSearch = useCallback(() => {
    updateFilter("search", search);
  }, [search, updateFilter]);

  const hasFilters = currentAgent || currentType || currentChannel || currentDateFrom || currentDateTo || currentCostMin || currentCostMax || currentSearch;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-3">
        <select
          value={currentAgent || ""}
          onChange={(e) => updateFilter("agent", e.target.value)}
          className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none"
        >
          <option value="">Tous les agents</option>
          {Object.entries(AGENT_NAMES).map(([id, name]) => (
            <option key={id} value={id}>{name}</option>
          ))}
        </select>

        <select
          value={currentType || ""}
          onChange={(e) => updateFilter("type", e.target.value)}
          className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none"
        >
          <option value="">Tous les types</option>
          {actionTypes.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>

        <select
          value={currentChannel || ""}
          onChange={(e) => updateFilter("channel", e.target.value)}
          className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none"
        >
          <option value="">Tous les canaux</option>
          {channels.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <label className="text-xs text-imperial-muted">Du</label>
          <input
            type="date"
            value={currentDateFrom || ""}
            onChange={(e) => updateFilter("dateFrom", e.target.value)}
            className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-imperial-muted">Au</label>
          <input
            type="date"
            value={currentDateTo || ""}
            onChange={(e) => updateFilter("dateTo", e.target.value)}
            className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-imperial-muted">Coût min $</label>
          <input
            type="number"
            step="0.001"
            value={currentCostMin || ""}
            onChange={(e) => updateFilter("costMin", e.target.value)}
            placeholder="0.00"
            className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none w-24"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs text-imperial-muted">Coût max $</label>
          <input
            type="number"
            step="0.001"
            value={currentCostMax || ""}
            onChange={(e) => updateFilter("costMax", e.target.value)}
            placeholder="9.99"
            className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none w-24"
          />
        </div>

        <div className="flex items-center gap-1">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submitSearch()}
            placeholder="Rechercher dans les résumés..."
            className="bg-imperial-bg-secondary border border-imperial-gold/20 rounded px-3 py-2 text-sm text-imperial-cream focus:border-imperial-gold focus:outline-none w-64"
          />
          <button
            onClick={submitSearch}
            className="p-2 text-imperial-muted hover:text-imperial-gold transition-colors"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      </div>

      {hasFilters && (
        <button
          onClick={() => router.push("/journal")}
          className="flex items-center gap-1 text-sm text-imperial-muted hover:text-imperial-cream transition-colors"
        >
          <X className="w-3 h-3" />
          Réinitialiser les filtres
        </button>
      )}
    </div>
  );
}
