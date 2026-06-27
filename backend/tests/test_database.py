import importlib
import os
import sys
import tempfile
import unittest
from pathlib import Path

from fastapi.testclient import TestClient

BACKEND_DIR = Path(__file__).resolve().parents[1]
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


class DatabaseConfigTests(unittest.TestCase):
    def test_defaults_to_local_postgres_url_when_env_is_missing(self):
        os.environ.pop("DATABASE_URL", None)
        import app.core.database as database

        importlib.reload(database)

        self.assertIsNotNone(database.DATABASE_URL)
        self.assertIn("localhost", database.DATABASE_URL)
        self.assertIn("5433", database.DATABASE_URL)

    def test_create_user_endpoint_persists_to_database(self):
        with tempfile.TemporaryDirectory() as temp_dir:
            db_path = Path(temp_dir) / "test.db"
            os.environ["DATABASE_URL"] = f"sqlite:///{db_path}"

            import app.core.database as database
            import app.main as main

            importlib.reload(database)
            importlib.reload(main)

            database.Base.metadata.drop_all(bind=database.engine)
            database.Base.metadata.create_all(bind=database.engine)

            with TestClient(main.app) as client:
                response = client.post(
                    "/users",
                    json={"name": "Ada", "email": "ada@example.com", "password": "secret"},
                )

            self.assertEqual(response.status_code, 200)
            self.assertEqual(response.json()["email"], "ada@example.com")


if __name__ == "__main__":
    unittest.main()
