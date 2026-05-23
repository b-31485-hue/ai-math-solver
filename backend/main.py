from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from steps import solve_with_steps

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def home():
    return {"message": "AI Math Solver Backend Running"}


def _solve(expr: str, mode: str):
    try:
        return solve_with_steps(expr, mode)
    except Exception as exc:
        raise HTTPException(status_code=400, detail=f"Could not parse or solve: {exc}") from exc


@app.get("/differentiate")
def differentiate(expr: str):
    return _solve(expr, "differentiate")


@app.get("/integrate")
def integration(expr: str):
    return _solve(expr, "integrate")
