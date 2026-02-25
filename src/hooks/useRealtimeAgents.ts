"use client";

import { useEffect, useState } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { Agent } from "@/types/database";

export function useRealtimeAgents(initialAgents: Agent[] = []) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  useEffect(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

  useEffect(() => {
    let channel: any | null = null;
    const client = getSupabasePublic(); if (!client) return;
    try {
      channel = client
        .channel("realtime-agents")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "agents" },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setAgents((prev) => [...prev, payload.new as Agent]);
            } else if (payload.eventType === "UPDATE") {
              setAgents((prev) =>
                prev.map((a) => (a.id === (payload.new as Agent).id ? (payload.new as Agent) : a))
              );
            } else if (payload.eventType === "DELETE") {
              setAgents((prev) => prev.filter((a) => a.id !== (payload.old as Agent).id));
            }
          }
        )
        .subscribe();
    } catch {
      // Realtime unavailable — static data only
    }

    return () => {
      if (channel) {
        try { client.removeChannel(channel); } catch {}
      }
    };
  }, []);

  return agents;
}
