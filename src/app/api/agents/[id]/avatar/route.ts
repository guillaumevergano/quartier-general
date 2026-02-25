import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(
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
    const formData = await request.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json({ error: "Aucun fichier fourni" }, { status: 400 });
    }

    // Validation du type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json({ error: "Le fichier doit être une image" }, { status: 400 });
    }

    // Limitation de taille (5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: "Le fichier est trop volumineux (max 5MB)" }, { status: 400 });
    }

    // Upload vers Supabase Storage
    const fileName = `agents/${id}.png`;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = new Uint8Array(arrayBuffer);

    const uploadResponse = await fetch(
      `https://hagdaqlnwpvasnkxwygz.supabase.co/storage/v1/object/avatars/${fileName}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhhZ2RhcWxud3B2YXNua3h3eWd6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTk2NzcyMCwiZXhwIjoyMDg3NTQzNzIwfQ.FnlNkpTEzIFJSf9pM7Fx6xJe2DAPzYzhpg1FX7EFJvw`,
          "Content-Type": file.type,
          "x-upsert": "true", // Permet d'écraser le fichier existant
        },
        body: buffer,
      }
    );

    if (!uploadResponse.ok) {
      const errorText = await uploadResponse.text();
      console.error("Erreur upload Supabase:", errorText);
      return NextResponse.json(
        { error: "Erreur lors de l'upload" },
        { status: 500 }
      );
    }

    // URL publique de l'avatar
    const avatarUrl = `https://hagdaqlnwpvasnkxwygz.supabase.co/storage/v1/object/public/avatars/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      avatarUrl,
      message: "Avatar uploadé avec succès"
    });
  } catch (error) {
    console.error("Erreur API avatar:", error);
    return NextResponse.json(
      { error: "Erreur serveur interne" },
      { status: 500 }
    );
  }
}