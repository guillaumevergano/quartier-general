import { supabaseAdmin } from "@/lib/supabase";
import { Alert } from "@/types/database";
import DepechesClient from "@/components/alerts/DepechesClient";

export const revalidate = 30;

export default async function DepechesPage() {
  const { data: alerts } = await supabaseAdmin
    .from("alerts")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return <DepechesClient initialAlerts={(alerts as Alert[]) || []} />;
}
