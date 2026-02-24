"use client";

import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { date: string; cost: number }[];
}

export default function CostEvolutionChart({ data }: Props) {
  if (!data.length) {
    return <p className="text-imperial-muted text-center py-12">Aucune donnée disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#C9A84C" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#C9A84C" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="#A09882" fontSize={12} />
        <YAxis stroke="#A09882" fontSize={12} tickFormatter={(v) => `$${v}`} />
        <Tooltip
          contentStyle={{
            backgroundColor: "#121E32",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 8,
            color: "#F5F0E8",
          }}
          formatter={(value: number) => [`$${value.toFixed(4)}`, "Coût"]}
        />
        <Area
          type="monotone"
          dataKey="cost"
          stroke="#C9A84C"
          fill="url(#goldGradient)"
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
