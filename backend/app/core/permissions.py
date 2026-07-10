from fastapi import HTTPException, status


def require_role(user, allowed_roles: set[str]) -> None:
    if user.role not in allowed_roles:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not enough permissions")


def require_manager_or_admin(user) -> None:
    require_role(user, {"admin", "manager"})
