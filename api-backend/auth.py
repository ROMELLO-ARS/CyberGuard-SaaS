from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    username: str
    password: str


USERS = {
    "admin": {
        "password": "CyberGuard123",
        "role": "Administrator",
    },
    "analyst": {
        "password": "Analyst123",
        "role": "SOC Analyst",
    },
    "manager": {
        "password": "Manager123",
        "role": "SOC Manager",
    },
    "executive": {
        "password": "Executive123",
        "role": "Executive",
    },
}


@router.post("/login")
def login(request: LoginRequest):
    user = USERS.get(request.username)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if request.password != user["password"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    return {
        "token": "cyberguard-demo-token",
        "role": user["role"],
        "username": request.username,
    }