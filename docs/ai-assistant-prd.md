# 🤖 **AI Assistant Page Design Specification**

**Based on:** AI-Enabled Project Communication Layer PRD v0.2  
**Page:** AI Assistant Interface  
**Layout:** Two-Column Design

---

## 🎨 **Overall Layout**

```
┌─────────────────────────────────────────────────────────────────┐
│                     AI Assistant Workspace                     │
├─────────────────────────┬───────────────────────────────────────┤
│                         │                                       │
│    LEFT COLUMN (40%)    │       RIGHT COLUMN (60%)             │
│   Project Context       │       AI Chat Interface              │
│                         │                                       │
├─────────────────────────┼───────────────────────────────────────┤
│ [Overview] [Communications] │  ┌─────────────────────────────┐ │
│                         │  │     AI Chat Messages       │ │
│ 📋 ERPNext Projects     │  │                             │ │
│ ├─ Website Redesign     │  │  Human: What's the status   │ │
│ │  ├─ 🐛 Issue #123 [📌]│  │  of Website Redesign?       │ │
│ │  └─ ✅ Task #456 [📌] │  │                             │ │
│ ├─ Mobile App Dev       │  │  AI: Based on your tagged   │ │
│ │  └─ 📋 Issue #789 [📌]│  │  items, Website Redesign... │ │
│ └─ ERP Implementation   │  │                             │ │
│                         │  └─────────────────────────────┘ │
│                         │                                       │
│                         │  ┌─────────────────────────────┐ │
│                         │  │  💬 Type your message...    │ │
│                         │  └─────────────────────────────┘ │
└─────────────────────────┴───────────────────────────────────────┘
```

---

## 🏗️ **Left Column: ERPNext Project Context Panel**

### **Tab 1: Overview**

#### **ERPNext Project Hierarchy Display**

- **📋 ERPNext Projects List** (accordion/collapsible)
  - Each ERPNext Project shows:
    - Project name + project status (Open/Completed/Cancelled)
    - Project completion percentage
    - Expected end date
    - Last activity timestamp

#### **ERPNext Project Drill-down**

- **📋 Issues** (from ERPNext Issue doctype)
  - Issue subject, priority, status
  - Issue type, assigned to
  - **📌 Tag Icon** - adds Issue context to AI chat
- **✅ Tasks** (from ERPNext Task doctype)

  - Task subject, status, priority
  - Assigned to, expected start/end date
  - Task completion percentage
  - **📌 Tag Icon** - adds Task context to AI chat

- **📊 Project Details** (from ERPNext Project doctype)
  - Project type, customer
  - Project template (if used)
  - **📌 Tag Icon** - adds Project context to AI chat

#### **Interactive Elements**

- **📌 Tag Icons:** Click to "tag" ERPNext document for AI context
- **Tagged Items Indicator:** Visual highlight when ERPNext documents are tagged
- **Context Breadcrumb:** Shows currently tagged ERPNext Projects/Tasks/Issues

### **Tab 2: Communications**

#### **ERPNext Communication Timeline**

- **📞 Call Logs** (from ERPNext Communication doctype)

  - Communication date/time, duration
  - Reference document (Project/Task/Issue)
  - Call transcription preview (expandable)
  - **📌 Tag Icon** for AI context

- **📧 Email Communications** (from ERPNext Communication doctype)

  - Email subject, sender/recipient
  - Reference document (Project/Task/Issue)
  - Email content preview (expandable)
  - **📌 Tag Icon** for AI context

- **💬 Chat Messages** (stored in ERPNext Communication doctype)
  - Chat excerpts linked to Projects/Tasks/Issues
  - Participant list from ERPNext User
  - **📌 Tag Icon** for AI context

#### **ERPNext Filtering Options**

- Date range picker
- Communication type filter (Email/Call/Chat)
- Reference document filter (Project/Task/Issue)
- ERPNext User filter (participants)
- Search functionality across Communication content

---

## 🤖 **Right Column: AI Chat Interface**

### **Chat Display Area**

- **Message History:** Scrollable conversation
- **ERPNext Context Indicators:** Show which ERPNext documents are currently tagged
- **AI Response Types:**
  - Text responses with ERPNext data
  - Structured summaries of Projects/Tasks/Issues
  - Action suggestions (create Task, update Issue status)
  - ERPNext data visualizations (project timelines, task completion)

### **Input Area**

- **Message Compose Box**
- **ERPNext Context Display:** Shows tagged documents as removable chips
  - Format: "Project: Website Redesign", "Task: #456", "Issue: #123"
- **Quick Actions:**
  - Clear ERPNext context
  - Export conversation
  - Share summary

### **AI Capabilities Based on Tagged ERPNext Context**

- **Project Summaries:** "Summarize the current status of [tagged ERPNext Project]"
- **Task Analysis:** "What Tasks are overdue in [tagged Project]?"
- **Issue Insights:** "What Issues are blocking [tagged Project/Task]?"
- **Communication Summary:** "What were the key points from recent Communications about [tagged documents]?"
- **Next Steps:** "What should we prioritize next for [tagged ERPNext documents]?"
- **ERPNext Actions:** "Create a new Task for [tagged Project]" or "Update Issue status"

---

## 🔧 **Technical Implementation Notes**

### **State Management**

- **Tagged ERPNext Documents State:** Array of tagged ERPNext doctypes (Project/Task/Issue/Communication)
- **Active Tab State:** Overview vs Communications
- **Chat State:** Conversation history, ERPNext context

### **ERPNext Integration**

- **Projects:** Fetch from ERPNext `Project` doctype
- **Tasks:** Fetch from ERPNext `Task` doctype (filtered by project)
- **Issues:** Fetch from ERPNext `Issue` doctype (filtered by project)
- **Communications:** Fetch from ERPNext `Communication` doctype (filtered by reference documents)

### **AI Context Building**

- **Tagged ERPNext Documents → Context Payload:** Convert tagged ERPNext documents to structured context
- **ERPNext Data Enrichment:** Include related document data (customer, users, dates, status)
- **LiteLLM Integration:** Send ERPNext context + user message to AI
- **Response Processing:** Format AI responses with ERPNext document references and actions

---

## 📱 **Responsive Considerations**

### **Desktop (>1200px)**

- Full two-column layout as described

### **Tablet (768px - 1200px)**

- Collapsible left panel
- Right panel takes full width when left panel collapsed

### **Mobile (<768px)**

- Single column, tab-based navigation
- Bottom sheet for ERPNext document selection
- Simplified AI interface

---

## 🎯 **User Experience Flow**

1. **User enters AI Assistant page**
2. **Left panel loads ERPNext Projects from Project doctype**
3. **User browses Projects and expands to see Tasks/Issues**
4. **User tags relevant ERPNext documents** (📌 icons)
5. **Tagged ERPNext documents appear as context chips in chat**
6. **User asks AI questions** with ERPNext context
7. **AI provides contextual responses** based on tagged ERPNext data
8. **User can switch to Communications tab** for ERPNext Communication history
9. **Process repeats** with new ERPNext context as needed

---

## 🔒 **Permission & Security**

- **Internal Users:** Access based on ERPNext Project permissions
- **External Clients:** Limited to ERPNext Projects they have Customer access to
- **Data Privacy:** AI context limited to user's ERPNext document permissions
- **Audit Trail:** Log all AI interactions in ERPNext Communication doctype

---

## 📊 **ERPNext Data Structure Integration**

### **Project Doctype Fields Used:**

- project_name, status, percent_complete
- expected_end_date, customer, project_type
- project_template

### **Task Doctype Fields Used:**

- subject, status, priority, assigned_to
- exp_start_date, exp_end_date, progress
- project (link to Project doctype)

### **Issue Doctype Fields Used:**

- subject, status, priority, issue_type
- assigned_to, opening_date, resolution_date
- project (link to Project doctype)

### **Communication Doctype Fields Used:**

- communication_type, content, sender, recipients
- reference_doctype, reference_name
- communication_date

---

This design creates a powerful, ERPNext-native AI assistant experience where users can easily provide relevant ERPNext Project context to get more accurate and useful AI responses!
