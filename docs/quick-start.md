# ERPNext Integration Quick Start Guide

## 🚀 Quick Setup

### 1. Import the Hooks

```typescript
import {
  useProjects,
  useTasksByProject,
  useIssuesByProject,
  useCommunicationsByProject,
  useERPNextSearch,
} from "@/hooks/useERPNextData";
```

### 2. Replace Mock Data

```typescript
// Before (using mock data)
import { mockProjects, mockTasks } from "@/lib/mock-data";

// After (using ERPNext data)
export default function MyComponent() {
  const { data: projects, loading, error } = useProjects();
  const { data: tasks } = useTasksByProject(selectedProjectId);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {projects.map((project) => (
        <div key={project.id}>{project.name}</div>
      ))}
    </div>
  );
}
```

## 📊 Available Data Hooks

| Hook                             | Purpose                    | Returns                                                |
| -------------------------------- | -------------------------- | ------------------------------------------------------ |
| `useProjects()`                  | All projects               | `{ data: UIProject[], loading, error, refetch }`       |
| `useTasksByProject(id)`          | Tasks for project          | `{ data: UITask[], loading, error, refetch }`          |
| `useIssuesByProject(id)`         | Issues for project         | `{ data: UIIssue[], loading, error, refetch }`         |
| `useCommunicationsByProject(id)` | Communications for project | `{ data: UICommunication[], loading, error, refetch }` |
| `useERPNextSearch(query)`        | Cross-doctype search       | `{ results: {...}, loading, error }`                   |

## 🔄 Data Flow

```
Component → Hook → Frappe Client → API Proxy → ERPNext
    ↑                                              ↓
UI Data ← Transform ← Response ← JSON ← HTTP Response
```

## 🎯 Common Patterns

### Loading States

```typescript
const { data, loading, error } = useProjects();

if (loading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
```

### Project Selection

```typescript
const [selectedProject, setSelectedProject] = useState<string>("");
const { data: tasks } = useTasksByProject(selectedProject);
const { data: issues } = useIssuesByProject(selectedProject);
```

### Search with Debouncing

```typescript
const [searchQuery, setSearchQuery] = useState("");
const { results, loading } = useERPNextSearch(searchQuery);
// Automatically debounced by 300ms
```

### Manual Refetch

```typescript
const { data, refetch } = useProjects();

const handleRefresh = () => {
  refetch(); // Manually refresh data
};
```

## 🔧 Direct API Usage

```typescript
import { frappeClient } from "@/lib/frappe-client";

// Get single document
const project = await frappeClient.getDoc("Project", "PROJECT-001");

// Get filtered list
const tasks = await frappeClient.getList("Task", {
  filters: [["status", "=", "Open"]],
  fields: ["name", "subject", "status"],
  limit: 10,
});

// Create document
const newTask = await frappeClient.createDoc("Task", {
  subject: "New Task",
  status: "Open",
});
```

## 🎨 UI Integration Example

```typescript
export default function ProjectDashboard() {
  const { data: projects, loading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState("");

  const { data: tasks } = useTasksByProject(selectedProjectId);
  const { data: issues } = useIssuesByProject(selectedProjectId);

  return (
    <div className="dashboard">
      <ProjectSelector
        projects={projects}
        selected={selectedProjectId}
        onSelect={setSelectedProjectId}
        loading={loading}
      />

      {selectedProjectId && (
        <div className="project-details">
          <TaskList tasks={tasks} />
          <IssueList issues={issues} />
        </div>
      )}
    </div>
  );
}
```

## 🐛 Troubleshooting

### Data Not Loading

1. Check ERPNext is running on `localhost:8000`
2. Verify nginx proxy configuration
3. Check browser network tab for API errors
4. Ensure ERPNext permissions are set correctly

### Type Errors

1. Verify ERPNext field names match interface definitions
2. Check data transformation functions
3. Ensure proper TypeScript imports

### Performance Issues

1. Use project-specific hooks instead of loading all data
2. Implement pagination for large datasets
3. Consider caching strategies

## 📚 Full Documentation

For complete implementation details, see:

- [ERPNext Integration Implementation Guide](./erpnext-integration.md)
- [Frappe API Documentation](./api.frappe.md)

## 🔄 Migration Checklist

- [ ] Install ERPNext integration infrastructure
- [ ] Replace mock data imports with hooks
- [ ] Add loading states to components
- [ ] Add error handling
- [ ] Test data fetching
- [ ] Verify UI compatibility
- [ ] Add search functionality
- [ ] Optimize performance
