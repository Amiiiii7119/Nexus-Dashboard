"use client";
import { useEffect, useState } from "react";
import { Plus, Users as UsersIcon, UserX, UserCheck } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Badge, roleTone } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import type { User } from "@/types/auth";
import { CreateUserModal } from "./create-user-modal";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.getUsers();
      setUsers(res.users ?? []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const handleToggleActive = async (uid: string, isActive: boolean) => {
    try {
      if (isActive) {
        await api.deactivateUser(uid);
      } else {
        await api.reactivateUser(uid);
      }
      load();
    } catch {}
  };

  const columns: Column<User & { id: string }>[] = [
    {
      key: "full_name",
      header: "Name",
      render: (row) => (
        <div>
          <span className="font-medium text-white">{row.full_name}</span>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      ),
      sortValue: (row) => row.full_name,
    },
    {
      key: "role",
      header: "Role",
      render: (row) => <Badge tone={roleTone(row.role)}>{row.role.replace("_", " ")}</Badge>,
      sortValue: (row) => row.role,
    },
    {
      key: "department",
      header: "Department",
      render: (row) => <span className="text-gray-300">{row.department ?? "—"}</span>,
    },
    {
      key: "team_id",
      header: "Team",
      render: (row) => <span className="text-gray-300">{row.team_id ?? "—"}</span>,
    },
    {
      key: "is_active",
      header: "Status",
      render: (row) => (
        <Badge tone={row.is_active ? "success" : "danger"}>
          {row.is_active ? "Active" : "Inactive"}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (row) => {
        if (row.uid === currentUser?.uid) return null;
        return (
          <button
            onClick={() => handleToggleActive(row.uid, row.is_active)}
            className={`p-1.5 rounded-lg border transition ${
              row.is_active
                ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                : "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
            }`}
            title={row.is_active ? "Deactivate" : "Reactivate"}
          >
            {row.is_active ? <UserX className="h-3.5 w-3.5" /> : <UserCheck className="h-3.5 w-3.5" />}
          </button>
        );
      },
    },
  ];

  const mappedUsers = users.map((u) => ({ ...u, id: u.uid }));

  return (
    <AppShell>
      <PageHeader
        title="Users"
        description="Manage team members and their roles"
        actions={
          <Button onClick={() => setShowCreate(true)} size="sm">
            <Plus className="h-4 w-4" /> Create User
          </Button>
        }
      />

      {!loading && users.length === 0 ? (
        <EmptyState icon={UsersIcon} title="No users found" description="Create the first user to get started" />
      ) : (
        <DataTable
          rows={mappedUsers}
          columns={columns}
          searchKeys={["full_name" as any, "email" as any]}
          loading={loading}
        />
      )}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}
    </AppShell>
  );
}
