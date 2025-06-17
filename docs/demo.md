🛠️ Frappe/ERPNext Demo Data Setup
Goal
To populate a Frappe/ERPNext instance with realistic demo data tailored for the construction and modular building industry, enabling effective demos, testing, and development workflows.

Overview
A custom Python script is being developed and executed via bench execute to insert structured demo data including:

Users: Key project roles such as Project Manager, Site Engineer, and Quality Analyst with pre-configured credentials.

Customer: A mock customer (Acme Constructions) representing a commercial client.

Projects: Sample projects (Greenwood Villas, Oakridge Plaza) reflecting real-world construction work.

Tasks: Auto-generated tasks per project, with:

Assigned users

Descriptions and timelines

Auto-generated activity logs (comments) to simulate collaboration

Activity Feed:

Each task contains user-specific comments

Projects contain an initial project comment entry

No Deletion of Existing Data: The script avoids data deletion to prevent disruption of current records.

Purpose
This setup helps simulate realistic workflows and collaboration patterns to:

Showcase system capabilities to clients

Enable testing of project management flows

Provide a pre-filled sandbox for internal development

Execution
Run the script with:

bash
Copy
Edit
bench --site localhost execute frappe.populate_demo_data.populate_demo_data
Make sure populate_demo_data.py is placed inside the apps/frappe/frappe directory for it to be executable via frappe.populate_demo_data.

Let me know if you want a version for public README or internal documentation.
