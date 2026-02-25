"use client";

import { useEffect, useState } from "react";
import { supabasePublic } from "@/lib/supabase";
import { Agent } from "@/types/database";

export function useRealtimeAgents(initialAgents: Agent[] = []) {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  useEffect(() => {
    setAgents(initialAgents);
  }, [initialAgents]);

  useEffect(() => {
    let channel: ReturnType<typeof supabasePublic.channel> | null = null;
    try {
      channel = supabasePublic
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
        try { supabasePublic.removeChannel(channel); } catch {}
      }
    };
  }, []);

  return agents;
}
