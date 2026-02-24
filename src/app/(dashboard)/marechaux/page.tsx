import { supabaseAdmin } from "@/lib/supabase";
import { Agent } from "@/types/database";
import AgentCard from "@/components/agents/AgentCard";

export const revalidate = 60;

export default async function MarechauxPage() {
  const { data: agents } = await supabaseAdmin
    .from("agents")
    .select("*")
    .order("name");

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Les Maréchaux</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Corps des agents déployés
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {(agents as Agent[] || []).map((agent) => (
          <AgentCard key={agent.id} agent={agent} />
        ))}
      </div>

      {(!agents || agents.length === 0) && (
        <div className="card-imperial text-center py-12">
          <p className="text-imperial-muted">Aucun maréchal enregistré</p>
        </div>
      )}
    </div>
  );
}
