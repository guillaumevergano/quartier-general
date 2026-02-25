"use client";

import { useEffect, useState } from "react";
import { getSupabasePublic } from "@/lib/supabase";

export function useUnreadAlerts() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const client = getSupabasePublic(); if (!client) return;
    try {
      client
        .from("alerts")
        .select("id", { count: "exact", head: true })
        .eq("is_read", false)
        .then(({ count: c }) => setCount(c || 0));
    } catch {
      // Silently fail — show 0 unread
    }

    let channel: any | null = null;
    try {
      channel = client
        .channel("unread-alerts-count")
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "alerts" },
          (payload) => {
            if (!(payload.new as { is_read: boolean }).is_read) {
              setCount((prev) => prev + 1);
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "alerts" },
          (payload) => {
            const oldRead = (payload.old as { is_read?: boolean }).is_read;
            const newRead = (payload.new as { is_read: boolean }).is_read;
            if (!oldRead && newRead) setCount((prev) => Math.max(0, prev - 1));
            if (oldRead && !newRead) setCount((prev) => prev + 1);
          }
        )
        .subscribe();
    } catch {
      // Realtime unavailable — static count only
    }

    return () => {
      if (channel) {
        try { client.removeChannel(channel); } catch {}
      }
    };
  }, []);

  return count;
}
