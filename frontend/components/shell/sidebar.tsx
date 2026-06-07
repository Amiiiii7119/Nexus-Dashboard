"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Boxes, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { navigation, navGroups } from "@/lib/nav";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const { user, clear } = useAuth();
  const router = useRouter();

  const visibleNav = navigation.filter((item) => {
    if (item.href === "/users" || item.href === "/audit") {
      return user?.role === "super_admin" || user?.role === "admin";
    }
    return true;
  });

  const handleLogout = async () => {
    try { await api.logout(); } catch {}
    clear();
    router.push("/login");
  };

  const initials = (user?.full_name ?? "U")
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-white/[0.07] bg-[hsl(222,47%,4%)]/60 backdrop-blur-2xl">
      {/* Logo */}
      <div className="flex items-center gap-3 px-5 h-16 border-b border-white/[0.07]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/25 shrink-0">
          <Boxes className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white leading-tight truncate">Nexus ERP</p>
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">Internship Suite</p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {navGroups.map((group) => {
          const items = visibleNav.filter((n) => n.group === group);
          if (items.length === 0) return null;
          return (
            <div key={group}>
              <p className="px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-gray-600">
                {group}
              </p>
              <ul className="space-y-0.5">
                {items.map(({ href, label, icon: Icon }) => {
                  const active = pathname === href || pathname.startsWith(`${href}/`);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        className={cn(
                          "group relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200",
                          active
                            ? "bg-gradient-to-r from-sky-500/20 to-purple-500/10 text-white border border-sky-500/25 shadow-sm"
                            : "text-gray-400 hover:text-white hover:bg-white/[0.05] border border-transparent",
                        )}
                      >
                        {active && (
                          <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-gradient-to-b from-sky-400 to-purple-500" />
                        )}
                        <Icon className={cn("h-4 w-4 shrink-0 transition-colors", active ? "text-sky-400" : "text-gray-500 group-hover:text-gray-300")} />
                        <span>{label}</span>
                        {active && <span className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="border-t border-white/[0.07] p-4 space-y-2">
        <div className="flex items-center gap-3 px-2 py-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.full_name ?? "User"}</p>
            <p className="text-[10px] text-gray-500 capitalize truncate">{user?.role?.replace("_", " ") ?? "—"}</p>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:text-red-300 hover:bg-red-500/10 border border-transparent hover:border-red-500/20 transition-all"
        >
          <LogOut className="h-3.5 w-3.5" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
