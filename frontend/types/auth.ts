import { z } from "zod";

export const SignInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
export type SignInInput = z.infer<typeof SignInSchema>;

export const SignUpSchema = z.object({
  name: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  department: z.string().min(1, "Department is required"),
});
export type SignUpInput = z.infer<typeof SignUpSchema>;

export const LoginSchema = SignInSchema;
export type LoginInput = SignInInput;

export type Role = "super_admin" | "admin" | "team_lead" | "employee" | "intern";

export interface User {
  uid: string;
  email: string;
  full_name: string;
  role: Role;
  team_id: string | null;
  department: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  ok: true;
  user: User;
  token: string;
}

export interface ErrorResponse {
  ok: false;
  error: string;
}
