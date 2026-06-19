from fastapi import Header, HTTPException


def require_roles(allowed_roles):
    def role_checker(
        x_username: str = Header(default="anonymous"),
        x_role: str = Header(default="Guest"),
    ):
        if x_role not in allowed_roles:
            raise HTTPException(
                status_code=403,
                detail={
                    "message": "Access denied",
                    "required_roles": allowed_roles,
                    "current_user": x_username,
                    "current_role": x_role,
                },
            )

        return {
            "username": x_username,
            "role": x_role,
        }

    return role_checker