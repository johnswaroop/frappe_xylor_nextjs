Thanks — here’s the updated and refined **PRD** with your clarifications included:

---

# 🧠 **AI-Enabled Project Communication Layer (Built on ERPNext)**

### Product Requirements Document (PRD)

**Version:** 0.2
**Owner:** John Swaroop
**Last Updated:** 2025-06-14

---

## 📌 **Overview**

A lightweight, AI-powered communication and intelligence layer for ERPNext projects. Designed for internal team coordination and external client clarity — offering real-time chat, integrated calls/emails, and an AI assistant for insights.

---

## 🎯 **Goals**

- Centralize communication per project workspace
- Provide clients with an AI-powered summary dashboard (read-only)
- Log all communication contextually to ERPNext
- Use AI to make communication and task tracking intelligent, contextual, and summarized

---

## 👤 **User Roles**

### Internal Users

- **Project Managers & Team Members:** Communicate, manage tasks, initiate calls/emails, and query the AI assistant.

### External Clients

- **Client Dashboard Access:**

  - Minimal interface
  - Can interact with **AI assistant** to get summary of updates, tasks, and interactions
  - No direct access to chat/calls/email, unless explicitly configured

---

## 🧱 **System Capabilities**

### ✅ 1. **Workspace**

- Mirrors ERPNext **Project**
- Contains:

  - Group Chat
  - Communication Timeline (calls, emails)
  - AI assistant interface
  - Task boards / issues

---

### ✅ 2. **Group Chat**

- Real-time, WebSocket chat scoped to a workspace
- Features:

  - `@mentions`, file sharing
  - Threads and replies
  - Messages can be tagged to ERPNext **Tasks**, **Issues**, or **Clients**
  - Stored as part of ERPNext `Communication`

---

### ✅ 3. **Calling (via Twilio)**

- Outbound voice calling from within workspace
- Features:

  - Call recording and transcription
  - Transcripts tagged to task or issue
  - Stored in ERPNext Communication logs

---

### ✅ 4. **Email**

- Send and track emails from workspace interface
- Features:

  - Templates per project type
  - Emails stored in ERPNext and can be tagged to tasks/issues
  - View threaded history of client interactions

---

### ✅ 5. **AI Assistant**

#### 🔍 Context-Aware Capabilities:

- Summarize activity, tasks, and discussions
- Query status of boards/issues/tasks
- Summarize communication with a client
- Suggest follow-ups or next steps
- Reads from: ERPNext Projects, Tasks, Communication, Timelines

#### 🔐 Client-Facing Mode:

- Minimal dashboard for clients
- Read-only AI assistant access
- Query examples:

  - “What was the update this week?”
  - “Any issues pending resolution?”
  - “What were last three calls/emails about?”

---

## ⚙️ **Tech Stack Overview**

| Component      | Tech Stack / Notes                 |
| -------------- | ---------------------------------- |
| ERP            | ERPNext (Frappe)                   |
| Chat           | WebSocket, Redis Queue, React      |
| Calling        | Twilio Programmable Voice          |
| Email          | SMTP + ERPNext `Communication`     |
| AI Assistant   | LiteLLM (OpenAI-compatible APIs)   |
| Tagging Engine | Frappe Link Doctypes (Task, Issue) |

---

## 🔄 **Integrations**

- **ERPNext Projects** = Workspace
- **ERPNext Tasks/Issues** = Taggable in chat, email, call
- **Twilio** = Call trigger, record, transcript
- **ERPNext Communication** = All logs stored here
- **LiteLLM** = Unified AI interface using OpenAI-compatible API

---
