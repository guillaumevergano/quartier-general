"use client";

import { useCallback } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  Background,
  Controls,
  ConnectionLineType,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { AGENT_COLORS } from "@/lib/utils";

const nodes: Node[] = [
  {
    id: "main",
    position: { x: 250, y: 0 },
    data: { label: "⚜️ Berthier\nChef d'État-Major" },
    style: {
      background: "#1a2a44",
      color: "#F5F0E8",
      border: `2px solid ${AGENT_COLORS.main}`,
      borderRadius: 12,
      padding: 16,
      fontWeight: "bold",
      whiteSpace: "pre-line" as const,
      textAlign: "center" as const,
      fontSize: 14,
      minWidth: 180,
    },
  },
  {
    id: "murat",
    position: { x: 50, y: 160 },
    data: { label: "🐎 Murat\nCavalerie" },
    style: {
      background: "#1a2a44",
      color: "#F5F0E8",
      border: `2px solid ${AGENT_COLORS.murat}`,
      borderRadius: 12,
      padding: 16,
      fontWeight: "bold",
      whiteSpace: "pre-line" as const,
      textAlign: "center" as const,
      fontSize: 14,
      minWidth: 160,
    },
  },
  {
    id: "vauban",
    position: { x: 450, y: 160 },
    data: { label: "🏗️ Vauban\nIngénieur" },
    style: {
      background: "#1a2a44",
      color: "#F5F0E8",
      border: `2px solid ${AGENT_COLORS.vauban}`,
      borderRadius: 12,
      padding: 16,
      fontWeight: "bold",
      whiteSpace: "pre-line" as const,
      textAlign: "center" as const,
      fontSize: 14,
      minWidth: 160,
    },
  },
  {
    id: "davout",
    position: { x: 250, y: 320 },
    data: { label: "⚔️ Davout\nExécutant" },
    style: {
      background: "#1a2a44",
      color: "#F5F0E8",
      border: `2px solid ${AGENT_COLORS.davout}`,
      borderRadius: 12,
      padding: 16,
      fontWeight: "bold",
      whiteSpace: "pre-line" as const,
      textAlign: "center" as const,
      fontSize: 14,
      minWidth: 160,
    },
  },
];

const edgeStyle = { stroke: "#C9A84C", strokeWidth: 2 };
const markerEnd = { type: MarkerType.ArrowClosed, color: "#C9A84C" };

const edges: Edge[] = [
  { id: "main-murat", source: "main", target: "murat", style: edgeStyle, markerEnd, label: "commande", labelStyle: { fill: "#A09882", fontSize: 11 } },
  { id: "main-vauban", source: "main", target: "vauban", style: edgeStyle, markerEnd, label: "commande", labelStyle: { fill: "#A09882", fontSize: 11 } },
  { id: "main-davout", source: "main", target: "davout", style: edgeStyle, markerEnd, label: "commande", labelStyle: { fill: "#A09882", fontSize: 11 } },
  { id: "murat-davout", source: "murat", target: "davout", style: { stroke: AGENT_COLORS.murat, strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: AGENT_COLORS.murat }, label: "commande", labelStyle: { fill: "#A09882", fontSize: 11 } },
  { id: "vauban-davout", source: "vauban", target: "davout", style: { stroke: AGENT_COLORS.vauban, strokeWidth: 2 }, markerEnd: { type: MarkerType.ArrowClosed, color: AGENT_COLORS.vauban }, label: "commande", labelStyle: { fill: "#A09882", fontSize: 11 } },
];

export default function OrgChart() {
  return (
    <div className="w-full h-[500px] rounded-lg overflow-hidden border border-imperial-gold/20">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        connectionLineType={ConnectionLineType.SmoothStep}
        fitView
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#C9A84C" gap={20} size={1} style={{ opacity: 0.05 }} />
        <Controls
          style={{ background: "#1a2a44", border: "1px solid rgba(201,168,76,0.3)", borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
