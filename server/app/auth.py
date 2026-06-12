import os
import httpx
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import jwt, JWTError
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.environ["SUPABASE_URL"]
JWKS_URL = f"{SUPABASE_URL}/auth/v1/.well-known/jwks.json"

bearer_scheme = HTTPBearer()
_jwks_cache = None


def _get_jwks():
    global _jwks_cache
    if _jwks_cache is None:
        with httpx.Client(timeout=10) as client:
            resp = client.get(JWKS_URL)
            resp.raise_for_status()
            _jwks_cache = resp.json().get("keys", [])
    return _jwks_cache


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
) -> str:
    token = credentials.credentials
    keys = _get_jwks()

    for key in keys:
        try:
            payload = jwt.decode(
                token,
                key,
                algorithms=["ES256", "RS256", "HS256"],
                options={"verify_aud": False},
            )
            user_id: str = payload.get("sub")
            if not user_id:
                raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")
            return user_id
        except JWTError:
            continue

    raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
