"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#C9A84C", "#8B2232", "#2D6A4F", "#4A6FA5", "#9B59B6", "#E67E22", "#1ABC9C"];

interface Props {
  data: { name: string; cost: number }[];
}

export default function ModelPieChart({ data }: Props) {
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
          label={({ name, cost }) => `${name.split("/").pop()}: $${cost.toFixed(3)}`}
          labelLine={{ stroke: "#A09882" }}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
