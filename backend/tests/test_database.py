import os
import sys
import tempfile
import unittest
from datetime import date, timedelta
from pathlib import Path
from typing import Optional

from fastapi.testclient import TestClient
from sqlalchemy import inspect

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def clear_app_modules():
    for module_name in list(sys.modules):
        if (
            module_name == "app.main"
            or module_name.startswith("app.core.")
            or module_name.startswith("app.modules.")
        ):
            del sys.modules[module_name]


def load_database(database_url: Optional[str] = None):
    if database_url is None:
        os.environ.pop("DATABASE_URL", None)
    else:
        os.environ["DATABASE_URL"] = database_url
    clear_app_modules()

    import app.core.database as database

    return database


def load_app(database_url: str):
    os.environ["DATABASE_URL"] = database_url
    os.environ["JWT_SECRET_KEY"] = "test-secret"
    clear_app_modules()

    import app.core.database as database
    import app.main as main

    return database, main


class DatabaseConfigTests(unittest.TestCase):
    def test_defaults_to_local_postgres_url_when_env_is_missing(self):
        database = load_database()

        self.assertIsNotNone(database.DATABASE_URL)
        self.assertIn("localhost", database.DATABASE_URL)
        self.assertIn("5433", database.DATABASE_URL)

    def test_create_user_endpoint_persists_to_database(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "test.db"
            database, main = load_app(f"sqlite:///{db_path}")

            database.Base.metadata.drop_all(bind=database.engine)
            database.Base.metadata.create_all(bind=database.engine)

            with TestClient(main.app) as client:
                response = client.post(
                    "/users",
                    json={"name": "Ada", "email": "ada@example.com", "password": "secret"},
                )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["email"], "ada@example.com")

    def test_project_and_task_crud_endpoints(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "test.db"
            database, main = load_app(f"sqlite:///{db_path}")

            database.Base.metadata.drop_all(bind=database.engine)
            database.Base.metadata.create_all(bind=database.engine)

            with TestClient(main.app) as client:
                manager_response = client.post(
                    "/users",
                    json={
                        "name": "Vikram Mehta",
                        "email": "vikram@example.com",
                        "password": "manager@123",
                        "role": "admin",
                    },
                )
                developer_response = client.post(
                    "/users",
                    json={
                        "name": "Priya Nair",
                        "email": "priya@example.com",
                        "password": "developer@123",
                        "role": "developer",
                    },
                )
                self.assertEqual(manager_response.status_code, 200)
                self.assertEqual(developer_response.status_code, 200)

                manager = manager_response.json()
                developer = developer_response.json()

                login_response = client.post(
                    "/auth/login",
                    json={"email": "vikram@example.com", "password": "manager@123"},
                )
                self.assertEqual(login_response.status_code, 200)
                token = login_response.json()["access_token"]
                headers = {"Authorization": f"Bearer {token}"}

                project_response = client.post(
                    "/projects",
                    json={
                        "name": "WorkSphere",
                        "description": "Project management platform.",
                        "status": "active",
                        "owner_id": manager["id"],
                        "end_date": (date.today() + timedelta(days=5)).isoformat(),
                    },
                    headers=headers,
                )
                self.assertEqual(project_response.status_code, 200)
                project = project_response.json()

                updated_project_response = client.patch(
                    f"/projects/{project['id']}",
                    json={"status": "paused"},
                    headers=headers,
                )
                self.assertEqual(updated_project_response.status_code, 200)
                self.assertEqual(updated_project_response.json()["status"], "paused")

                task_response = client.post(
                    "/tasks",
                    json={
                        "title": "Build tasks API",
                        "description": "Create task endpoints.",
                        "project_id": project["id"],
                        "assignee_id": developer["id"],
                        "status": "todo",
                        "priority": "high",
                        "due_date": (date.today() - timedelta(days=1)).isoformat(),
                    },
                    headers=headers,
                )
                self.assertEqual(task_response.status_code, 200)
                task = task_response.json()

                updated_task_response = client.patch(
                    f"/tasks/{task['id']}",
                    json={"status": "in_progress"},
                    headers=headers,
                )
                self.assertEqual(updated_task_response.status_code, 200)
                self.assertEqual(updated_task_response.json()["status"], "in_progress")

                filtered_projects_response = client.get("/projects?status=paused", headers=headers)
                self.assertEqual(filtered_projects_response.status_code, 200)
                self.assertEqual(len(filtered_projects_response.json()), 1)
                self.assertEqual(filtered_projects_response.json()[0]["id"], project["id"])
                self.assertEqual(
                    filtered_projects_response.json()[0]["manager_name"], "Vikram Mehta"
                )
                self.assertEqual(filtered_projects_response.json()[0]["progress"], 0)

                filtered_tasks_response = client.get(
                    f"/tasks?project_id={project['id']}&status=in_progress",
                    headers=headers,
                )
                self.assertEqual(filtered_tasks_response.status_code, 200)
                self.assertEqual(len(filtered_tasks_response.json()), 1)
                self.assertEqual(filtered_tasks_response.json()[0]["id"], task["id"])

                developer_login_response = client.post(
                    "/auth/login",
                    json={"email": "priya@example.com", "password": "developer@123"},
                )
                self.assertEqual(developer_login_response.status_code, 200)
                developer_headers = {
                    "Authorization": f"Bearer {developer_login_response.json()['access_token']}"
                }

                my_tasks_response = client.get("/tasks/me", headers=developer_headers)
                self.assertEqual(my_tasks_response.status_code, 200)
                self.assertEqual(len(my_tasks_response.json()), 1)
                self.assertEqual(my_tasks_response.json()[0]["id"], task["id"])

                comment_response = client.post(
                    f"/tasks/{task['id']}/comments",
                    json={"message": "Starting implementation now."},
                    headers=developer_headers,
                )
                self.assertEqual(comment_response.status_code, 200)
                self.assertEqual(comment_response.json()["task_id"], task["id"])

                attachment_response = client.post(
                    f"/tasks/{task['id']}/attachments",
                    json={
                        "file_name": "api-notes.md",
                        "file_url": "https://example.com/api-notes.md",
                        "content_type": "text/markdown",
                    },
                    headers=developer_headers,
                )
                self.assertEqual(attachment_response.status_code, 200)
                self.assertEqual(attachment_response.json()["task_id"], task["id"])

                notification_response = client.post(
                    "/notifications",
                    json={
                        "user_id": developer["id"],
                        "title": "Task updated",
                        "message": "Build tasks API moved to in progress.",
                    },
                    headers=headers,
                )
                self.assertEqual(notification_response.status_code, 200)

                notifications_response = client.get("/notifications?is_read=false", headers=developer_headers)
                self.assertEqual(notifications_response.status_code, 200)
                self.assertEqual(len(notifications_response.json()), 1)

                read_notification_response = client.patch(
                    f"/notifications/{notification_response.json()['id']}/read",
                    headers=developer_headers,
                )
                self.assertEqual(read_notification_response.status_code, 200)
                self.assertTrue(read_notification_response.json()["is_read"])

                dashboard_response = client.get("/dashboard", headers=headers)
                self.assertEqual(dashboard_response.status_code, 200)
                dashboard = dashboard_response.json()
                self.assertEqual(dashboard["role"], "ADMIN")
                self.assertEqual(dashboard["user"]["name"], "Vikram Mehta")
                self.assertEqual(dashboard["dashboard"]["summary"]["total_projects"], 1)
                self.assertEqual(dashboard["dashboard"]["summary"]["total_users"], 2)
                self.assertEqual(dashboard["dashboard"]["summary"]["total_workitems"], 1)
                self.assertEqual(dashboard["dashboard"]["summary"]["active_workitems"], 1)
                self.assertEqual(dashboard["dashboard"]["summary"]["overdue_workitems"], 1)
                self.assertEqual(dashboard["dashboard"]["projects_overview"][0]["progress"], 0)
                self.assertEqual(dashboard["dashboard"]["workitem_status"]["total"], 1)
                self.assertEqual(
                    dashboard["dashboard"]["upcoming_project_deadlines"][0]["days_left"], 5
                )
                self.assertGreaterEqual(len(dashboard["dashboard"]["recent_activity"]), 1)

                non_admin_dashboard_response = client.get("/dashboard", headers=developer_headers)
                self.assertEqual(non_admin_dashboard_response.status_code, 403)

                obsolete_dashboard_response = client.get("/dashboard/summary", headers=headers)
                self.assertEqual(obsolete_dashboard_response.status_code, 404)

                invalid_status_response = client.patch(
                    f"/tasks/{task['id']}",
                    json={"status": "finished"},
                    headers=headers,
                )
                self.assertEqual(invalid_status_response.status_code, 422)

                invalid_priority_filter_response = client.get(
                    "/tasks?priority=urgent", headers=headers
                )
                self.assertEqual(invalid_priority_filter_response.status_code, 422)

                activity_response = client.get(f"/activity?task_id={task['id']}", headers=headers)
                self.assertEqual(activity_response.status_code, 200)
                self.assertGreaterEqual(len(activity_response.json()), 1)

    def test_core_tables_are_created_with_relationship_columns(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "test.db"
            database, _main = load_app(f"sqlite:///{db_path}")

            database.Base.metadata.drop_all(bind=database.engine)
            database.Base.metadata.create_all(bind=database.engine)

            inspector = inspect(database.engine)

            self.assertTrue(
                {
                    "users",
                    "projects",
                    "tasks",
                    "comments",
                    "attachments",
                    "activity_logs",
                    "notifications",
                }.issubset(set(inspector.get_table_names()))
            )

            users_columns = {column["name"] for column in inspector.get_columns("users")}
            self.assertTrue(
                {
                    "id",
                    "name",
                    "email",
                    "password_hash",
                    "role",
                    "created_at",
                    "updated_at",
                }.issubset(users_columns)
            )

            projects_columns = {column["name"] for column in inspector.get_columns("projects")}
            self.assertTrue(
                {
                    "id",
                    "name",
                    "description",
                    "status",
                    "owner_id",
                    "start_date",
                    "end_date",
                    "created_at",
                    "updated_at",
                }.issubset(projects_columns)
            )

            tasks_columns = {column["name"] for column in inspector.get_columns("tasks")}
            self.assertTrue(
                {
                    "id",
                    "title",
                    "description",
                    "project_id",
                    "assignee_id",
                    "status",
                    "priority",
                    "due_date",
                    "created_at",
                    "updated_at",
                }.issubset(tasks_columns)
            )

            project_fks = {
                fk["constrained_columns"][0]: fk["referred_table"]
                for fk in inspector.get_foreign_keys("projects")
            }
            task_fks = {
                fk["constrained_columns"][0]: fk["referred_table"]
                for fk in inspector.get_foreign_keys("tasks")
            }

            self.assertEqual(project_fks["owner_id"], "users")
            self.assertEqual(task_fks["project_id"], "projects")
            self.assertEqual(task_fks["assignee_id"], "users")


if __name__ == "__main__":
    unittest.main()
