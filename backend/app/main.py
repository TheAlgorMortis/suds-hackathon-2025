from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import init_routes


app = FastAPI()

origins = ["http://localhost:5173"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


init_routes(app)


@app.get("/health")
async def root():
    return {"message": "Hello world"}
