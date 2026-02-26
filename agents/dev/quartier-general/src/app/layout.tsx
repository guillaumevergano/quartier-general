import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Quartier Général - Interface de Commandement OpenClaw",
  description: "Dashboard de supervision pour l'écosystème multi-agents OpenClaw - Interface de Commandement Napoléonienne",
  keywords: ["OpenClaw", "AI", "Dashboard", "Napoleon", "Multi-agents"],
  authors: [{ name: "Agent Vauban" }],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="fr">
      <body className="antialiased">
        <SessionProvider session={session}>
          {session ? (
            <div className="min-h-screen flex">
              <Sidebar />
              <main className="flex-1 flex flex-col">
                <div className="flex-1 p-6 overflow-auto">
                  {children}
                </div>
              </main>
            </div>
          ) : (
            children
          )}
        </SessionProvider>
      </body>
    </html>
  );
}
