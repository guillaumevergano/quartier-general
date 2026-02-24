"use client";

import { Agent } from "@/types/database";
import { useRealtimeAgents } from "@/hooks/useRealtimeAgents";
import AgentCard from "@/components/agents/AgentCard";
import OrgChart from "@/components/agents/OrgChart";
import Link from "next/link";

export default function MarechauxClient({ initialAgents }: { initialAgents: Agent[] }) {
  const agents = useRealtimeAgents(initialAgents);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Les Maréchaux</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Corps des agents déployés
        </p>
      </div>

      {/* Organigramme */}
      <div className="card-imperial">
        <h3 className="font-display text-imperial-gold mb-4">Chaîne de Commandement</h3>
        <OrgChart />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <Link key={agent.id} href={`/marechaux/${agent.id}`} className="block hover:scale-[1.01] transition-transform">
            <AgentCard agent={agent} />
          </Link>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="card-imperial text-center py-12">
          <p className="text-imperial-muted">Aucun maréchal enregistré</p>
        </div>
      )}
    </div>
  );
}
