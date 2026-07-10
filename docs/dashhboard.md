# Functional Requirements - WorkSphere Dashboard

## Dashboard Purpose

The WorkSphere dashboard should give users a quick overview of their work, project progress, task status, and important actions based on their role.

---

# Functional Requirements

## 1. Display Summary Metrics

The dashboard should display key metric cards:

* Total Projects
* Active Projects
* Total Tasks
* Completed Tasks
* Pending Tasks
* Overdue Tasks

Each metric card should show the latest count based on the logged-in user's access.

---

## 2. Role-Based Dashboard View

The dashboard should change based on the user's role.

### Admin

Admin can view:

* All projects
* All users
* All tasks
* Overall workspace statistics

### Project Manager

Project Manager can view:

* Projects they manage
* Team members under their projects
* Tasks inside their projects
* Overdue and pending work

### Developer

Developer can view:

* Projects they are part of
* Tasks assigned to them
* Their pending tasks
* Their completed tasks

---

## 3. Display Project Summary

The dashboard should show a project summary table with:

* Project Name
* Project Status
* Project Owner
* Start Date
* End Date
* Progress Percentage
* Total Tasks
* Completed Tasks

Users should only see projects they have permission to access.

---

## 4. Display Task Overview

The dashboard should show task-related details such as:

* My Tasks
* Recently Assigned Tasks
* Overdue Tasks
* High Priority Tasks
* Tasks Due Soon

Each task item should show:

* Task Title
* Project Name
* Priority
* Status
* Due Date
* Assignee

---

## 5. Show Recent Activity

The dashboard should show recent activity such as:

* Project created
* Task created
* Task assigned
* Task completed
* Comment added
* Member added to project
* Status changed

Recent activity should be shown based on the user's access level.

---

## 6. Support Quick Actions

The dashboard should provide quick action buttons based on role.

### Admin

* Create Project
* Add User
* Create Team
* Manage Workspace

### Project Manager

* Create Project
* Create Task
* Add Team Member
* View Reports

### Developer

* Create Task
* Update My Tasks
* View My Projects

---

## 7. Display Notifications

The dashboard should show important notifications such as:

* New task assigned
* Task due soon
* Task overdue
* Mention in comment
* Project deadline approaching

Unread notifications should be highlighted.

---

## 8. Filter Dashboard Data

Users should be able to filter dashboard data by:

* Project
* Task Status
* Priority
* Due Date
* Assignee
* Date Range

Filters should update the dashboard data without refreshing the page.

---

## 9. Search From Dashboard

Users should be able to search for:

* Projects
* Tasks
* Team Members

Search results should be limited based on the user's permissions.

---

## 10. Navigate to Detailed Pages

Dashboard items should be clickable.

Examples:

* Clicking Total Projects opens Projects page.
* Clicking Overdue Tasks opens filtered Tasks page.
* Clicking a Project Name opens Project Detail page.
* Clicking a Task opens Task Detail page.

---

## 11. Show Empty States

If there is no data, the dashboard should show meaningful empty states.

Examples:

* No projects found.
* No tasks assigned yet.
* No overdue tasks.
* No recent activity.

---

## 12. Show Loading and Error States

The dashboard should handle:

* Loading state while data is fetched
* Error state if API fails
* Retry option if data cannot be loaded

---

## 13. Auto Refresh Dashboard Data

The dashboard can refresh data automatically after a certain interval or after actions like:

* Creating a task
* Updating task status
* Adding a project
* Assigning a user

---

## 14. Respect User Permissions

The dashboard should not expose unauthorized data.

A user should only see:

* Projects they own, manage, or are assigned to
* Tasks they created or are assigned to
* Team members from their accessible projects/workspaces

---

# Final Dashboard Requirement

The WorkSphere dashboard should act as the central home page where users can quickly understand project health, task progress, upcoming work, recent activity, and role-based actions without needing to open multiple pages.
