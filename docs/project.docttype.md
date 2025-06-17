# 📁 ERPNext: Comprehensive Project Doctype Reference

ERPNext’s `Project` module enables teams to manage internal or client-facing projects through tasks, assignments, timelines, and integrated financial tracking.

---

## 🧱 Main Doctype: `Project`

### ✅ Purpose

Track and manage a project’s lifecycle including tasks, team members, timelines, budget, and billing.

### 🔢 Key Fields

| Field                     | Type     | Description                                         |
| ------------------------- | -------- | --------------------------------------------------- |
| `project_name`            | Data     | The name/title of the project.                      |
| `status`                  | Select   | Project state: Open, Completed, Cancelled, etc.     |
| `company`                 | Link     | Associated company (multi-company setup supported). |
| `customer`                | Link     | (Optional) Linked client/customer.                  |
| `priority`                | Select   | Priority: Low, Medium, High.                        |
| `expected_start_date`     | Date     | Scheduled start of the project.                     |
| `expected_end_date`       | Date     | Scheduled end.                                      |
| `actual_start_date`       | Date     | Real start date.                                    |
| `actual_end_date`         | Date     | Real completion date.                               |
| `percent_complete_method` | Select   | Manual or auto based on Task completion.            |
| `percent_complete`        | Percent  | Project progress (shown in dashboard).              |
| `budget_amount`           | Currency | Budgeted total amount.                              |
| `total_costing_amount`    | Currency | Actual cost recorded via expenses/purchases.        |
| `project_type`            | Select   | Internal, External, Client, etc.                    |
| `is_active`               | Check    | Mark whether currently running.                     |
| `project_template`        | Link     | Optional: create from a reusable template.          |

---

## 📎 Embedded Child Tables (in `Project`)

### 1️⃣ `Project Task`

**Purpose:** Link tasks directly to a project via an inline table.

| Field         | Type   | Description                            |
| ------------- | ------ | -------------------------------------- |
| `task`        | Link   | Link to `Task` doctype.                |
| `subject`     | Data   | Task title (fetched from linked task). |
| `status`      | Select | Task status: Open, Completed, etc.     |
| `start_date`  | Date   | Task start date.                       |
| `end_date`    | Date   | Task due or finish date.               |
| `description` | Text   | Short summary of task scope.           |

➡️ This table references `Task`, which holds full task information including assignees, dependencies, comments, and attachments.

---

### 2️⃣ `Project Member`

**Purpose:** Assign users to the project, optionally specifying roles and hours.

| Field             | Type   | Description                                       |
| ----------------- | ------ | ------------------------------------------------- |
| `member`          | Link   | Link to `User` doctype.                           |
| `full_name`       | Data   | Full name of the user.                            |
| `role`            | Select | Role in the project (e.g., Manager, Contributor). |
| `email`           | Data   | Email ID of the user.                             |
| `mobile`          | Data   | Mobile contact (optional).                        |
| `allocated_hours` | Float  | Hours allocated to this user.                     |

➡️ Used to filter dashboards, assign tasks, and restrict visibility.

---

### 3️⃣ `Project Update` (Optional/Custom)

**Purpose:** Record manual progress updates, status notes, or milestones.

| Field         | Type       | Description                       |
| ------------- | ---------- | --------------------------------- |
| `update_date` | Date       | Date of this update.              |
| `updated_by`  | Link       | User submitting update.           |
| `status`      | Select     | Project status at time of update. |
| `summary`     | Small Text | Short update note.                |
| `details`     | Long Text  | Full progress narrative.          |
| `next_steps`  | Small Text | Planned upcoming actions.         |

➡️ May need to be added via customization. Good for timeline view and reporting.

---

## 🔗 Related Doctypes

These doctypes are **linked externally** (not embedded), usually via the `project` field.

| Doctype            | Relation            | Description                                               |
| ------------------ | ------------------- | --------------------------------------------------------- |
| `Task`             | Linked by `project` | Core work items. Can be Gantt/Kanban managed.             |
| `Timesheet`        | Linked by `project` | Tracks time logged by users for billing or payroll.       |
| `Issue`            | Linked by `project` | Bugs or requests tied to a project (from Support module). |
| `Sales Order`      | Linked by `project` | If project is billable, linked sales contract/order.      |
| `Sales Invoice`    | Linked by `project` | For billing project tasks, timesheets, or deliverables.   |
| `Expense Claim`    | Linked by `project` | Employee reimbursements tied to project expenses.         |
| `Purchase Order`   | Linked by `project` | Vendor purchases made for project.                        |
| `Purchase Invoice` | Linked by `project` | Bill from vendor for purchased items/services.            |
| `Delivery Note`    | Linked by `project` | Delivery of items or materials to the customer.           |
| `Stock Entry`      | Linked by `project` | Track consumption/movement of inventory for the project.  |

---

## 🧰 Other Relevant Doctypes

| Doctype            | Description                                         |
| ------------------ | --------------------------------------------------- |
| `Milestone`        | Custom or deprecated; define milestone checkpoints. |
| `Project Template` | Allows reuse of project structure and tasks.        |
| `Activity Type`    | Used in `Timesheet` to categorize work types.       |
| `Task Dependency`  | Model sequencing and dependencies between tasks.    |
| `Gantt View`       | Built-in project timeline visualization.            |
| `Kanban Board`     | Built-in UI to manage task status visually.         |

---

## 📊 Project Structure Visualization
