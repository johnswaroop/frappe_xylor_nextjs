# Task API 417 Error - Debugging Guide

## Issue Summary

The Task API endpoint returns **417 EXPECTATION FAILED** while the Project API works fine.

**Failing URL:**

```
http://localhost/api/resource/Task?fields=[%22name%22,%22subject%22,%22status%22,%22priority%22,%22assigned_to%22,%22exp_start_date%22,%22exp_end_date%22,%22progress%22,%22project%22,%22creation%22,%22modified%22]&limit_page_length=1000
```

**Working URL:**

```
http://localhost/api/resource/Project?fields=[%22name%22,%22project_name%22,%22status%22,%22percent_complete%22,%22expected_end_date%22,%22customer%22,%22project_type%22,%22project_template%22,%22creation%22,%22modified%22]&limit_page_length=1000
```

## Potential Causes

### 1. Field Permission Issues

Some fields in the Task doctype might not be accessible or might not exist:

**Problematic fields to check:**

- `assigned_to` - Often has permission restrictions
- `exp_start_date` / `exp_end_date` - Might be named differently
- `progress` - Could be a computed field or have permission issues

### 2. Doctype Permissions

The current user might not have read permissions for the Task doctype.

### 3. Custom Server-side Validation

There might be custom hooks or validation on the Task doctype causing the expectation to fail.

### 4. Database/Schema Issues

The Task table might have missing columns or data integrity issues.

## Debugging Steps

### Step 1: Check Browser Console

1. Open your browser's Developer Tools
2. Check the Console tab for error messages when the Task API is called
3. Look for detailed error information

### Step 2: Test with Minimal Fields

The updated code now automatically retries with minimal fields if a 417 error occurs. Check the console for these messages:

- "Attempting to fetch tasks with full fields..."
- "Retrying with minimal fields due to 417 error..."

### Step 3: Test Individual Fields

Try these URLs directly in your browser (while logged into ERPNext):

**Basic Task fields:**

```
http://localhost/api/resource/Task?fields=["name","subject","status"]&limit_page_length=10
```

**With creation fields:**

```
http://localhost/api/resource/Task?fields=["name","subject","status","creation","modified"]&limit_page_length=10
```

**With project field:**

```
http://localhost/api/resource/Task?fields=["name","subject","status","project"]&limit_page_length=10
```

**With progress field (often problematic):**

```
http://localhost/api/resource/Task?fields=["name","subject","status","progress"]&limit_page_length=10
```

### Step 4: Check ERPNext Permissions

1. Log into your ERPNext instance
2. Go to **Setup > Permissions > Role Permissions Manager**
3. Search for "Task" doctype
4. Verify your role has **Read** permission
5. Check if specific fields have permission restrictions

### Step 5: Check ERPNext Error Logs

1. SSH into your ERPNext server
2. Check the error logs:
   ```bash
   tail -f /home/frappe/frappe-bench/logs/bench.log
   tail -f /home/frappe/frappe-bench/logs/worker.error.log
   ```
3. Try the failing API call and observe any server-side errors

### Step 6: Use Alternative API Endpoints

Try using Frappe's built-in client methods instead:

**Option 1: frappe.client.get_list**

```
http://localhost/api/method/frappe.client.get_list?doctype=Task&fields=["name","subject","status"]&limit_page_length=10
```

**Option 2: Custom method (if you have ERPNext access)**
Create a custom API method that handles Task fetching with proper error handling.

## Quick Fixes

### Fix 1: Field Name Verification

Common Task field names that might be different:

- `exp_start_date` → `expected_start_date`
- `exp_end_date` → `expected_end_date`
- `assigned_to` → `_assign` (in some versions)

### Fix 2: Reduce Field List

Temporarily remove problematic fields:

```typescript
const conservativeFields = [
  "name",
  "subject",
  "status",
  "project",
  "creation",
  "modified",
];
```

### Fix 3: Alternative Task Fetching

If the standard API continues to fail, use the frappe.client.get_list method:

```typescript
export async function getTasksAlternative(): Promise<Task[]> {
  try {
    const response = await frappeRequest<any>(
      `/api/method/frappe.client.get_list?doctype=Task&fields=["name","subject","status","project"]&limit_page_length=1000`
    );

    return response.message || [];
  } catch (error) {
    console.error("Error fetching tasks via frappe.client.get_list:", error);
    throw error;
  }
}
```

## Status Check Commands

Run these in your ERPNext server to check the Task doctype:

```bash
# Check if Task doctype exists
bench --site your-site.local execute frappe.get_doc --args "DocType,Task"

# Check Task permissions for your user
bench --site your-site.local execute frappe.permissions.get_user_permissions --args "user@example.com"

# Check available Task fields
bench --site your-site.local execute frappe.get_meta --args "Task"
```

## Next Steps

1. **Test the updated code** - The API functions now include fallback logic
2. **Check console logs** - Look for the retry messages
3. **Verify field names** - Ensure all requested fields exist in your ERPNext version
4. **Check permissions** - Verify Task doctype permissions in ERPNext
5. **Contact ERPNext admin** - If you don't have server access, share this guide with your ERPNext administrator

## Code Changes Made

The following functions now include 417 error handling:

- `getTasks()` - Retries with minimal fields on 417 error
- `getTasksByProject()` - Retries with minimal fields on 417 error

Both functions will log detailed error information to help identify the root cause.
