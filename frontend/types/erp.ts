export type TaskStatus = "todo" | "in_progress" | "review" | "done";
export type TaskPriority = "low" | "medium" | "high";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee_id: string;
  team_id: string | null;
  created_by: string;
  due_date: string;
  created_at: string;
  updated_at: string;
}

export interface FileCategory {
  key: string;
  label: string;
  maxSizeMB: number;
  allowedMimes: string[];
  allowedRoles: string[];
}

export interface UploadStatus {
  cacheId: string;
  files: Array<{
    originalName: string;
    status: "pending" | "success" | "failed";
    error?: string;
  }>;
}

export interface AuditEntry {
  id: string;
  uid: string;
  email: string;
  ip_address: string;
  user_agent: string;
  result: "success" | "failure";
  reason: string | null;
  timestamp: string;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalTasks: number;
  tasksByStatus: Record<TaskStatus, number>;
  recentLogins: number;
}
