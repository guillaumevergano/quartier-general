"use client";

import { useEffect, useState, useCallback } from "react";
import { supabasePublic } from "@/lib/supabase";
import { Action } from "@/types/database";

export function useRealtimeActions(initialActions: Action[] = []) {
  const [actions, setActions] = useState<Action[]>(initialActions);

  useEffect(() => {
    setActions(initialActions);
  }, [initialActions]);

  useEffect(() => {
    const channel = supabasePublic
      .channel("realtime-actions")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "actions" },
        (payload) => {
          setActions((prev) => [payload.new as Action, ...prev]);
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "actions" },
        (payload) => {
          setActions((prev) =>
            prev.map((a) => (a.id === (payload.new as Action).id ? (payload.new as Action) : a))
          );
        }
      )
      .subscribe();

    return () => {
      supabasePublic.removeChannel(channel);
    };
  }, []);

  return actions;
}
