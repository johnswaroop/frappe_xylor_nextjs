// Frappe/ERPNext API Service

// TypeScript Interfaces
export interface Project {
  name: string;
  project_name: string;
  status: string;
  percent_complete: number;
  expected_end_date: string;
  customer: string;
  project_type: string;
  project_template?: string;
  creation: string;
  modified: string;
}

export interface Task {
  name: string;
  subject: string;
  status: string;
  priority: string;
  exp_start_date: string;
  exp_end_date: string;
  progress: number;
  project: string;
  creation: string;
  modified: string;
}

export interface Issue {
  name: string;
  subject: string;
  status: string;
  priority: string;
  issue_type: string;
  opening_date: string;
  project: string;
  creation: string;
  modified: string;
}

export interface Communication {
  name: string;
  communication_type: string;
  content: string;
  sender: string;
  recipients: string[];
  reference_doctype: string;
  reference_name: string;
  communication_date: string;
  subject?: string;
  creation: string;
  modified: string;
}

export interface User {
  name: string;
  email: string;
  full_name: string;
  user_image?: string;
  enabled: number;
  creation: string;
  modified: string;
}

// API Response interfaces
interface FrappeListResponse<T> {
  data: T[];
  message?: string;
}

interface FrappeDocResponse<T> {
  data: T;
  message?: string;
}

// Base API functions
async function frappeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${endpoint}`;

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    credentials: "include", // For session-based auth
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.message || `HTTP error! status: ${response.status}`
    );
  }

  return response.json();
}

// Project API functions
export async function getProjects(): Promise<Project[]> {
  const fields = [
    "name",
    "project_name",
    "status",
    "percent_complete",
    "expected_end_date",
    "customer",
    "project_type",
    "project_template",
    "creation",
    "modified",
  ];

  const response = await frappeRequest<FrappeListResponse<Project>>(
    `/api/resource/Project?fields=${JSON.stringify(
      fields
    )}&limit_page_length=1000`
  );

  return response.data || [];
}

export async function getProject(projectId: string): Promise<Project> {
  const response = await frappeRequest<FrappeDocResponse<Project>>(
    `/api/resource/Project/${projectId}`
  );

  return response.data;
}

// Task API functions
export async function getTasks(): Promise<Task[]> {
  const fields = [
    "name",
    "subject",
    "status",
    "priority",
    "exp_start_date",
    "exp_end_date",
    "progress",
    "project",
    "creation",
    "modified",
  ];

  try {
    const response = await frappeRequest<FrappeListResponse<Task>>(
      `/api/resource/Task?fields=${JSON.stringify(
        fields
      )}&limit_page_length=1000`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
}

export async function getTasksByProject(projectId: string): Promise<Task[]> {
  const fields = [
    "name",
    "subject",
    "status",
    "priority",
    "exp_start_date",
    "exp_end_date",
    "progress",
    "project",
    "creation",
    "modified",
  ];

  try {
    const response = await frappeRequest<FrappeListResponse<Task>>(
      `/api/resource/Task?fields=${JSON.stringify(
        fields
      )}&filters=${JSON.stringify([
        ["project", "=", projectId],
      ])}&limit_page_length=1000`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching tasks by project:", error);
    throw error;
  }
}

// Issue API functions
export async function getIssues(): Promise<Issue[]> {
  const fields = [
    "name",
    "subject",
    "status",
    "priority",
    "issue_type",
    "opening_date",
    "project",
    "creation",
    "modified",
  ];

  try {
    const response = await frappeRequest<FrappeListResponse<Issue>>(
      `/api/resource/Issue?fields=${JSON.stringify(
        fields
      )}&limit_page_length=1000`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching issues:", error);
    throw error;
  }
}

export async function getIssuesByProject(projectId: string): Promise<Issue[]> {
  const fields = [
    "name",
    "subject",
    "status",
    "priority",
    "issue_type",
    "opening_date",
    "project",
    "creation",
    "modified",
  ];

  try {
    const response = await frappeRequest<FrappeListResponse<Issue>>(
      `/api/resource/Issue?fields=${JSON.stringify(
        fields
      )}&filters=${JSON.stringify([
        ["project", "=", projectId],
      ])}&limit_page_length=1000`
    );

    return response.data || [];
  } catch (error) {
    console.error("Error fetching issues by project:", error);
    throw error;
  }
}

// Communication API functions
export async function getCommunications(): Promise<Communication[]> {
  const fields = [
    "name",
    "communication_type",
    "content",
    "sender",
    "recipients",
    "reference_doctype",
    "reference_name",
    "communication_date",
    "subject",
    "creation",
    "modified",
  ];

  const response = await frappeRequest<FrappeListResponse<Communication>>(
    `/api/resource/Communication?fields=${JSON.stringify(
      fields
    )}&limit_page_length=1000`
  );

  return response.data || [];
}

export async function getCommunicationsByReference(
  doctype: string,
  name: string
): Promise<Communication[]> {
  const fields = [
    "name",
    "communication_type",
    "content",
    "sender",
    "recipients",
    "reference_doctype",
    "reference_name",
    "communication_date",
    "subject",
    "creation",
    "modified",
  ];

  const filters = JSON.stringify([
    ["reference_doctype", "=", doctype],
    ["reference_name", "=", name],
  ]);

  const response = await frappeRequest<FrappeListResponse<Communication>>(
    `/api/resource/Communication?fields=${JSON.stringify(
      fields
    )}&filters=${filters}&limit_page_length=1000`
  );

  return response.data || [];
}

// User API functions
export async function getUsers(): Promise<User[]> {
  const fields = [
    "name",
    "email",
    "full_name",
    "user_image",
    "enabled",
    "creation",
    "modified",
  ];

  const filters = JSON.stringify([["enabled", "=", 1]]);

  const response = await frappeRequest<FrappeListResponse<User>>(
    `/api/resource/User?fields=${JSON.stringify(
      fields
    )}&filters=${filters}&limit_page_length=1000`
  );

  return response.data || [];
}

export async function getCurrentUser(): Promise<User> {
  const response = await frappeRequest<{ message: User }>(
    `/api/method/frappe.auth.get_logged_user`
  );

  return response.message;
}

// Utility functions using Frappe client methods
export async function searchProjects(searchTerm: string): Promise<Project[]> {
  const response = await frappeRequest<{ message: Project[] }>(
    `/api/method/frappe.desk.search.search_widget?doctype=Project&txt=${encodeURIComponent(
      searchTerm
    )}`
  );

  return response.message || [];
}

interface ProjectSummaryResponse {
  result: unknown[];
  columns: unknown[];
  message?: string;
}

export type { ProjectSummaryResponse };

export async function getProjectSummary(
  projectId: string
): Promise<ProjectSummaryResponse> {
  const filters = JSON.stringify({ project: projectId });

  const response = await frappeRequest<ProjectSummaryResponse>(
    `/api/method/frappe.desk.query_report.run?report_name=Project%20Summary&filters=${filters}`
  );

  return response;
}
