"use client";
import { useEffect, useState } from "react";
import { Plus, ListTodo } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Button } from "@/components/ui/button";
import { Badge, statusTone, priorityTone } from "@/components/ui/badge";
import { DataTable, type Column } from "@/components/tables/data-table";
import { EmptyState } from "@/components/ui/empty-state";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import type { Task } from "@/types/erp";
import { CreateTaskModal } from "./create-task-modal";

export default function TasksPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    try {
      const params = filter !== "all" ? `status=${filter}` : "";
      const res = await api.getTasks(params);
      setTasks(res.tasks ?? []);
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [filter]);

  const canCreate = user?.role !== "intern";

  const columns: Column<Task>[] = [
    {
      key: "title",
      header: "Title",
      render: (row) => <span className="font-medium text-white">{row.title}</span>,
      sortValue: (row) => row.title,
    },
    {
      key: "status",
      header: "Status",
      render: (row) => <Badge tone={statusTone(row.status)}>{row.status.replace("_", " ")}</Badge>,
      sortValue: (row) => row.status,
    },
    {
      key: "priority",
      header: "Priority",
      render: (row) => <Badge tone={priorityTone(row.priority)}>{row.priority}</Badge>,
      sortValue: (row) => row.priority,
    },
    {
      key: "due_date",
      header: "Due Date",
      render: (row) => {
        const overdue = row.status !== "done" && new Date(row.due_date) < new Date();
        return <span className={overdue ? "text-red-400" : "text-gray-300"}>{new Date(row.due_date).toLocaleDateString()}</span>;
      },
      sortValue: (row) => row.due_date,
    },
    {
      key: "created_at",
      header: "Created",
      render: (row) => <span className="text-gray-400 text-xs">{new Date(row.created_at).toLocaleDateString()}</span>,
      sortValue: (row) => row.created_at,
    },
  ];

  const statuses = ["all", "todo", "in_progress", "review", "done"];

  return (
    <AppShell>
      <PageHeader
        title="Tasks"
        description="Manage and track internship tasks"
        actions={
          canCreate ? (
            <Button onClick={() => setShowCreate(true)} size="sm">
              <Plus className="h-4 w-4" /> New Task
            </Button>
          ) : undefined
        }
      />

      <div className="flex gap-2 mb-6 flex-wrap">
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
              filter === s
                ? "bg-sky-500/20 text-sky-300 border-sky-500/30"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-white hover:bg-white/10"
            }`}
          >
            {s === "all" ? "All" : s.replace("_", " ")}
          </button>
        ))}
      </div>

      {!loading && tasks.length === 0 ? (
        <EmptyState icon={ListTodo} title="No tasks found" description="Create your first task to get started" />
      ) : (
        <DataTable
          rows={tasks}
          columns={columns}
          searchKeys={["title" as keyof Task]}
          loading={loading}
        />
      )}

      {showCreate && (
        <CreateTaskModal
          onClose={() => setShowCreate(false)}
          onCreated={() => { setShowCreate(false); load(); }}
        />
      )}
    </AppShell>
  );
}
