const API_BASE = "/api";

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
      ...(init.headers ?? {}),
    },
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return body as T;
}

async function requestFormData<T>(path: string, formData: FormData): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    credentials: 'include',
    headers: { "ngrok-skip-browser-warning": "true" },
    body: formData,
  });
  const body = await res.json();
  if (!res.ok) {
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return body as T;
}

export const api = {
  // Auth
  signup: (data: { idToken: string; full_name: string; department?: string; password?: string }) =>
    request<any>("/auth/signup", { method: "POST", body: JSON.stringify({ id_token: data.idToken, full_name: data.full_name, department: data.department, password: data.password }) }),

  login: (data: { idToken: string }) =>
    request<any>("/auth/login", { method: "POST", body: JSON.stringify({ id_token: data.idToken }) }),

  logout: () =>
    request<any>("/auth/logout", { method: "POST" }),

  me: () =>
    request<any>("/auth/me"),

  // Users
  getUsers: (params?: string) =>
    request<any>(`/users${params ? `?${params}` : ""}`),

  getUser: (uid: string) =>
    request<any>(`/users/${uid}`),

  createUser: (data: any) =>
    request<any>("/users", { method: "POST", body: JSON.stringify(data) }),

  updateUser: (uid: string, data: any) =>
    request<any>(`/users/${uid}`, { method: "PATCH", body: JSON.stringify(data) }),

  deactivateUser: (uid: string) =>
    request<any>(`/users/${uid}`, { method: "DELETE" }),

  reactivateUser: (uid: string) =>
    request<any>(`/users/${uid}/reactivate`, { method: "POST" }),

  getMyProfile: () =>
    request<any>("/users/me"),

  // Tasks
  getTasks: (params?: string) =>
    request<any>(`/tasks${params ? `?${params}` : ""}`),

  getTask: (id: string) =>
    request<any>(`/tasks/${id}`),

  createTask: (data: any) =>
    request<any>("/tasks", { method: "POST", body: JSON.stringify(data) }),

  updateTask: (id: string, data: any) =>
    request<any>(`/tasks/${id}`, { method: "PATCH", body: JSON.stringify(data) }),

  deleteTask: (id: string) =>
    request<any>(`/tasks/${id}`, { method: "DELETE" }),

  // Files
  getFileCategories: () =>
    request<any>("/files/categories"),

  uploadFiles: (formData: FormData) =>
    requestFormData<any>("/files", formData),

  getUploadStatus: (cacheId: string) =>
    request<any>(`/files/status/${cacheId}`),

  // Audit
  getAuditLogs: (params?: string) =>
    request<any>(`/audit${params ? `?${params}` : ""}`),

  // Health
  health: () =>
    request<any>("/health"),
};
