"use client";
import { Sidebar } from "./sidebar";
import { Topbar } from "./topbar";
import { AuthGuard } from "./auth-guard";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen grid-bg">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar />
          <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto animate-fade-in-up">
            {children}
          </main>
        </div>
      </div>
    </AuthGuard>
  );
}
