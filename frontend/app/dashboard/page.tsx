"use client";
import { useEffect, useState } from "react";
import { Users, ListTodo, CheckCircle2, Clock, AlertTriangle, TrendingUp, ArrowRight } from "lucide-react";
import { AppShell } from "@/components/shell/app-shell";
import { PageHeader } from "@/components/shell/page-header";
import { Card, CardBody } from "@/components/ui/card";
import { Badge, statusTone } from "@/components/ui/badge";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth-store";
import type { Task } from "@/types/erp";

const STAT_CONFIGS = [
  { label: "Total Tasks",  key: "total",       icon: ListTodo,     from: "from-sky-500",    to: "to-blue-600",    glow: "shadow-sky-500/20"   },
  { label: "In Progress",  key: "in_progress",  icon: Clock,        from: "from-amber-500",  to: "to-orange-600",  glow: "shadow-amber-500/20" },
  { label: "Completed",    key: "done",         icon: CheckCircle2, from: "from-emerald-500",to: "to-teal-600",    glow: "shadow-emerald-500/20"},
  { label: "Team Members", key: "members",      icon: Users,        from: "from-purple-500", to: "to-violet-600",  glow: "shadow-purple-500/20"},
] as const;

function StatCard({
  label, value, icon: Icon, from, to, glow, loading,
}: { label: string; value: number; icon: React.ElementType; from: string; to: string; glow: string; loading: boolean }) {
  return (
    <Card className="group hover:border-white/15 transition-all duration-300">
      <CardBody className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs text-gray-400 uppercase tracking-widest font-medium">{label}</p>
          {loading ? (
            <div className="mt-2 h-8 w-16 skeleton rounded-lg" />
          ) : (
            <p className="mt-1.5 text-3xl font-bold text-white tabular-nums">{value}</p>
          )}
        </div>
        <div className={`w-12 h-12 shrink-0 rounded-xl bg-gradient-to-br ${from} ${to} flex items-center justify-center shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardBody>
    </Card>
  );
}

function ProgressBar({ label, count, total, color }: { label: string; count: number; total: number; color: string }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm text-gray-300 font-medium">{label}</span>
        <span className="text-sm text-white font-semibold tabular-nums">{count}</span>
      </div>
      <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700 ease-out`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([api.getTasks(), api.getUsers()]).then(([t, u]) => {
      if (t.status === "fulfilled") setTasks(t.value.tasks ?? []);
      if (u.status === "fulfilled") setUsers(u.value.users ?? []);
      setLoading(false);
    });
  }, []);

  const counts = {
    total: tasks.length,
    in_progress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    members: users.length,
  };

  const myTasks = tasks.filter((t) => t.assignee_id === user?.uid);
  const overdue  = tasks.filter((t) => t.status !== "done" && new Date(t.due_date) < new Date());
  const completionRate = tasks.length > 0 ? Math.round((counts.done / tasks.length) * 100) : 0;

  return (
    <AppShell>
      <PageHeader
        title={`Welcome back, ${user?.full_name?.split(" ")[0] ?? "User"}`}
        description="Here's what's happening across your workspace today"
      />

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 stagger">
        {STAT_CONFIGS.map((cfg) => (
          <div key={cfg.key} className="animate-fade-in-up">
            <StatCard
              label={cfg.label}
              value={counts[cfg.key]}
              icon={cfg.icon}
              from={cfg.from}
              to={cfg.to}
              glow={cfg.glow}
              loading={loading}
            />
          </div>
        ))}
      </div>

      {/* Overdue alert */}
      {!loading && overdue.length > 0 && (
        <div className="mb-6 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/25 animate-fade-in">
          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
          <p className="text-sm text-red-300 font-medium">
            {overdue.length} overdue task{overdue.length > 1 ? "s" : ""} — review them in the Tasks tab
          </p>
          <ArrowRight className="h-4 w-4 text-red-400 ml-auto" />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* My Tasks */}
        <Card className="lg:col-span-3">
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white">My Tasks</h3>
            <span className="text-xs text-gray-500">{myTasks.length} assigned</span>
          </div>
          <CardBody className="p-0">
            {loading ? (
              <div className="space-y-px">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center gap-3 px-5 py-3.5">
                    <div className="skeleton h-4 w-48 rounded" />
                    <div className="skeleton h-5 w-16 rounded-full ml-auto" />
                  </div>
                ))}
              </div>
            ) : myTasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <CheckCircle2 className="h-8 w-8 text-emerald-400/50 mb-2" />
                <p className="text-sm text-gray-400">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-white/[0.04]">
                {myTasks.slice(0, 6).map((task) => {
                  const isOverdue = task.status !== "done" && new Date(task.due_date) < new Date();
                  return (
                    <div key={task.id} className="flex items-center gap-3 px-5 py-3.5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{task.title}</p>
                        <p className={`text-xs mt-0.5 ${isOverdue ? "text-red-400" : "text-gray-500"}`}>
                          Due {new Date(task.due_date).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge tone={statusTone(task.status)}>{task.status.replace("_", " ")}</Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardBody>
        </Card>

        {/* Right column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Completion rate */}
          <Card>
            <CardBody>
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-4 w-4 text-emerald-400" />
                <h3 className="text-sm font-semibold text-white">Completion Rate</h3>
              </div>
              <div className="flex items-end gap-3 mb-4">
                {loading ? (
                  <div className="skeleton h-10 w-20 rounded" />
                ) : (
                  <span className="text-4xl font-bold text-white tabular-nums">{completionRate}%</span>
                )}
              </div>
              <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-1000 ease-out"
                  style={{ width: loading ? "0%" : `${completionRate}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">{counts.done} of {counts.total} tasks completed</p>
            </CardBody>
          </Card>

          {/* Task breakdown */}
          <Card className="flex-1">
            <div className="px-5 py-4 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Task Breakdown</h3>
            </div>
            <CardBody className="space-y-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="skeleton h-6 rounded" />)
              ) : (
                <>
                  <ProgressBar label="To Do"       count={tasks.filter(t=>t.status==="todo").length}        total={tasks.length} color="bg-sky-500"     />
                  <ProgressBar label="In Progress" count={tasks.filter(t=>t.status==="in_progress").length} total={tasks.length} color="bg-amber-500"   />
                  <ProgressBar label="In Review"   count={tasks.filter(t=>t.status==="review").length}      total={tasks.length} color="bg-purple-500"  />
                  <ProgressBar label="Done"        count={counts.done}                                       total={tasks.length} color="bg-emerald-500" />
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
