import { supabaseAdmin } from "@/lib/supabase";
import { Action } from "@/types/database";
import { formatDate, formatCost, AGENT_NAMES, AGENT_COLORS } from "@/lib/utils";
import JournalFilters from "@/components/journal/JournalFilters";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 30;

interface Props {
  searchParams: Promise<{
    agent?: string;
    type?: string;
    channel?: string;
    page?: string;
    dateFrom?: string;
    dateTo?: string;
    costMin?: string;
    costMax?: string;
    search?: string;
  }>;
}

export default async function JournalPage({ searchParams }: Props) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const perPage = 50;

  let query = supabaseAdmin
    .from("actions")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false })
    .range((page - 1) * perPage, page * perPage - 1);

  if (params.agent) query = query.eq("agent_id", params.agent);
  if (params.type) query = query.eq("action_type", params.type);
  if (params.channel) query = query.eq("channel", params.channel);
  if (params.dateFrom) query = query.gte("created_at", `${params.dateFrom}T00:00:00`);
  if (params.dateTo) query = query.lte("created_at", `${params.dateTo}T23:59:59`);
  if (params.costMin) query = query.gte("cost_usd", Number(params.costMin));
  if (params.costMax) query = query.lte("cost_usd", Number(params.costMax));
  if (params.search) query = query.ilike("summary", `%${params.search}%`);

  const { data: actions, count } = await query;
  const totalPages = Math.ceil((count || 0) / perPage);

  const buildUrl = (p: number) => {
    const sp = new URLSearchParams();
    sp.set("page", String(p));
    if (params.agent) sp.set("agent", params.agent);
    if (params.type) sp.set("type", params.type);
    if (params.channel) sp.set("channel", params.channel);
    if (params.dateFrom) sp.set("dateFrom", params.dateFrom);
    if (params.dateTo) sp.set("dateTo", params.dateTo);
    if (params.costMin) sp.set("costMin", params.costMin);
    if (params.costMax) sp.set("costMax", params.costMax);
    if (params.search) sp.set("search", params.search);
    return `/journal?${sp.toString()}`;
  };

  // Smart pagination: show first, last, and pages around current
  const getPageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    pages.push(1);
    if (page > 3) pages.push("...");
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) {
      pages.push(i);
    }
    if (page < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">Journal de Campagne</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Historique de toutes les opérations — {count || 0} entrées
        </p>
      </div>

      <JournalFilters
        currentAgent={params.agent}
        currentType={params.type}
        currentChannel={params.channel}
        currentDateFrom={params.dateFrom}
        currentDateTo={params.dateTo}
        currentCostMin={params.costMin}
        currentCostMax={params.costMax}
        currentSearch={params.search}
      />

      <div className="card-imperial overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-imperial-gold/20 text-left">
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Date</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Agent</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Type</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Canal</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Résumé</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle text-right">Coût</th>
              <th className="py-3 px-4 text-imperial-muted font-subtitle">Statut</th>
            </tr>
          </thead>
          <tbody>
            {(actions as Action[] || []).map((action) => (
              <tr
                key={action.id}
                className="border-b border-imperial-gold/5 hover:bg-imperial-gold/5 transition-colors"
              >
                <td className="py-2.5 px-4 text-xs text-imperial-muted font-mono whitespace-nowrap">
                  {formatDate(action.created_at)}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className="font-badge text-xs"
                    style={{ color: AGENT_COLORS[action.agent_id] || "#C9A84C" }}
                  >
                    {AGENT_NAMES[action.agent_id] || action.agent_id}
                  </span>
                </td>
                <td className="py-2.5 px-4">
                  <span className="text-xs px-2 py-0.5 rounded bg-imperial-gold/10 text-imperial-muted">
                    {action.action_type}
                  </span>
                </td>
                <td className="py-2.5 px-4 text-xs text-imperial-muted">
                  {action.channel || "—"}
                </td>
                <td className="py-2.5 px-4 text-xs text-imperial-cream/80 max-w-xs truncate">
                  {action.summary || "—"}
                </td>
                <td className="py-2.5 px-4 text-xs font-mono text-imperial-gold text-right">
                  {action.cost_usd ? formatCost(action.cost_usd) : "—"}
                </td>
                <td className="py-2.5 px-4">
                  <span
                    className={`text-xs ${
                      action.status === "error"
                        ? "text-imperial-error"
                        : action.status === "pending"
                          ? "text-imperial-warning"
                          : "text-imperial-success"
                    }`}
                  >
                    {action.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {(!actions || actions.length === 0) && (
          <p className="text-center py-12 text-imperial-muted">Aucune action enregistrée</p>
        )}
      </div>

      {/* Pagination améliorée */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={buildUrl(page - 1)}
              className="p-2 rounded bg-imperial-bg-secondary border border-imperial-gold/20 text-imperial-muted hover:text-imperial-cream"
            >
              <ChevronLeft className="w-4 h-4" />
            </a>
          )}
          {getPageNumbers().map((p, i) =>
            p === "..." ? (
              <span key={`dots-${i}`} className="px-2 text-imperial-muted">…</span>
            ) : (
              <a
                key={p}
                href={buildUrl(p as number)}
                className={`px-3 py-1 rounded text-sm ${
                  p === page
                    ? "bg-imperial-gold text-imperial-bg font-bold"
                    : "bg-imperial-bg-secondary text-imperial-muted hover:text-imperial-cream border border-imperial-gold/20"
                }`}
              >
                {p}
              </a>
            )
          )}
          {page < totalPages && (
            <a
              href={buildUrl(page + 1)}
              className="p-2 rounded bg-imperial-bg-secondary border border-imperial-gold/20 text-imperial-muted hover:text-imperial-cream"
            >
              <ChevronRight className="w-4 h-4" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
