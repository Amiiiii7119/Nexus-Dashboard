"use client";
import { useState, useEffect } from "react";
import { Server, CheckCircle2, XCircle, Loader2, User as UserIcon, Globe } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth-store";
import { api } from "@/lib/api";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2.5 border-b border-white/[0.05] last:border-0">
      <span className="text-xs text-gray-500 uppercase tracking-wider">{label}</span>
      <span className="text-sm text-white font-medium">{value}</span>
    </div>
  );
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [health, setHealth] = useState<{ status: string; ts: string } | null>(null);
  const [healthError, setHealthError] = useState(false);

  useEffect(() => {
    api.health()
      .then(setHealth)
      .catch(() => setHealthError(true));
  }, []);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

  return (
    <AppShell>
      <PageHeader title="Settings" description="Account and system configuration" />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile */}
        <Card>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <UserIcon className="h-4 w-4 text-sky-400" />
            <h3 className="text-sm font-semibold text-white">Profile</h3>
          </div>
          <CardBody>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-purple-600 flex items-center justify-center shadow-lg shadow-sky-500/20 shrink-0">
                <span className="text-2xl font-bold text-white">
                  {(user?.full_name ?? "U")
                    .split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-base font-bold text-white">{user?.full_name}</p>
                <p className="text-sm text-gray-400 mt-0.5">{user?.email}</p>
                <Badge tone={user?.is_active ? "success" : "danger"} className="mt-2">
                  {user?.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="space-y-0">
              <InfoRow label="Role"       value={user?.role?.replace(/_/g, " ") ?? "—"} />
              <InfoRow label="Department" value={user?.department ?? "Not set"} />
              <InfoRow label="Team"       value={user?.team_id ?? "Not assigned"} />
            </div>
          </CardBody>
        </Card>

        {/* System */}
        <Card>
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
            <Server className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-semibold text-white">System Status</h3>
          </div>
          <CardBody className="space-y-4">
            {/* Backend status */}
            <div className="flex items-center gap-3 p-4 rounded-xl bg-white/[0.03] border border-white/[0.07]">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-purple-500/20 to-sky-500/10 border border-white/10 flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-purple-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white">Backend API</p>
                <p className="text-xs text-gray-500 font-mono truncate">{apiUrl}</p>
              </div>
              {health ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span className="text-xs text-emerald-300 font-medium">Online</span>
                </div>
              ) : healthError ? (
                <div className="flex items-center gap-1.5 shrink-0">
                  <XCircle className="h-4 w-4 text-red-400" />
                  <span className="text-xs text-red-300 font-medium">Offline</span>
                </div>
              ) : (
                <Loader2 className="h-4 w-4 text-gray-500 animate-spin shrink-0" />
              )}
            </div>

            {health && (
              <p className="text-xs text-gray-600 px-1">
                Last checked: {new Date(health.ts).toLocaleString()}
              </p>
            )}

            <div className="pt-2 border-t border-white/[0.06] space-y-0">
              <InfoRow label="Frontend Port" value="5173" />
              <InfoRow label="Environment"   value="Development" />
              <InfoRow label="Tunnel"        value="ngrok (active)" />
            </div>
          </CardBody>
        </Card>
      </div>
    </AppShell>
  );
}
