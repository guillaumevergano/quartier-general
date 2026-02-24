"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

interface Props {
  data: { type: string; cost: number }[];
}

export default function ActionTypeChart({ data }: Props) {
  if (!data.length) {
    return <p className="text-imperial-muted text-center py-12">Aucune donnée disponible</p>;
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="type" stroke="#A09882" fontSize={11} angle={-30} textAnchor="end" height={60} />
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
        <Bar dataKey="cost" fill="#C9A84C" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
