import type {
  ERPNextProject,
  ERPNextTask,
  ERPNextIssue,
  ERPNextCommunication,
  UIProject,
  UITask,
  UIIssue,
  UICommunication,
} from "../lib/types/erpnext";

// Transform ERPNext Project to UI Project format
export function transformProject(erpProject: ERPNextProject): UIProject {
  return {
    id: erpProject.name,
    name: erpProject.project_name,
    status: erpProject.status,
    percent_complete: erpProject.percent_complete || 0,
    expected_end_date: erpProject.expected_end_date,
    customer: erpProject.customer || "Unknown",
    project_type: erpProject.project_type || "External",
    last_activity: erpProject.modified,
  };
}

// Transform ERPNext Task to UI Task format
export function transformTask(erpTask: ERPNextTask): UITask {
  const isValidPriority = (
    priority: string
  ): priority is "Low" | "Medium" | "High" | "Urgent" => {
    return ["Low", "Medium", "High", "Urgent"].includes(priority);
  };

  const priority = erpTask.priority || "Medium";
  if (!isValidPriority(priority)) {
    throw new Error(`Invalid priority value: ${priority}`);
  }

  return {
    id: erpTask.name,
    subject: erpTask.subject,
    status: erpTask.status,
    priority,
    assigned_to: erpTask.assigned_to || "Unassigned",
    exp_start_date:
      erpTask.exp_start_date || new Date().toISOString().split("T")[0],
    exp_end_date:
      erpTask.exp_end_date || new Date().toISOString().split("T")[0],
    progress: erpTask.progress || 0,
    project_id: erpTask.project || "",
  };
}

// Transform ERPNext Issue to UI Issue format
export function transformIssue(erpIssue: ERPNextIssue): UIIssue {
  // Map ERPNext issue status to UI status
  const mapIssueStatus = (
    status: string
  ): "Open" | "Replied" | "Resolved" | "Closed" => {
    switch (status) {
      case "On Hold":
        return "Open";
      default:
        return status as "Open" | "Replied" | "Resolved" | "Closed";
    }
  };

  // Map priority to standard format
  const mapPriority = (
    priority?: string
  ): "Low" | "Medium" | "High" | "Urgent" => {
    if (!priority) return "Medium";
    return priority as "Low" | "Medium" | "High" | "Urgent";
  };

  // Map issue type to standard format
  const mapIssueType = (
    issueType?: string
  ): "Bug" | "Feature" | "Improvement" | "Question" => {
    if (!issueType) return "Bug";
    switch (issueType.toLowerCase()) {
      case "feature request":
        return "Feature";
      case "enhancement":
        return "Improvement";
      case "support":
        return "Question";
      default:
        return issueType as "Bug" | "Feature" | "Improvement" | "Question";
    }
  };

  return {
    id: erpIssue.name,
    subject: erpIssue.subject,
    status: mapIssueStatus(erpIssue.status),
    priority: mapPriority(erpIssue.priority),
    issue_type: mapIssueType(erpIssue.issue_type),
    assigned_to: erpIssue.assigned_to || "Unassigned",
    opening_date:
      erpIssue.opening_date || new Date().toISOString().split("T")[0],
    resolution_date: erpIssue.resolution_date,
    project_id: erpIssue.project || "",
  };
}

// Transform ERPNext Communication to UI Communication format
export function transformCommunication(
  erpComm: ERPNextCommunication
): UICommunication {
  // Map communication type to UI format
  const mapCommType = (type: string): "Email" | "Call" | "Chat" => {
    switch (type) {
      case "Comment":
        return "Chat";
      default:
        return type as "Email" | "Call" | "Chat";
    }
  };

  // Parse recipients from string to array
  const parseRecipients = (recipients?: string): string[] => {
    if (!recipients) return [];
    try {
      // Try to parse as JSON array first
      const parsed = JSON.parse(recipients);
      return Array.isArray(parsed) ? parsed : [recipients];
    } catch {
      // If not JSON, split by comma
      return recipients
        .split(",")
        .map((r) => r.trim())
        .filter((r) => r);
    }
  };

  return {
    id: erpComm.name,
    communication_type: mapCommType(erpComm.communication_type),
    content: erpComm.content,
    sender: erpComm.sender,
    recipients: parseRecipients(erpComm.recipients),
    reference_doctype:
      (erpComm.reference_doctype as "Project" | "Task" | "Issue") || "Project",
    reference_name: erpComm.reference_name || "",
    communication_date: erpComm.communication_date,
  };
}

// Batch transform functions
export function transformProjects(erpProjects: ERPNextProject[]): UIProject[] {
  return erpProjects.map(transformProject);
}

export function transformTasks(erpTasks: ERPNextTask[]): UITask[] {
  return erpTasks.map(transformTask);
}

export function transformIssues(erpIssues: ERPNextIssue[]): UIIssue[] {
  return erpIssues.map(transformIssue);
}

export function transformCommunications(
  erpComms: ERPNextCommunication[]
): UICommunication[] {
  return erpComms.map(transformCommunication);
}
