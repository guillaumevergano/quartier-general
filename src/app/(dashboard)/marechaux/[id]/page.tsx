import { supabaseAdmin } from "@/lib/supabase";
import { Agent, Action, DailyCost } from "@/types/database";
import { notFound } from "next/navigation";
import AgentProfileClient from "@/components/agents/AgentProfileClient";

export const revalidate = 30;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AgentProfilePage({ params }: Props) {
  const { id } = await params;

  const { data: agent } = await supabaseAdmin
    .from("agents")
    .select("*")
    .eq("id", id)
    .single();

  if (!agent) return notFound();

  const typedAgent = agent as Agent;

  // Stats
  const { data: actions } = await supabaseAdmin
    .from("actions")
    .select("*")
    .eq("agent_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const allActions = (actions as Action[]) || [];

  const { data: costData } = await supabaseAdmin
    .from("daily_costs")
    .select("*")
    .eq("agent_id", id);

  const costs = (costData as DailyCost[]) || [];

  return (
    <AgentProfileClient 
      initialAgent={typedAgent}
      actions={allActions}
      costs={costs}
    />
  );
}
