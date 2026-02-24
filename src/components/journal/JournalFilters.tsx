"use client";

import { useRouter } from "next/navigation";
import { AGENT_NAMES } from "@/lib/utils";

interface Props {
  currentAgent?: string;
  currentType?: string;
  currentChannel?: string;
}

const actionTypes = ["message", "tool_call", "exec", "error", "system", "heartbeat", "subagent"];
const channels = ["discord", "telegram", "tui", "web"];

export default function JournalFilters({ currentAgent, currentType, currentChannel }: Props) {
  const router = useRouter();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(window.location.search);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete("page");
    router.push(`/journal?${params.toString()}`);
  };

  return (
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

      {(currentAgent || currentType || currentChannel) && (
        <button
          onClick={() => router.push("/journal")}
          className="text-sm text-imperial-muted hover:text-imperial-cream transition-colors px-3 py-2"
        >
          ✕ Réinitialiser
        </button>
      )}
    </div>
  );
}
