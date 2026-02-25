"use client";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import Sidebar from "@/components/layout/Sidebar";

export default function DashboardShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
    </div>
  );
}
