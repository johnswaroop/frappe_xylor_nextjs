// ERPNext Types
export interface ERPNextProject {
  name: string;
  project_name: string;
  status: string;
  percent_complete?: number;
  expected_end_date?: string;
  customer?: string;
  project_type?: string;
  modified: string;
}

export interface ERPNextTask {
  name: string;
  subject: string;
  status: string;
  priority?: string;
  assigned_to?: string;
  exp_start_date?: string;
  exp_end_date?: string;
  progress?: number;
  project?: string;
}

export interface ERPNextIssue {
  name: string;
  subject: string;
  status: string;
  priority?: string;
  issue_type?: string;
  assigned_to?: string;
  opening_date?: string;
  resolution_date?: string;
  project?: string;
}

export interface ERPNextCommunication {
  name: string;
  communication_type: string;
  content: string;
  sender: string;
  recipients?: string;
  reference_doctype?: string;
  reference_name?: string;
  communication_date: string;
}

// UI Types
export interface UIProject {
  id: string;
  name: string;
  status: string;
  percent_complete: number;
  expected_end_date?: string;
  customer: string;
  project_type: string;
  last_activity: string;
}

export interface UITask {
  id: string;
  subject: string;
  status: string;
  priority: "Low" | "Medium" | "High" | "Urgent";
  assigned_to: string;
  exp_start_date: string;
  exp_end_date: string;
  progress: number;
  project_id: string;
}

export interface UIIssue {
  id: string;
  subject: string;
  status: "Open" | "Replied" | "Resolved" | "Closed";
  priority: "Low" | "Medium" | "High" | "Urgent";
  issue_type: "Bug" | "Feature" | "Improvement" | "Question";
  assigned_to: string;
  opening_date: string;
  resolution_date?: string;
  project_id: string;
}

export interface UICommunication {
  id: string;
  communication_type: "Email" | "Call" | "Chat";
  content: string;
  sender: string;
  recipients: string[];
  reference_doctype: "Project" | "Task" | "Issue";
  reference_name: string;
  communication_date: string;
}
