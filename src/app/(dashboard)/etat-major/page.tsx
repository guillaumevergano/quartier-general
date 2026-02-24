import { supabaseAdmin } from "@/lib/supabase";
import { Settings, Shield, Bell } from "lucide-react";

export const revalidate = 60;

export default async function EtatMajorPage() {
  const [{ data: agents }, { data: thresholds }] = await Promise.all([
    supabaseAdmin.from("agents").select("id, name, model, status"),
    supabaseAdmin.from("alert_thresholds").select("*"),
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display text-imperial-gold">État-Major</h1>
        <p className="text-imperial-muted font-subtitle text-lg mt-1">
          Configuration et paramètres du système
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-imperial">
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-imperial-gold" />
            <h3 className="font-display text-imperial-gold">Agents configurés</h3>
          </div>
          <div className="space-y-3">
            {(agents || []).map((a) => (
              <div key={a.id} className="flex items-center justify-between py-2 border-b border-imperial-gold/10">
                <div>
                  <p className="text-sm font-badge text-imperial-cream">{a.name}</p>
                  <p className="text-xs font-mono text-imperial-muted">{a.model}</p>
                </div>
                <span className={`text-xs ${a.status === "online" ? "text-imperial-success" : "text-imperial-muted"}`}>
                  {a.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-imperial">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-5 h-5 text-imperial-gold" />
            <h3 className="font-display text-imperial-gold">Seuils d&apos;alertes</h3>
          </div>
          {thresholds && thresholds.length > 0 ? (
            <div className="space-y-3">
              {thresholds.map((t: Record<string, unknown>, i: number) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-imperial-gold/10">
                  <span className="text-sm text-imperial-cream">{String(t.name || t.category || "Seuil")}</span>
                  <span className="text-sm font-mono text-imperial-gold">{String(t.threshold_value || t.value || "—")}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-imperial-muted text-center py-8">Aucun seuil configuré</p>
          )}
        </div>
      </div>

      <div className="card-imperial">
        <div className="flex items-center gap-2 mb-4">
          <Settings className="w-5 h-5 text-imperial-gold" />
          <h3 className="font-display text-imperial-gold">Informations système</h3>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-imperial-muted">Supabase</p>
            <p className="font-mono text-xs text-imperial-cream">hagdaqlnwpvasnkxwygz (eu-central-1)</p>
          </div>
          <div>
            <p className="text-imperial-muted">Framework</p>
            <p className="font-mono text-xs text-imperial-cream">Next.js 15 + TypeScript</p>
          </div>
        </div>
      </div>
    </div>
  );
}
