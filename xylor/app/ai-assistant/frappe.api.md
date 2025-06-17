# Frappe API Endpoints for AI Assistant

This document lists all the Frappe API endpoints required by the AI Assistant page to fetch ERPNext data.

## Authentication

### Get Current User

```
GET http://<base-url>/api/method/frappe.auth.get_logged_user
```

Returns the currently logged-in user information.

## Project Data APIs

### Get All Projects

```
GET http://<base-url>/api/resource/Project
```

Fetches all projects accessible to the current user.

**Required Fields:**

- name, project_name, status, percent_complete
- expected_end_date, customer, project_type
- project_template, creation, modified

**Query Parameters:**

- `fields=["name","project_name","status","percent_complete","expected_end_date","customer","project_type","project_template","creation","modified"]`
- `limit_page_length=1000`

### Get Specific Project

```
GET http://<base-url>/api/resource/Project/{project_id}
```

Fetches details of a specific project.

### Get Projects with Filters

```
GET http://<base-url>/api/resource/Project?filters=[["status","=","Open"]]
```

Fetches filtered projects (e.g., only open projects).

## Task Data APIs

### Get All Tasks

```
GET http://<base-url>/api/resource/Task
```

Fetches all tasks accessible to the current user.

**Required Fields:**

- name, subject, status, priority, assigned_to
- exp_start_date, exp_end_date, progress
- project, creation, modified

**Query Parameters:**

- `fields=["name","subject","status","priority","assigned_to","exp_start_date","exp_end_date","progress","project","creation","modified"]`
- `limit_page_length=1000`

### Get Tasks by Project

```
GET http://<base-url>/api/resource/Task?filters=[["project","=","{project_id}"]]
```

Fetches all tasks for a specific project.

### Get Tasks by Status

```
GET http://<base-url>/api/resource/Task?filters=[["status","=","Open"]]
```

Fetches tasks filtered by status.

### Get Tasks by Assigned User

```
GET http://<base-url>/api/resource/Task?filters=[["assigned_to","=","{user_email}"]]
```

Fetches tasks assigned to a specific user.

## Issue Data APIs

### Get All Issues

```
GET http://<base-url>/api/resource/Issue
```

Fetches all issues accessible to the current user.

**Required Fields:**

- name, subject, status, priority, issue_type
- assigned_to, opening_date, resolution_date
- project, creation, modified

**Query Parameters:**

- `fields=["name","subject","status","priority","issue_type","assigned_to","opening_date","resolution_date","project","creation","modified"]`
- `limit_page_length=1000`

### Get Issues by Project

```
GET http://<base-url>/api/resource/Issue?filters=[["project","=","{project_id}"]]
```

Fetches all issues for a specific project.

### Get Issues by Status

```
GET http://<base-url>/api/resource/Issue?filters=[["status","=","Open"]]
```

Fetches issues filtered by status.

### Get Issues by Priority

```
GET http://<base-url>/api/resource/Issue?filters=[["priority","=","High"]]
```

Fetches issues filtered by priority.

## Communication Data APIs

### Get All Communications

```
GET http://<base-url>/api/resource/Communication
```

Fetches all communications accessible to the current user.

**Required Fields:**

- name, communication_type, content, sender, recipients
- reference_doctype, reference_name, communication_date
- subject, creation, modified

**Query Parameters:**

- `fields=["name","communication_type","content","sender","recipients","reference_doctype","reference_name","communication_date","subject","creation","modified"]`
- `limit_page_length=1000`

### Get Communications by Reference Document

```
GET http://<base-url>/api/resource/Communication?filters=[["reference_doctype","=","Project"],["reference_name","=","{project_id}"]]
```

Fetches communications linked to a specific document (Project/Task/Issue).

### Get Communications by Type

```
GET http://<base-url>/api/resource/Communication?filters=[["communication_type","=","Email"]]
```

Fetches communications filtered by type (Email/Call/Chat).

### Get Communications by Date Range

```
GET http://<base-url>/api/resource/Communication?filters=[["communication_date",">=","2024-01-01"],["communication_date","<=","2024-12-31"]]
```

Fetches communications within a specific date range.

## User Data APIs

### Get All Users

```
GET http://<base-url>/api/resource/User
```

Fetches user information for displaying assigned users, etc.

**Required Fields:**

- name, email, full_name, user_image
- enabled, creation, modified

**Query Parameters:**

- `fields=["name","email","full_name","user_image","enabled","creation","modified"]`
- `filters=[["enabled","=",1]]`

### Get User Profile

```
GET http://<base-url>/api/resource/User/{user_email}
```

Fetches specific user profile information.

## Built-in Frappe Client Methods (EXIST)

These methods are built into Frappe and can be called directly:

### Get List (Built-in)

```
GET http://<base-url>/api/method/frappe.client.get_list?doctype=Task&filters={"project":"{project_id}"}&fields=["name","subject","status","progress"]
```

**✅ EXISTS** - Built-in Frappe method for getting filtered lists.

### Get Document (Built-in)

```
GET http://<base-url>/api/method/frappe.client.get?doctype=Project&name={project_id}
```

**✅ EXISTS** - Built-in Frappe method for getting single documents.

### Get Value (Built-in)

```
GET http://<base-url>/api/method/frappe.client.get_value?doctype=Project&fieldname=["status","percent_complete"]&filters={"name":"{project_id}"}
```

**✅ EXISTS** - Built-in Frappe method for getting specific field values.

### Get Count (Built-in)

```
GET http://<base-url>/api/method/frappe.client.get_count?doctype=Issue&filters={"project":"{project_id}","status":"Open"}
```

**✅ EXISTS** - Built-in Frappe method for counting documents.

## Standard ERPNext Reports (EXIST)

These are standard reports available in ERPNext:

### Project Summary Report

```
GET http://<base-url>/api/method/frappe.desk.query_report.run?report_name=Project%20Summary&filters={"project":"{project_id}"}
```

**✅ EXISTS** - Standard ERPNext report for project summaries.

### Task Summary Report

```
GET http://<base-url>/api/method/frappe.desk.query_report.run?report_name=Task%20Summary&filters={"project":"{project_id}"}
```

**✅ EXISTS** - Standard ERPNext report for task summaries.

## Search Methods (EXIST)

### Global Search

```
GET http://<base-url>/api/method/frappe.desk.search.search_widget?doctype=Project&txt={search_term}
```

**✅ EXISTS** - Built-in Frappe search functionality.

### Activity Log

```
GET http://<base-url>/api/resource/Activity%20Log?filters=[["reference_doctype","in",["Project","Task","Issue"]]]&order_by=creation%20desc
```

**✅ EXISTS** - Standard Frappe Activity Log doctype.

## Custom Methods (NEED TO BE CREATED)

These methods would need to be created as custom server-side functions:

### Get Project Context for AI (CUSTOM)

```
GET http://<base-url>/api/method/custom_ai_assistant.get_project_context?project_id={project_id}
```

**❌ CUSTOM** - Would need to be created. Example implementation:

```python
# In your custom app: custom_ai_assistant/api.py
import frappe

@frappe.whitelist()
def get_project_context(project_id):
    """Get comprehensive project context for AI assistant"""

    # Get project details
    project = frappe.get_doc("Project", project_id)

    # Get related tasks
    tasks = frappe.get_all("Task",
        filters={"project": project_id},
        fields=["name", "subject", "status", "priority", "assigned_to", "progress"]
    )

    # Get related issues
    issues = frappe.get_all("Issue",
        filters={"project": project_id},
        fields=["name", "subject", "status", "priority", "issue_type", "assigned_to"]
    )

    # Get communications
    communications = frappe.get_all("Communication",
        filters={"reference_doctype": "Project", "reference_name": project_id},
        fields=["communication_type", "content", "sender", "communication_date"]
    )

    return {
        "project": project.as_dict(),
        "tasks": tasks,
        "issues": issues,
        "communications": communications
    }
```

### Batch Data Fetcher (CUSTOM)

```
GET http://<base-url>/api/method/custom_ai_assistant.get_dashboard_data?project_ids={project_ids}
```

**❌ CUSTOM** - For fetching multiple projects' data in one call.

### AI Context Builder (CUSTOM)

```
GET http://<base-url>/api/method/custom_ai_assistant.build_ai_context?tagged_items={tagged_items}
```

**❌ CUSTOM** - For building structured AI context from tagged items.

## Summary

**✅ EXISTING METHODS (Use directly):**

- All `/api/resource/` endpoints
- `frappe.client.get_list`
- `frappe.client.get`
- `frappe.client.get_value`
- `frappe.client.get_count`
- `frappe.desk.query_report.run`
- `frappe.desk.search.search_widget`
- `frappe.auth.get_logged_user`

**❌ CUSTOM METHODS (Need to create):**

- `custom_ai_assistant.get_project_context`
- `custom_ai_assistant.get_dashboard_data`
- `custom_ai_assistant.build_ai_context`

## Error Handling

All API calls should handle standard HTTP status codes:

- `200`: Success
- `403`: Permission denied
- `404`: Document not found
- `500`: Server error

## Rate Limiting

Be aware of Frappe's rate limiting:

- Default: 200 requests per hour per user
- Batch requests when possible
- Use appropriate `limit_page_length` to avoid timeouts

## Authentication Headers

All requests require session-based authentication or API key:

```
Cookie: sid={session_id}
```

or

```
Authorization: token {api_key}:{api_secret}
```

## Caching Strategy

Consider implementing client-side caching for:

- User data (rarely changes)
- Project metadata (changes infrequently)
- Task/Issue data (cache for 5-10 minutes)
- Communication data (cache for 1-2 minutes)
