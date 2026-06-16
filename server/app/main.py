from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import expenses, income, budgets, todos, meetings, notes, pomodoro, user, finance, goals

app = FastAPI(title="d.ai.ly API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(expenses.router)
app.include_router(income.router)
app.include_router(budgets.router)
app.include_router(todos.router)
app.include_router(meetings.router)
app.include_router(notes.router)
app.include_router(pomodoro.router)
app.include_router(user.router)
app.include_router(finance.router)
app.include_router(goals.router)


@app.get("/health")
def health():
    return {"status": "ok"}
