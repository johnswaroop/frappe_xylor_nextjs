// Mock data for ERPNext entities

export interface ERPNextProject {
  id: string;
  name: string;
  status: "Open" | "Completed" | "Cancelled";
  percent_complete: number;
  expected_end_date: string;
  customer: string;
  project_type: string;
  last_activity: string;
}

export interface ERPNextTask {
  id: string;
  subject: string;
  status:
    | "Open"
    | "Working"
    | "Pending Review"
    | "Overdue"
    | "Template"
    | "Completed"
    | "Cancelled";
  priority: "Low" | "Medium" | "High" | "Urgent";
  assigned_to: string;
  exp_start_date: string;
  exp_end_date: string;
  progress: number;
  project_id: string;
}

export interface ERPNextIssue {
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

export interface ERPNextCommunication {
  id: string;
  communication_type: "Email" | "Call" | "Chat";
  content: string;
  sender: string;
  recipients: string[];
  reference_doctype: "Project" | "Task" | "Issue";
  reference_name: string;
  communication_date: string;
}

export interface TaggedContext {
  type: "project" | "task" | "issue" | "communication";
  id: string;
  name: string;
}

// Mock data
export const mockProjects: ERPNextProject[] = [
  {
    id: "proj-001",
    name: "Website Redesign",
    status: "Open",
    percent_complete: 65,
    expected_end_date: "2024-02-15",
    customer: "Acme Corp",
    project_type: "External",
    last_activity: "2024-01-10T14:30:00Z",
  },
  {
    id: "proj-002",
    name: "Mobile App Development",
    status: "Open",
    percent_complete: 30,
    expected_end_date: "2024-03-30",
    customer: "TechStart Inc",
    project_type: "External",
    last_activity: "2024-01-09T16:45:00Z",
  },
  {
    id: "proj-003",
    name: "ERP Implementation",
    status: "Open",
    percent_complete: 85,
    expected_end_date: "2024-01-25",
    customer: "Global Solutions",
    project_type: "Internal",
    last_activity: "2024-01-11T09:15:00Z",
  },
];

export const mockTasks: ERPNextTask[] = [
  {
    id: "task-001",
    subject: "Design Homepage Layout",
    status: "Completed",
    priority: "High",
    assigned_to: "john.doe@company.com",
    exp_start_date: "2024-01-01",
    exp_end_date: "2024-01-05",
    progress: 100,
    project_id: "proj-001",
  },
  {
    id: "task-002",
    subject: "Implement User Authentication",
    status: "Working",
    priority: "High",
    assigned_to: "jane.smith@company.com",
    exp_start_date: "2024-01-06",
    exp_end_date: "2024-01-12",
    progress: 75,
    project_id: "proj-001",
  },
  {
    id: "task-003",
    subject: "Setup Database Schema",
    status: "Overdue",
    priority: "Urgent",
    assigned_to: "bob.wilson@company.com",
    exp_start_date: "2024-01-03",
    exp_end_date: "2024-01-08",
    progress: 40,
    project_id: "proj-001",
  },
  {
    id: "task-004",
    subject: "Mobile UI Framework Setup",
    status: "Open",
    priority: "Medium",
    assigned_to: "alice.brown@company.com",
    exp_start_date: "2024-01-15",
    exp_end_date: "2024-01-20",
    progress: 0,
    project_id: "proj-002",
  },
  {
    id: "task-005",
    subject: "API Integration Testing",
    status: "Working",
    priority: "High",
    assigned_to: "charlie.davis@company.com",
    exp_start_date: "2024-01-08",
    exp_end_date: "2024-01-15",
    progress: 60,
    project_id: "proj-002",
  },
];

export const mockIssues: ERPNextIssue[] = [
  {
    id: "issue-001",
    subject: "Login page not responsive on mobile",
    status: "Open",
    priority: "High",
    issue_type: "Bug",
    assigned_to: "jane.smith@company.com",
    opening_date: "2024-01-10T10:30:00Z",
    project_id: "proj-001",
  },
  {
    id: "issue-002",
    subject: "Add dark mode toggle",
    status: "Replied",
    priority: "Medium",
    issue_type: "Feature",
    assigned_to: "john.doe@company.com",
    opening_date: "2024-01-09T14:15:00Z",
    project_id: "proj-001",
  },
  {
    id: "issue-003",
    subject: "Database connection timeout",
    status: "Resolved",
    priority: "Urgent",
    issue_type: "Bug",
    assigned_to: "bob.wilson@company.com",
    opening_date: "2024-01-08T09:45:00Z",
    resolution_date: "2024-01-09T16:30:00Z",
    project_id: "proj-001",
  },
  {
    id: "issue-004",
    subject: "App crashes on iOS 15",
    status: "Open",
    priority: "High",
    issue_type: "Bug",
    assigned_to: "alice.brown@company.com",
    opening_date: "2024-01-11T11:20:00Z",
    project_id: "proj-002",
  },
];

export const mockCommunications: ERPNextCommunication[] = [
  {
    id: "comm-001",
    communication_type: "Email",
    content:
      "Hi team, please review the latest homepage designs. The client has requested some changes to the color scheme and wants to see a darker theme option.",
    sender: "client@acmecorp.com",
    recipients: ["john.doe@company.com", "jane.smith@company.com"],
    reference_doctype: "Project",
    reference_name: "proj-001",
    communication_date: "2024-01-10T14:30:00Z",
  },
  {
    id: "comm-002",
    communication_type: "Call",
    content:
      "Call with client regarding mobile responsiveness issues. Duration: 45 minutes. Key points: Need to prioritize mobile-first design, fix login page issues by end of week.",
    sender: "jane.smith@company.com",
    recipients: ["client@acmecorp.com"],
    reference_doctype: "Issue",
    reference_name: "issue-001",
    communication_date: "2024-01-10T16:00:00Z",
  },
  {
    id: "comm-003",
    communication_type: "Chat",
    content:
      "Quick sync on database schema. Bob mentioned the connection timeout issue has been resolved. Moving forward with the authentication implementation.",
    sender: "john.doe@company.com",
    recipients: ["bob.wilson@company.com", "jane.smith@company.com"],
    reference_doctype: "Task",
    reference_name: "task-002",
    communication_date: "2024-01-09T10:15:00Z",
  },
  {
    id: "comm-004",
    communication_type: "Email",
    content:
      "Project status update: We are 65% complete with the website redesign. The homepage design is finalized and authentication system is in progress. Expected completion by Feb 15th.",
    sender: "john.doe@company.com",
    recipients: ["client@acmecorp.com", "manager@company.com"],
    reference_doctype: "Project",
    reference_name: "proj-001",
    communication_date: "2024-01-11T09:00:00Z",
  },
];
