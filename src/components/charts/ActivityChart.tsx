"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { AGENT_COLORS, AGENT_NAMES } from "@/lib/utils";

interface ActivityChartProps {
  data: Record<string, unknown>[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  if (!data.length) {
    return <p className="text-imperial-muted text-center py-12">Aucune donnée disponible</p>;
  }

  const agentIds = Object.keys(AGENT_COLORS);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="date" stroke="#A09882" fontSize={12} />
        <YAxis stroke="#A09882" fontSize={12} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#121E32",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 8,
            color: "#F5F0E8",
          }}
        />
        <Legend />
        {agentIds.map((id) => (
          <Bar
            key={id}
            dataKey={id}
            name={AGENT_NAMES[id] || id}
            fill={AGENT_COLORS[id]}
            stackId="a"
            radius={[2, 2, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}
