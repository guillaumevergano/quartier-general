"use client";

import { useEffect, useState } from "react";
import { getSupabasePublic } from "@/lib/supabase";
import { Alert } from "@/types/database";

export function useRealtimeAlerts(initialAlerts: Alert[] = []) {
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);

  useEffect(() => {
    setAlerts(initialAlerts);
  }, [initialAlerts]);

  useEffect(() => {
    let channel: any | null = null;
    const client = getSupabasePublic(); if (!client) return;
    try {
      channel = client
        .channel("realtime-alerts")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "alerts" },
          (payload) => {
            setAlerts((prev) => [payload.new as Alert, ...prev]);
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "alerts" },
          (payload) => {
            setAlerts((prev) =>
              prev.map((a) => (a.id === (payload.new as Alert).id ? (payload.new as Alert) : a))
            );
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

  const unreadCount = alerts.filter((a) => !a.is_read).length;

  return { alerts, setAlerts, unreadCount };
}
