import { supabaseAdmin } from "@/lib/supabase";
import { Agent } from "@/types/database";
import MarechauxClient from "@/components/agents/MarechauxClient";

export const revalidate = 60;

export default async function MarechauxPage() {
  const { data: agents } = await supabaseAdmin
    .from("agents")
    .select("*")
    .order("name");

  return <MarechauxClient initialAgents={(agents as Agent[]) || []} />;
}
