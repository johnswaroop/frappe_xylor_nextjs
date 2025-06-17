Here’s your updated **system architecture** based on:

- Hosting **ERPNext and Next.js** on the **same domain using subpaths**
- Using **session cookie (`sid`) or token-based auth**
- Building the full UI and AI layer in **Next.js**
- Routing via **NGINX reverse proxy**

---

## 🏗️ Updated Architecture Overview

```plaintext
                                      ┌────────────────────────────┐
                                      │     Client Browser (UI)    │
                                      │  (https://yourdomain.com)  │
                                      └────────────┬───────────────┘
                                                   │
                                ┌──────────────────┴──────────────────┐
                                │        NGINX Reverse Proxy          │
                                │ (routes /erp → ERP, /app → Next.js) │
                                └────┬──────────────┬─────────────────┘
                                     │              │
                    ┌────────────────┘              └────────────┐
                    │                                             │
        ┌───────────▼────────────┐                    ┌──────────▼────────────┐
        │   ERPNext (Frappe)     │                    │     Next.js App       │
        │  (https://domain.com/erp)                   │  (https://domain.com/app)
        │   - All ERP data       │                    │  - Full frontend UI   │
        │   - REST API + DB      │                    │  - Chat, AI, Call UI  │
        └──────────┬─────────────┘                    └──────────┬────────────┘
                   │                                             │
                   │    Direct DB Read   +  REST Writes          │
                   └───────────────────────────────┬─────────────┘
                                                   │
                                ┌──────────────────▼──────────────────┐
                                │        AI + Orchestration Layer     │
                                │     (Inside Next.js or Node API)    │
                                │  - LiteLLM                          │
                                │  - Prompt Builders & Context Fetch │
                                └──────────────────┬──────────────────┘
                                                   │
                                  ┌────────────────▼──────────────┐
                                  │ External Services (integrated)│
                                  │ - Twilio (Voice, Transcript)  │
                                  │ - Redis (Chat PubSub)         │
                                  │ - SMTP (Email sending)        │
                                  └───────────────────────────────┘
```

---

## 🔁 Routing (via NGINX)

```nginx
server {
  listen 80;
  server_name yourdomain.com;

  location /erp/ {
    proxy_pass http://erpnext:8000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }

  location /app/ {
    proxy_pass http://nextjs:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

---

## 🔐 Auth Strategy

- **For Internal Users:**

  - Use `/api/method/login` → get `sid` cookie
  - All requests to ERPNext (via Next.js backend or browser) include cookie

- **For External Clients:**

  - Minimal dashboard (read-only)
  - Authenticate via pre-shared token or limited service user

---

## 📦 Data Access Model

| Action                      | Handled By                                              | Notes                      |
| --------------------------- | ------------------------------------------------------- | -------------------------- |
| Read project/task info      | Next.js (direct DB)                                     | Read-only MariaDB access   |
| Create/update tasks         | Next.js → Frappe API                                    | Auth via token or session  |
| Chat messages               | Stored in ERPNext `Communication`, synced via WebSocket |                            |
| Call recordings/transcripts | Stored in ERPNext or separate Doctype                   |                            |
| AI queries                  | Next.js → ERP data + LiteLLM                            | Contextual prompt creation |

---

## 🧠 AI Integration (LiteLLM)

- Chat UI → Next.js API → DB context fetch → Prompt to LiteLLM
- Model output → Display in assistant, optionally store in ERPNext log

---

## 🛠 Deployment

- Docker Compose setup with:

  - ERPNext
  - Next.js app
  - NGINX reverse proxy
  - Redis (for chat/events)
  - Optional: Qdrant or vector DB (for semantic search)

---

Would you like this turned into a `docker-compose.yml` and `nginx.conf` starter template next?
