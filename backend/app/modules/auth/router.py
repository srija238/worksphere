from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.modules.auth.schema import AuthHealthResponse, LoginRequest, LoginResponse
from app.modules.auth.service import get_auth_status, login_user
from app.core.dependencies import get_current_user
from app.modules.users.schema import UserRead

router = APIRouter(prefix="/auth", tags=["auth"])


@router.get("/health", response_model=AuthHealthResponse)
def health_check() -> AuthHealthResponse:
    return get_auth_status()


@router.post("/login", response_model=LoginResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)) -> LoginResponse:
    login_result = login_user(db, request.email, request.password)
    if not login_result:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return LoginResponse(**login_result)


@router.get("/me", response_model=UserRead)
def me(current_user=Depends(get_current_user)) -> UserRead:
    return current_user
