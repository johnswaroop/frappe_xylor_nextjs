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
  getComments,
  getCommentsByReference,
  getActivityLogs,
  getActivityLogsByReference,
  getUsers,
  getCurrentUser,
  searchProjects,
  getProjectSummary,
  getCustomers,
  getCustomer,
  getProjectCustomer,
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

// Comments
export function useComments() {
  return useQuery({
    queryKey: ["comments"],
    queryFn: getComments,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useCommentsByReference(doctype: string, name: string) {
  return useQuery({
    queryKey: ["comments", "reference", doctype, name],
    queryFn: () => getCommentsByReference(doctype, name),
    enabled: !!(doctype && name),
    staleTime: 1 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Activity Logs
export function useActivityLogs() {
  return useQuery({
    queryKey: ["activityLogs"],
    queryFn: getActivityLogs,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

export function useActivityLogsByReference(doctype: string, name: string) {
  return useQuery({
    queryKey: ["activityLogs", "reference", doctype, name],
    queryFn: () => getActivityLogsByReference(doctype, name),
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
  const commentsQuery = useCommentsByReference("Project", projectId);
  const activityLogsQuery = useActivityLogsByReference("Project", projectId);

  return {
    project: projectQuery,
    tasks: tasksQuery,
    issues: issuesQuery,
    communications: communicationsQuery,
    comments: commentsQuery,
    activityLogs: activityLogsQuery,
    isLoading:
      projectQuery.isLoading ||
      tasksQuery.isLoading ||
      issuesQuery.isLoading ||
      communicationsQuery.isLoading ||
      commentsQuery.isLoading ||
      activityLogsQuery.isLoading,
    isError:
      projectQuery.isError ||
      tasksQuery.isError ||
      issuesQuery.isError ||
      communicationsQuery.isError ||
      commentsQuery.isError ||
      activityLogsQuery.isError,
    error:
      projectQuery.error ||
      tasksQuery.error ||
      issuesQuery.error ||
      communicationsQuery.error ||
      commentsQuery.error ||
      activityLogsQuery.error,
  };
}

export function useAllData() {
  const projectsQuery = useProjects();
  const tasksQuery = useTasks();
  const issuesQuery = useIssues();
  const communicationsQuery = useCommunications();
  const commentsQuery = useComments();
  const activityLogsQuery = useActivityLogs();
  const usersQuery = useUsers();

  return {
    projects: projectsQuery,
    tasks: tasksQuery,
    issues: issuesQuery,
    communications: communicationsQuery,
    comments: commentsQuery,
    activityLogs: activityLogsQuery,
    users: usersQuery,
    isLoading:
      projectsQuery.isLoading ||
      tasksQuery.isLoading ||
      issuesQuery.isLoading ||
      communicationsQuery.isLoading ||
      commentsQuery.isLoading ||
      activityLogsQuery.isLoading ||
      usersQuery.isLoading,
    isError:
      projectsQuery.isError ||
      tasksQuery.isError ||
      issuesQuery.isError ||
      communicationsQuery.isError ||
      commentsQuery.isError ||
      activityLogsQuery.isError ||
      usersQuery.isError,
    error:
      projectsQuery.error ||
      tasksQuery.error ||
      issuesQuery.error ||
      communicationsQuery.error ||
      commentsQuery.error ||
      activityLogsQuery.error ||
      usersQuery.error,
  };
}

// Comprehensive data hook that returns all project data as JSON for AI context
export function useAllProjectDataAsJSON() {
  const projectsQuery = useProjects();
  const tasksQuery = useTasks();
  const issuesQuery = useIssues();
  const communicationsQuery = useCommunications();
  const commentsQuery = useComments();
  const activityLogsQuery = useActivityLogs();
  const usersQuery = useUsers();

  return useQuery({
    queryKey: ["all-data-json"],
    queryFn: () => {
      // Combine all data into a structured JSON format
      return {
        projects: projectsQuery.data || [],
        tasks: tasksQuery.data || [],
        issues: issuesQuery.data || [],
        communications: communicationsQuery.data || [],
        comments: commentsQuery.data || [],
        activityLogs: activityLogsQuery.data || [],
        users: usersQuery.data || [],
        summary: {
          totalProjects: (projectsQuery.data || []).length,
          totalTasks: (tasksQuery.data || []).length,
          totalIssues: (issuesQuery.data || []).length,
          totalCommunications: (communicationsQuery.data || []).length,
          totalComments: (commentsQuery.data || []).length,
          totalActivityLogs: (activityLogsQuery.data || []).length,
          totalUsers: (usersQuery.data || []).length,
        },
      };
    },
    enabled:
      !projectsQuery.isLoading &&
      !tasksQuery.isLoading &&
      !issuesQuery.isLoading &&
      !communicationsQuery.isLoading &&
      !commentsQuery.isLoading &&
      !activityLogsQuery.isLoading &&
      !usersQuery.isLoading &&
      !projectsQuery.isError &&
      !tasksQuery.isError &&
      !issuesQuery.isError &&
      !communicationsQuery.isError &&
      !commentsQuery.isError &&
      !activityLogsQuery.isError &&
      !usersQuery.isError,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
}

// Specialized hook for getting all project activities (comments, communications, activity logs)
export function useProjectActivities(projectId: string) {
  const communicationsQuery = useCommunicationsByReference(
    "Project",
    projectId
  );
  const commentsQuery = useCommentsByReference("Project", projectId);
  const activityLogsQuery = useActivityLogsByReference("Project", projectId);

  return useQuery({
    queryKey: ["project", projectId, "activities"],
    queryFn: () => {
      const communications = communicationsQuery.data || [];
      const comments = commentsQuery.data || [];
      const activityLogs = activityLogsQuery.data || [];

      // Combine all activities with a unified structure
      const allActivities = [
        ...communications.map((comm) => ({
          id: comm.name,
          type: "communication" as const,
          content: comm.content,
          subject: comm.subject,
          author: comm.sender,
          date: comm.communication_date,
          raw: comm,
        })),
        ...comments.map((comment) => ({
          id: comment.name,
          type: "comment" as const,
          content: comment.content,
          subject: null,
          author: comment.comment_by,
          date: comment.creation,
          raw: comment,
        })),
        ...activityLogs.map((log) => ({
          id: log.name,
          type: "activity_log" as const,
          content: log.content || log.subject,
          subject: log.subject,
          author: log.user,
          date: log.creation,
          raw: log,
        })),
      ];

      // Sort by date (newest first)
      return allActivities.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    },
    enabled:
      !!projectId &&
      !communicationsQuery.isLoading &&
      !commentsQuery.isLoading &&
      !activityLogsQuery.isLoading,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  });
}

// Enhanced hooks for getting emails and customer data
export function useProjectEmails(projectId: string) {
  const projectQuery = useProject(projectId);
  const usersQuery = useUsers();

  return useQuery({
    queryKey: ["project", projectId, "emails"],
    queryFn: async () => {
      const project = projectQuery.data;
      const users = usersQuery.data || [];

      if (!project) return null;

      // Get emails of users associated with the project
      // You might need to enhance this based on how user-project relationships are stored in Frappe
      const projectEmails = {
        customer: project.customer, // This might need to be resolved to actual email
        teamEmails: users
          .map((user) => ({
            name: user.full_name,
            email: user.email,
            enabled: user.enabled,
          }))
          .filter((user) => user.enabled), // Only active users
      };

      return projectEmails;
    },
    enabled: !!projectQuery.data && !!usersQuery.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

export function useActiveUserEmails() {
  return useQuery({
    queryKey: ["users", "emails", "active"],
    queryFn: async () => {
      const users = await getUsers();
      return users
        .filter((user) => user.enabled === 1)
        .map((user) => ({
          name: user.full_name,
          email: user.email,
          userId: user.name,
        }));
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    refetchOnWindowFocus: false,
  });
}

// Customer hooks
export function useCustomers() {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getCustomers,
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });
}

export function useCustomer(customerId: string) {
  return useQuery({
    queryKey: ["customer", customerId],
    queryFn: () => getCustomer(customerId),
    enabled: !!customerId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useProjectCustomer(projectId: string) {
  return useQuery({
    queryKey: ["project", projectId, "customer"],
    queryFn: () => getProjectCustomer(projectId),
    enabled: !!projectId,
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

// Enhanced project emails hook with customer data
export function useProjectEmailsComplete(projectId: string) {
  const projectQuery = useProject(projectId);
  const usersQuery = useUsers();
  const customerQuery = useProjectCustomer(projectId);

  return useQuery({
    queryKey: ["project", projectId, "emails", "complete"],
    queryFn: async () => {
      const project = projectQuery.data;
      const users = usersQuery.data || [];
      const customer = customerQuery.data;

      if (!project) return null;

      // Get all email contacts for this project
      return {
        project: {
          name: project.project_name,
          id: project.name,
        },
        customer: customer
          ? {
              name: customer.customer_name,
              email: customer.email_id || null,
              phone: customer.phone || customer.mobile_no || null,
            }
          : null,
        teamEmails: users
          .filter((user) => user.enabled === 1)
          .map((user) => ({
            name: user.full_name,
            email: user.email,
            userId: user.name,
          })),
        allEmails: [
          // Customer email if available
          ...(customer?.email_id ? [customer.email_id] : []),
          // All active user emails
          ...users
            .filter((user) => user.enabled === 1)
            .map((user) => user.email),
        ].filter(Boolean), // Remove any null/undefined emails
      };
    },
    enabled: !!projectQuery.data && !!usersQuery.data,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}
