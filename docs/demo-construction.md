# 🏗️ Construction Industry Demo Scenario

## Overview

This demo scenario populates a Frappe/ERPNext instance with realistic data for a construction company, focusing on project management and team collaboration. The setup creates a complete ecosystem including users, customers, projects, and tasks with simulated activity.

## Demo Data Structure

### 👥 User Roles

The system is populated with three key roles:

- **Project Manager** (project.manager@example.com)

  - Oversees project execution
  - Manages timelines and resources
  - Default password: demo123

- **Site Engineer** (site.engineer@example.com)

  - Handles on-site operations
  - Manages technical aspects
  - Default password: demo123

- **Quality Analyst** (quality.analyst@example.com)
  - Ensures quality standards
  - Conducts inspections
  - Default password: demo123

### 🏢 Customer

- **Acme Constructions**
  - Type: Company
  - Group: Commercial
  - Territory: United States

### 🏗️ Projects

Two major construction projects are created:

1. **Greenwood Villas**

   - Type: Residential Complex
   - Scale: 50 units
   - Duration: 180 days
   - Status: Open

2. **Oakridge Plaza**
   - Type: Commercial Building
   - Features: Office space with retail
   - Duration: 365 days
   - Status: Open

### 📋 Tasks

Each project includes five standard tasks with realistic timelines:

1. **Site Survey and Analysis** (7 days)

   - Conduct detailed site survey
   - Prepare analysis report

2. **Design Review** (14 days)

   - Review architectural designs
   - Approve structural plans

3. **Material Procurement** (21 days)

   - Source construction materials
   - Place and track orders

4. **Foundation Work** (30 days)

   - Complete foundation
   - Structural work

5. **Quality Inspection** (7 days)
   - Conduct quality checks
   - Prepare inspection report

### 💬 Activity Simulation

Each task includes 2-4 random comments to simulate real-world collaboration:

- "Initial review completed"
- "Materials ordered and confirmed"
- "Team meeting scheduled"
- "Progress report submitted"
- "Quality checks in progress"

## Technical Implementation

### Data Creation Process

1. Creates necessary roles and permissions
2. Sets up customer with required dependencies
3. Creates projects with realistic timelines
4. Generates tasks with sequential scheduling
5. Adds activity comments for realism

### Safety Features

- Checks for existing data before creation
- Handles errors gracefully
- Provides detailed feedback
- Maintains data integrity

## Usage

### Running the Demo

```bash
bench --site localhost execute frappe.populate_demo_data.populate_demo_data.populate_demo_data
```

### Accessing the Demo

1. Log in as any of the created users
2. Navigate to Projects
3. Explore tasks and activities
4. Review project timelines

## Notes

- The script is idempotent (can be run multiple times safely)
- Existing data is preserved
- All created users have the password: demo123
- Activity comments are randomly generated for realism

## Purpose

This demo setup helps to:

- Showcase project management capabilities
- Demonstrate team collaboration features
- Provide a realistic testing environment
- Enable effective client demonstrations
