from fastapi import FastAPI
from app.routes import router as router

app = FastAPI()

@app.get("/")
def health_check():
    return {"status": "ok"}

app.include_router(router)