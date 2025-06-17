# Frappe API Client Implementation Guide

A comprehensive guide to the TypeScript-first Frappe API client with dual authentication strategies for Next.js applications.

## 🏗️ Architecture Overview

The Frappe API client is built with a **clear separation of concerns** between user-context and system-level operations:

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js Application                     │
├─────────────────────────────────────────────────────────────┤
│  👤 User Client           │    🔧 Server Client            │
│  Session-Based Auth       │    API Key/Secret Auth         │
│  ├─ User Context          │    ├─ System Level Access      │
│  ├─ Permission Filtered   │    ├─ Cross-User Operations    │
│  └─ Client-Side Safe      │    └─ Server-Side Only         │
├─────────────────────────────────────────────────────────────┤
│                    Base Client                              │
│         (Shared HTTP handling, error management)            │
├─────────────────────────────────────────────────────────────┤
│                    Nginx Proxy                             │
│              (Routes /xylor-ai/ to :3000)                  │
├─────────────────────────────────────────────────────────────┤
│                 Frappe/ERPNext                              │
│                  (localhost:8000)                           │
└─────────────────────────────────────────────────────────────┘
```

## 📁 File Structure

```
xylor/lib/api/
├── types.ts           # TypeScript interfaces & response types
├── base-client.ts     # Abstract base class with shared functionality
├── user-client.ts     # 👤 User-context client (session auth)
├── server-client.ts   # 🔧 System-level client (API key auth)
├── index.ts          # Factory functions & public exports
└── README.md         # Usage documentation
```

## 🔑 Authentication Strategies

### 1. Session-Based Authentication (User Client)

**How it works:**

- Uses HTTP cookies for authentication
- Leverages existing ERPNext login session
- Frappe automatically identifies the current user
- All operations respect user permissions

**Implementation:**

```typescript
// User client automatically includes cookies
protected async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  return super.makeRequest<T>(endpoint, {
    ...options,
    credentials: 'include', // Always include cookies
  });
}

protected getHeaders(): Record<string, string> {
  return {
    'X-Requested-With': 'XMLHttpRequest', // CSRF protection
  };
}
```

**Use Cases:**

- Client-side operations
- User-specific data fetching
- Permission-aware operations
- Interactive user workflows

### 2. API Key/Secret Authentication (Server Client)

**How it works:**

- Uses API Key and Secret for authentication
- Bypasses user permissions (system-level access)
- Suitable for administrative operations
- Should never be exposed to client-side

**Implementation:**

```typescript
protected getHeaders(): Record<string, string> {
  const token = `${this.apiKey}:${this.apiSecret}`;
  return {
    'Authorization': `token ${token}`,
  };
}
```

**Use Cases:**

- Server-side API routes
- Administrative operations
- Cross-user data access
- Background jobs and integrations

## 🚀 Implementation Details

### Base Client Architecture

The `BaseFrappeClient` provides shared functionality:

```typescript
export abstract class BaseFrappeClient {
  protected baseURL: string;
  protected timeout: number;

  // Abstract method implemented by child classes
  protected abstract getHeaders(): Record<string, string>;

  // Shared HTTP request handling
  protected async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T>;

  // Common CRUD operations
  async getDoc<T>(doctype: string, name: string): Promise<T>;
  async getList<T>(
    doctype: string,
    options: FrappeQueryOptions = {}
  ): Promise<FrappeListResponse<T>>;
  async createDoc<T>(doctype: string, data: Partial<T>): Promise<T>;
  async updateDoc<T>(
    doctype: string,
    name: string,
    data: Partial<T>
  ): Promise<T>;
  async deleteDoc(doctype: string, name: string): Promise<void>;
  async callMethod<T>(options: FrappeMethodOptions): Promise<T>;
}
```

### Error Handling Strategy

Custom error class with detailed Frappe-specific information:

```typescript
export class FrappeAPIError extends Error {
  public readonly statusCode: number;
  public readonly frappeError?: FrappeError;

  constructor(message: string, statusCode: number, frappeError?: FrappeError) {
    super(message);
    this.name = "FrappeAPIError";
    this.statusCode = statusCode;
    this.frappeError = frappeError;
  }
}
```

**Error handling in practice:**

```typescript
try {
  const user = await userClient.getCurrentUser();
} catch (error) {
  if (error instanceof FrappeAPIError) {
    console.error("Frappe Error:", error.message);
    console.error("Status Code:", error.statusCode);
    console.error("Frappe Details:", error.frappeError);
  }
}
```

## 🎯 Usage Patterns

### Pattern 1: User-Context Operations

**Scenario:** Getting data specific to the logged-in user

```typescript
import { createUserClient } from "@/lib/api";

const userClient = createUserClient({
  baseURL: "http://localhost:8000",
});

// Frappe automatically knows who's logged in
const currentUser = await userClient.getCurrentUser();

// Get documents assigned to current user
const myTasks = await userClient.getMyAssignedDocs("Task");

// Get documents created by current user
const myCustomers = await userClient.getMyCreatedDocs("Customer");

// Check user permissions
const canManageSales = await userClient.hasRole("Sales Manager");
```

### Pattern 2: System-Level Operations

**Scenario:** Administrative operations requiring system access

```typescript
import { createServerClient } from "@/lib/api";

const serverClient = createServerClient({
  baseURL: "http://localhost:8000",
  apiKey: process.env.FRAPPE_API_KEY!,
  apiSecret: process.env.FRAPPE_API_SECRET!,
});

// Get all users in the system
const allUsers = await serverClient.getAllUsers();

// Create a new user with roles
const newUser = await serverClient.createUser({
  email: "newuser@example.com",
  first_name: "John",
  roles: ["Sales User", "Customer"],
});

// Get documents for any specific user
const userDocs = await serverClient.getDocsForUser("Task", "user@example.com");
```

### Pattern 3: Hybrid Approach in Next.js

**Client-side component:**

```typescript
"use client";
import { createUserClient } from "@/lib/api";
import { useEffect, useState } from "react";

export function UserDashboard() {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const client = createUserClient({ baseURL: "http://localhost:8000" });

    const loadUserData = async () => {
      try {
        const currentUser = await client.getCurrentUser();
        const userTasks = await client.getMyAssignedDocs("Task");

        setUser(currentUser);
        setTasks(userTasks.data);
      } catch (error) {
        console.error("Failed to load user data:", error);
      }
    };

    loadUserData();
  }, []);

  return (
    <div>
      <h1>Welcome, {user?.full_name}</h1>
      <h2>Your Tasks ({tasks.length})</h2>
      {/* Render tasks */}
    </div>
  );
}
```

**Server-side API route:**

```typescript
// app/api/admin/users/route.ts
import { createServerClient } from "@/lib/api";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const serverClient = createServerClient({
      baseURL: "http://localhost:8000",
      apiKey: process.env.FRAPPE_API_KEY!,
      apiSecret: process.env.FRAPPE_API_SECRET!,
    });

    const users = await serverClient.getAllUsers({
      fields: ["name", "email", "full_name", "enabled"],
      limit_page_length: 50,
    });

    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
```

## 🔧 Configuration & Setup

### Environment Variables

```bash
# .env.local
FRAPPE_API_KEY=your_api_key_here
FRAPPE_API_SECRET=your_api_secret_here
FRAPPE_BASE_URL=http://localhost:8000  # Optional, defaults to localhost:8000
```

### Nginx Configuration

Ensure your nginx.conf forwards cookies correctly:

```nginx
location /xylor-ai/ {
  proxy_pass http://localhost:3000;
  proxy_set_header Host $host;
  proxy_set_header X-Real-IP $remote_addr;
  proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
  proxy_set_header X-Forwarded-Proto $scheme;

  # Important: Forward cookies for session auth
  proxy_set_header Cookie $http_cookie;

  # WebSocket support
  proxy_http_version 1.1;
  proxy_set_header Upgrade $http_upgrade;
  proxy_set_header Connection "upgrade";
}
```

### Frappe API Key Setup

1. Login to ERPNext as Administrator
2. Go to **Settings > API Access**
3. Create new API Key/Secret pair
4. Assign appropriate permissions to the API user

## 📊 Advanced Usage Examples

### Complex Filtering

```typescript
// Advanced filtering with multiple conditions
const customers = await client.getList("Customer", {
  fields: ["name", "customer_name", "email_id", "creation"],
  filters: [
    ["customer_type", "=", "Company"],
    ["creation", ">=", "2024-01-01"],
    ["enabled", "=", 1],
  ],
  order_by: "creation desc",
  limit_page_length: 25,
  limit_start: 0,
});

// Object-style filters for simple conditions
const activeItems = await client.getList("Item", {
  filters: {
    is_stock_item: 1,
    disabled: 0,
    item_group: "Products",
  },
});
```

### Bulk Operations

```typescript
// Bulk create with error handling
const customerData = [
  { customer_name: "Customer 1", customer_type: "Individual" },
  { customer_name: "Customer 2", customer_type: "Company" },
];

const results = await serverClient.bulkCreate("Customer", customerData);
console.log(`Created ${results.length} customers`);

// Bulk update
const updates = [
  { name: "CUST-001", data: { customer_group: "VIP" } },
  { name: "CUST-002", data: { customer_group: "Regular" } },
];

await serverClient.bulkUpdate("Customer", updates);
```

### Custom Method Calls

```typescript
// Call custom Frappe methods
const reportData = await client.callMethod({
  method: "erpnext.accounts.utils.get_balance_on",
  args: {
    account: "Cash - Company",
    date: "2024-01-31",
  },
});

// Call with freeze (loading indicator)
const result = await client.callMethod({
  method: "custom_app.api.process_data",
  args: { data: complexData },
  freeze: true,
  freeze_message: "Processing data...",
});
```

## 🛡️ Security Considerations

### 1. Credential Management

- **Never expose API keys in client-side code**
- Use environment variables for sensitive data
- Rotate API keys regularly

### 2. Permission Validation

```typescript
// Always validate permissions, even with user client
const hasPermission = await userClient.hasRole("Sales Manager");
if (!hasPermission) {
  throw new Error("Insufficient permissions");
}
```

### 3. Input Sanitization

```typescript
// Sanitize user inputs before sending to Frappe
const sanitizedData = {
  customer_name: userInput.trim(),
  email_id: userInput.toLowerCase().trim(),
};
```

## 🧪 Testing Strategy

### Unit Tests

```typescript
import { clearClientInstances, createUserClient } from "@/lib/api";

describe("FrappeUserClient", () => {
  afterEach(() => {
    clearClientInstances();
  });

  it("should get current user", async () => {
    const client = createUserClient({ baseURL: "http://localhost:8000" });
    const user = await client.getCurrentUser();
    expect(user.email).toBeDefined();
  });
});
```

### Integration Tests

```typescript
// Test with actual Frappe instance
const testClient = createServerClient({
  baseURL: process.env.TEST_FRAPPE_URL!,
  apiKey: process.env.TEST_API_KEY!,
  apiSecret: process.env.TEST_API_SECRET!,
});
```

## 🚀 Performance Optimization

### 1. Caching Strategy

```typescript
// User client caches current user data
const user = await userClient.getCurrentUser(); // API call
const sameUser = await userClient.getCurrentUser(); // Cached

// Clear cache when needed
userClient.clearUserCache();
```

### 2. Batch Operations

```typescript
// Instead of multiple single requests
const customers = await Promise.all([
  client.getDoc("Customer", "CUST-001"),
  client.getDoc("Customer", "CUST-002"),
  client.getDoc("Customer", "CUST-003"),
]);

// Use list operations when possible
const customers = await client.getList("Customer", {
  filters: [["name", "in", ["CUST-001", "CUST-002", "CUST-003"]]],
});
```

### 3. Pagination

```typescript
// Implement pagination for large datasets
const getCustomersPage = async (page: number, pageSize: number = 20) => {
  return await client.getList("Customer", {
    limit_start: page * pageSize,
    limit_page_length: pageSize,
    order_by: "creation desc",
  });
};
```

## 🔄 Migration Guide

### From Direct Fetch to API Client

**Before:**

```typescript
const response = await fetch("http://localhost:8000/api/resource/Customer", {
  credentials: "include",
});
const data = await response.json();
```

**After:**

```typescript
const client = createUserClient({ baseURL: "http://localhost:8000" });
const customers = await client.getList("Customer");
```

### Adding New DocTypes

1. **Add interface to types.ts:**

```typescript
export interface SalesOrder extends FrappeDocument {
  customer: string;
  total: number;
  status: "Draft" | "Submitted" | "Cancelled";
}
```

2. **Add convenience methods:**

```typescript
// In user-client.ts
async getMySalesOrders(options: FrappeQueryOptions = {}): Promise<FrappeListResponse<SalesOrder>> {
  return this.getList<SalesOrder>('Sales Order', options);
}
```

## 📈 Monitoring & Debugging

### Logging

```typescript
// Enable detailed logging in development
const client = createUserClient({
  baseURL: "http://localhost:8000",
  timeout: 30000,
});

// Log all API calls
client.on("request", (url, options) => {
  console.log("API Request:", url, options);
});
```

### Error Tracking

```typescript
try {
  await client.createDoc("Customer", customerData);
} catch (error) {
  if (error instanceof FrappeAPIError) {
    // Send to error tracking service
    errorTracker.captureException(error, {
      extra: {
        statusCode: error.statusCode,
        frappeError: error.frappeError,
      },
    });
  }
}
```

## 🎯 Best Practices Summary

1. **Use the right client for the right job**

   - User Client: Client-side, user-specific operations
   - Server Client: Server-side, administrative operations

2. **Handle errors gracefully**

   - Always wrap API calls in try-catch
   - Use FrappeAPIError for detailed error information

3. **Optimize performance**

   - Use list operations instead of multiple single requests
   - Implement pagination for large datasets
   - Cache frequently accessed data

4. **Maintain security**

   - Never expose API credentials to client-side
   - Validate permissions before operations
   - Sanitize user inputs

5. **Type safety**
   - Define interfaces for your DocTypes
   - Use generic types for better IntelliSense
   - Leverage TypeScript's type checking

This implementation provides a robust, type-safe, and scalable solution for integrating Next.js applications with Frappe/ERPNext systems.
