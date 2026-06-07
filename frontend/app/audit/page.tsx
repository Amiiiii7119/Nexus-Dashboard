"use client";
import { useEffect, useState } from "react";
import { Shield } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Badge } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import type { AuditEntry } from "@/types/erp";

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs()
      .then((res) => setLogs(res.logs ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns: Column<AuditEntry>[] = [
    {
      key: "email",
      header: "Email",
      render: (row) => <span className="font-medium text-white">{row.email}</span>,
      sortValue: (row) => row.email,
    },
    {
      key: "result",
      header: "Result",
      render: (row) => (
        <Badge tone={row.result === "success" ? "success" : "danger"}>
          {row.result}
        </Badge>
      ),
      sortValue: (row) => row.result,
    },
    {
      key: "reason",
      header: "Reason",
      render: (row) => (
        <span className="text-gray-400 text-xs">{row.reason ?? "—"}</span>
      ),
    },
    {
      key: "ip_address",
      header: "IP Address",
      render: (row) => <span className="text-gray-300 font-mono text-xs">{row.ip_address}</span>,
    },
    {
      key: "timestamp",
      header: "Timestamp",
      render: (row) => (
        <span className="text-gray-400 text-xs">
          {new Date(row.timestamp).toLocaleString()}
        </span>
      ),
      sortValue: (row) => row.timestamp,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        title="Audit Log"
        description="Login attempts and security events"
      />

      {!loading && logs.length === 0 ? (
        <EmptyState icon={Shield} title="No audit entries" description="Login attempts will appear here" />
      ) : (
        <DataTable
          rows={logs}
          columns={columns}
          searchKeys={["email" as keyof AuditEntry]}
          loading={loading}
        />
      )}
    </AppShell>
  );
}
