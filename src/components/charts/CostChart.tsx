"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface CostChartProps {
  data: { name: string; cost: number; fill: string }[];
}

export default function CostChart({ data }: CostChartProps) {
  if (!data.length) {
    return <p className="text-imperial-muted text-center py-12">Aucune donnée disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="cost"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label={({ name, cost }) => `${name}: $${cost}`}
          labelLine={{ stroke: "#A09882" }}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: "#121E32",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: 8,
            color: "#F5F0E8",
          }}
          formatter={(value: number) => [`$${value.toFixed(4)}`, "Coût"]}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
