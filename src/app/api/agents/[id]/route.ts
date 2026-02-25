import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    // Vérification auth admin
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    
    const { name, title, grade, description, avatar_url } = body;

    // Validation basique
    if (!name || typeof name !== "string") {
      return NextResponse.json({ error: "Le nom est requis" }, { status: 400 });
    }

    // Préparation des données à mettre à jour
    const updateData: Record<string, unknown> = {
      name,
      title: title || null,
      grade: grade || null,
      updated_at: new Date().toISOString(),
    };

    if (avatar_url !== undefined) {
      updateData.avatar_url = avatar_url;
    }

    if (description !== undefined) {
      updateData.description = description;
    }

    // Mise à jour de l'agent
    const { data, error } = await supabaseAdmin
      .from("agents")
      .update(updateData)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Erreur Supabase:", error);
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Agent non trouvé" }, { status: 404 });
    }

    return NextResponse.json({ success: true, agent: data });
  } catch (error) {
    console.error("Erreur API:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}