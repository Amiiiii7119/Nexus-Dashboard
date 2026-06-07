"use client";
import { useState } from "react";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/lib/auth-store";

export function Topbar() {
  const { user } = useAuth();
  const [notifOpen, setNotifOpen] = useState(false);

  const initials = (user?.full_name ?? "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b border-white/[0.07] bg-[hsl(222,47%,5%)]/70 backdrop-blur-2xl">
      {/* Search */}
      <div className="relative max-w-sm flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-500" />
        <input
          placeholder="Search tasks, users…"
          className="w-full h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] pl-9 pr-10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-sky-500/40 focus:bg-white/[0.06] transition-all"
        />
        <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-white/10 bg-white/[0.04] text-[9px] text-gray-500 font-mono">
          ⌘K
        </kbd>
      </div>

      <div className="flex items-center gap-2 ml-4">
        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((v) => !v)}
            className="relative w-9 h-9 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] flex items-center justify-center transition-all"
          >
            <Bell className="h-4 w-4 text-gray-400" />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-sky-500 ring-2 ring-[hsl(222,47%,5%)]" />
          </button>
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-72 glass-strong rounded-2xl py-3 shadow-2xl z-50 animate-fade-in-up border border-white/10">
                <div className="px-4 pb-2 border-b border-white/10">
                  <p className="text-xs font-semibold text-white">Notifications</p>
                </div>
                <div className="px-4 py-6 text-center">
                  <Bell className="h-6 w-6 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">You're all caught up</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Divider */}
        <div className="w-px h-5 bg-white/10" />

        {/* User chip */}
        <div className="flex items-center gap-2.5 pl-1 pr-3 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08]">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="hidden sm:block leading-tight">
            <p className="text-xs font-semibold text-white leading-none">{user?.full_name ?? "User"}</p>
            <p className="text-[9px] text-gray-500 capitalize mt-0.5">{user?.role?.replace("_", " ")}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
