# ERPNext Data Integration Documentation

## Overview

This document describes the complete implementation of ERPNext data integration for the AI Assistant interface. The integration replaces mock data with real ERPNext data through a comprehensive API layer, data transformation system, and React hooks.

## Testing the Integration

### Test Page

A comprehensive test page is available at `http://localhost:3000/test-api` to verify the API bridge functionality.

#### Test Features

- **React Hooks Test**: Verify all ERPNext data hooks work correctly
- **Direct API Test**: Test the Frappe client with raw API calls
- **Search Test**: Test cross-doctype search with debouncing
- **Connection Status**: Visual indicators for system connectivity

#### Quick Test Steps

1. Start ERPNext on `localhost:8000`
2. Start Next.js app on `localhost:3000`
3. Visit `http://localhost:3000/test-api`
4. Test each tab (Hooks, Direct API, Search)
5. Verify green success indicators and data loading

See `xylor/app/test-api/README.md` for detailed testing instructions.

## Architecture

### System Components

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │  Nginx Proxy    │    │    ERPNext      │
│  (localhost:3000)│◄──►│                 │◄──►│ (localhost:8000)│
│   /xylor-ai/    │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Data Flow Architecture                        │
├─────────────────────────────────────────────────────────────────┤
│ ERPNext API ──► Frappe Client ──► Data Transforms ──► React Hooks │
│                      │                    │              │      │
│                 Proxy Layer         Type Safety      UI State    │
└─────────────────────────────────────────────────────────────────┘
```

### Key Features

- **Type-Safe Integration**: Full TypeScript support for all ERPNext doctypes
- **Proxy Layer**: Next.js API routes handle CORS and authentication
- **Data Transformation**: Converts ERPNext data to UI-friendly formats
- **React Hooks**: Custom hooks with loading states and error handling
- **Search Functionality**: Cross-doctype search with debouncing
- **Real-time Ready**: Foundation for WebSocket integration

## Implementation Components

### 1. Frappe Client (`xylor/lib/frappe-client.ts`)

The core HTTP client for communicating with ERPNext API.

#### Features

- **Proxy Handling**: Automatically routes through Next.js API for client-side requests
- **Error Handling**: Comprehensive error handling with Frappe-specific error types
- **Convenience Methods**: High-level methods for common operations
- **TypeScript Support**: Full type safety for requests and responses

#### Usage Example

```typescript
import { frappeClient } from "@/lib/frappe-client";

// Get a single document
const project = await frappeClient.getDoc("Project", "PROJECT-001");

// Get a list with filters
const tasks = await frappeClient.getList("Task", {
  filters: [["project", "=", "PROJECT-001"]],
  fields: ["name", "subject", "status"],
  order_by: "modified desc",
});

// Create a new document
const newTask = await frappeClient.createDoc("Task", {
  subject: "New Task",
  project: "PROJECT-001",
  status: "Open",
});
```

### 2. Type Definitions (`xylor/lib/types/erpnext.ts`)

Comprehensive TypeScript interfaces for ERPNext doctypes and UI components.

#### ERPNext Doctypes

- `ERPNextProject`: Project doctype interface
- `ERPNextTask`: Task doctype interface
- `ERPNextIssue`: Issue doctype interface
- `ERPNextCommunication`: Communication doctype interface

#### UI Interfaces

- `UIProject`: UI-friendly project interface
- `UITask`: UI-friendly task interface
- `UIIssue`: UI-friendly issue interface
- `UICommunication`: UI-friendly communication interface

#### API Response Wrappers

- `FrappeListResponse<T>`: Wrapper for list API responses
- `FrappeDocResponse<T>`: Wrapper for single document responses

### 3. Proxy API Route (`xylor/app/api/frappe/[...path]/route.ts`)

Dynamic API route that proxies all requests to the ERPNext backend.

#### Features

- **Method Support**: Handles GET, POST, PUT, DELETE requests
- **Header Forwarding**: Forwards authentication and cookie headers
- **Query Parameters**: Preserves all query parameters
- **Error Handling**: Graceful error handling with proper status codes

#### Route Pattern

```
/api/frappe/api/resource/Project → http://localhost:8000/api/resource/Project
/api/frappe/api/method/custom → http://localhost:8000/api/method/custom
```

### 4. Data Transformations (`xylor/lib/data-transforms.ts`)

Utility functions that convert ERPNext data to UI-friendly formats.

#### Transform Functions

- `transformProject()`: Converts ERPNext project to UI format
- `transformTask()`: Converts ERPNext task to UI format
- `transformIssue()`: Converts ERPNext issue to UI format
- `transformCommunication()`: Converts ERPNext communication to UI format

#### Batch Functions

- `transformProjects()`: Batch transform for project arrays
- `transformTasks()`: Batch transform for task arrays
- `transformIssues()`: Batch transform for issue arrays
- `transformCommunications()`: Batch transform for communication arrays

#### Example Usage

```typescript
import { transformProject } from "@/lib/data-transforms";

const erpProject = await frappeClient.getDoc("Project", "PROJECT-001");
const uiProject = transformProject(erpProject);
// Now uiProject has UI-friendly field names and formats
```

### 5. React Hooks (`xylor/hooks/useERPNextData.ts`)

Custom React hooks for data fetching with built-in loading states and error handling.

#### Available Hooks

##### `useProjects()`

Fetches all projects with loading and error states.

```typescript
const { data: projects, loading, error, refetch } = useProjects();
```

##### `useTasksByProject(projectId)`

Fetches tasks filtered by project ID.

```typescript
const {
  data: tasks,
  loading,
  error,
  refetch,
} = useTasksByProject("PROJECT-001");
```

##### `useIssuesByProject(projectId)`

Fetches issues filtered by project ID.

```typescript
const {
  data: issues,
  loading,
  error,
  refetch,
} = useIssuesByProject("PROJECT-001");
```

##### `useCommunicationsByProject(projectId)`

Fetches communications filtered by project ID.

```typescript
const {
  data: communications,
  loading,
  error,
  refetch,
} = useCommunicationsByProject("PROJECT-001");
```

##### `useERPNextSearch(query)`

Performs cross-doctype search with debouncing.

```typescript
const { results, loading, error } = useERPNextSearch("urgent task");
// results contains: { projects: [], tasks: [], issues: [], communications: [] }
```

## Integration with AI Assistant

### Current State

The AI Assistant page (`xylor/app/ai-assistant/page.tsx`) currently uses mock data:

```typescript
import {
  mockProjects,
  mockTasks,
  mockIssues,
  mockCommunications,
} from "@/lib/mock-data";
```

### Integration Steps

To replace mock data with real ERPNext data:

1. **Import the hooks**:

```typescript
import {
  useProjects,
  useTasksByProject,
  useIssuesByProject,
  useCommunicationsByProject,
} from "@/hooks/useERPNextData";
```

2. **Replace mock data with hooks**:

```typescript
export default function AIAssistantPage() {
  const { data: projects, loading: projectsLoading } = useProjects();
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");

  const { data: tasks } = useTasksByProject(selectedProjectId);
  const { data: issues } = useIssuesByProject(selectedProjectId);
  const { data: communications } =
    useCommunicationsByProject(selectedProjectId);

  // Rest of component logic...
}
```

3. **Update data references**:
   Replace all instances of:

- `mockProjects` → `projects`
- `mockTasks` → `tasks`
- `mockIssues` → `issues`
- `mockCommunications` → `communications`

4. **Add loading states**:

```typescript
if (projectsLoading) {
  return <div>Loading projects...</div>;
}
```

## Data Flow Example

### Fetching Project Tasks

```typescript
// 1. Component calls hook
const { data: tasks, loading } = useTasksByProject("PROJECT-001");

// 2. Hook calls Frappe client
const response = await frappeClient.getList("Task", {
  filters: [["project", "=", "PROJECT-001"]],
});

// 3. Client makes request through proxy
fetch('/api/frappe/api/resource/Task?filters=[["project","=","PROJECT-001"]]');

// 4. Proxy forwards to ERPNext
fetch(
  'http://localhost:8000/api/resource/Task?filters=[["project","=","PROJECT-001"]]'
);

// 5. Response flows back through transformations
const transformedTasks = transformTasks(response.data);

// 6. Component receives UI-friendly data
// tasks = [{ id: 'TASK-001', subject: 'Fix bug', status: 'Open', ... }]
```

## Error Handling

### Client-Side Errors

```typescript
const { data, loading, error } = useProjects();

if (error) {
  return <div>Error loading projects: {error}</div>;
}
```

### Network Errors

The Frappe client handles network errors and provides meaningful error messages:

```typescript
try {
  const projects = await frappeClient.getList("Project");
} catch (error) {
  console.error("Failed to fetch projects:", error.message);
}
```

### Proxy Errors

The API proxy handles backend connection errors:

```typescript
// Returns 500 with error message if ERPNext is unreachable
{
  "error": "Failed to connect to ERPNext backend"
}
```

## Performance Considerations

### Caching

- React hooks use built-in state caching
- Data is refetched only when dependencies change
- Manual refetch available through `refetch()` function

### Debouncing

- Search hook includes 300ms debounce
- Prevents excessive API calls during typing

### Pagination

- List requests include `limit` parameter
- Default limit of 50 items for projects
- Configurable through hook options

## Security

### Authentication

- Proxy forwards authentication headers
- Frappe session cookies are preserved
- No sensitive data exposed to client

### Data Filtering

- All data filtering happens server-side
- Client receives only authorized data
- ERPNext permissions are respected

## Testing

### Mock Data Compatibility

The transformation layer ensures compatibility with existing mock data structure:

```typescript
// Mock data format
const mockTask = {
  id: "TASK-001",
  subject: "Fix bug",
  status: "Open",
  project_id: "PROJECT-001",
};

// Transformed ERPNext data format (identical)
const transformedTask = {
  id: "TASK-001",
  subject: "Fix bug",
  status: "Open",
  project_id: "PROJECT-001",
};
```

### Development Mode

Switch between mock and real data using environment variables:

```typescript
const USE_MOCK_DATA =
  process.env.NODE_ENV === "development" &&
  process.env.NEXT_PUBLIC_USE_MOCK_DATA === "true";

const projects = USE_MOCK_DATA ? mockProjects : useProjects().data;
```

## Troubleshooting

### Common Issues

1. **CORS Errors**

   - Ensure nginx proxy is running
   - Check proxy configuration in `/api/frappe/[...path]/route.ts`

2. **Authentication Failures**

   - Verify ERPNext session cookies
   - Check API key configuration

3. **Data Not Loading**

   - Check ERPNext backend connectivity
   - Verify doctype permissions in ERPNext
   - Check browser network tab for API errors

4. **Type Errors**
   - Ensure ERPNext field names match interface definitions
   - Check data transformation functions

### Debug Mode

Enable debug logging:

```typescript
// Add to frappe-client.ts
console.log("Frappe request:", { url, method, body });
console.log("Frappe response:", response);
```

## Future Enhancements

### Real-time Updates

- WebSocket integration for live data updates
- Real-time notifications for data changes

### Offline Support

- Service worker for offline data caching
- Sync queue for offline actions

### Advanced Filtering

- Complex filter UI components
- Saved filter presets
- Advanced search operators

### Performance Optimization

- Virtual scrolling for large lists
- Infinite scroll pagination
- Background data prefetching

## Migration Guide

### From Mock Data to ERPNext

1. **Phase 1**: Install infrastructure

   - Add Frappe client
   - Add type definitions
   - Add proxy API route

2. **Phase 2**: Add data layer

   - Add transformation functions
   - Add React hooks
   - Test data fetching

3. **Phase 3**: Update components

   - Replace mock imports
   - Add loading states
   - Handle errors

4. **Phase 4**: Optimize
   - Add caching
   - Optimize queries
   - Add real-time features

### Rollback Strategy

Keep mock data imports as fallback:

```typescript
const projects = erpNextProjects.length > 0 ? erpNextProjects : mockProjects;
```

## Conclusion

This ERPNext integration provides a robust, type-safe foundation for replacing mock data with real ERPNext data. The modular architecture allows for incremental adoption and easy maintenance while providing excellent developer experience with full TypeScript support and comprehensive error handling.

The implementation is production-ready and includes all necessary components for a complete data integration solution.
