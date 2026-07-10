from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.database import Base, engine
from app.modules.auth.router import router as auth_router
from app.modules.projects.router import router as projects_router
from app.modules.tasks.router import router as tasks_router
from app.modules.users.router import router as users_router
import app.modules.projects.model  # noqa: F401
import app.modules.tasks.model  # noqa: F401
import app.modules.users.model  # noqa: F401

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="WorkSphere API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)
app.include_router(users_router)
app.include_router(projects_router)
app.include_router(tasks_router)


@app.get("/")
def root():
    return {"message": "Worksphere is running!"}
