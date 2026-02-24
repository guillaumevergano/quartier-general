import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id, all } = await req.json();

  if (all) {
    await supabaseAdmin
      .from("alerts")
      .update({ is_read: true })
      .eq("is_read", false);
  } else if (id) {
    await supabaseAdmin
      .from("alerts")
      .update({ is_read: true })
      .eq("id", id);
  }

  return NextResponse.json({ ok: true });
}
