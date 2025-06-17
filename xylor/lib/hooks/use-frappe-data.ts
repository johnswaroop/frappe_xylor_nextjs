import { useQuery } from "@tanstack/react-query";
import {
  getProjects,
  getProject,
  getTasks,
  getTasksByProject,
  getIssues,
  getIssuesByProject,
  getCommunications,
  getCommunicationsByReference,
  getUsers,
  getCurrentUser,
  searchProjects,
  getProjectSummary,
} from "@/lib/api/frappe";

// Projects
export function useProjects() {
  return useQuery({
    queryKey: ["projects"],
    queryFn: getProjects,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

export function useProject(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId],
    queryFn: () => getProject(projectId),
    enabled: !!projectId,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useProjectSearch(searchTerm: string) {
  return useQuery({
    queryKey: ["projects", "search", searchTerm],
    queryFn: () => searchProjects(searchTerm),
    enabled: searchTerm.length > 2,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

export function useProjectSummary(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId, "summary"],
    queryFn: () => getProjectSummary(projectId),
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Tasks
export function useTasks() {
  return useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

export function useTasksByProject(projectId: string) {
  return useQuery({
    queryKey: ["tasks", "project", projectId],
    queryFn: () => getTasksByProject(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Issues
export function useIssues() {
  return useQuery({
    queryKey: ["issues"],
    queryFn: getIssues,
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false,
  });
}

export function useIssuesByProject(projectId: string) {
  return useQuery({
    queryKey: ["issues", "project", projectId],
    queryFn: () => getIssuesByProject(projectId),
    enabled: !!projectId,
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Communications
export function useCommunications() {
  return useQuery({
    queryKey: ["communications"],
    queryFn: getCommunications,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useCommunicationsByReference(doctype: string, name: string) {
  return useQuery({
    queryKey: ["communications", "reference", doctype, name],
    queryFn: () => getCommunicationsByReference(doctype, name),
    enabled: !!(doctype && name),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Users
export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ["user", "current"],
    queryFn: getCurrentUser,
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false,
  });
}

// Combined data hooks for convenience
export function useProjectData(projectId: string) {
  const projectQuery = useProject(projectId);
  const tasksQuery = useTasksByProject(projectId);
  const issuesQuery = useIssuesByProject(projectId);
  const communicationsQuery = useCommunicationsByReference(
    "Project",
    projectId
  );

  return {
    project: projectQuery,
    tasks: tasksQuery,
    issues: issuesQuery,
    communications: communicationsQuery,
    isLoading:
      projectQuery.isLoading ||
      tasksQuery.isLoading ||
      issuesQuery.isLoading ||
      communicationsQuery.isLoading,
    isError:
      projectQuery.isError ||
      tasksQuery.isError ||
      issuesQuery.isError ||
      communicationsQuery.isError,
    error:
      projectQuery.error ||
      tasksQuery.error ||
      issuesQuery.error ||
      communicationsQuery.error,
  };
}

export function useAllData() {
  const projectsQuery = useProjects();
  const tasksQuery = useTasks();
  const issuesQuery = useIssues();
  const communicationsQuery = useCommunications();
  const usersQuery = useUsers();

  return {
    projects: projectsQuery,
    tasks: tasksQuery,
    issues: issuesQuery,
    communications: communicationsQuery,
    users: usersQuery,
    isLoading:
      projectsQuery.isLoading ||
      tasksQuery.isLoading ||
      issuesQuery.isLoading ||
      communicationsQuery.isLoading ||
      usersQuery.isLoading,
    isError:
      projectsQuery.isError ||
      tasksQuery.isError ||
      issuesQuery.isError ||
      communicationsQuery.isError ||
      usersQuery.isError,
    error:
      projectsQuery.error ||
      tasksQuery.error ||
      issuesQuery.error ||
      communicationsQuery.error ||
      usersQuery.error,
  };
}
