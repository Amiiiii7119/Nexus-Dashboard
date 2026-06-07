import {
  LayoutDashboard, ListTodo, Users, Upload, Shield, Settings,
} from "lucide-react";

export const navigation = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, group: "Overview" },
  { href: "/tasks", label: "Tasks", icon: ListTodo, group: "Work" },
  { href: "/files", label: "File Uploads", icon: Upload, group: "Work" },
  { href: "/users", label: "Users", icon: Users, group: "Management" },
  { href: "/audit", label: "Audit Log", icon: Shield, group: "Management" },
  { href: "/settings", label: "Settings", icon: Settings, group: "System" },
] as const;

export const navGroups = ["Overview", "Work", "Management", "System"] as const;
