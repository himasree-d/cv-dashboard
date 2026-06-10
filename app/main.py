from app.db.database import engine
from app.db.database import Base
from fastapi import FastAPI
from app.core.config import settings
from app.api.routes.job_routes import router as job_router
from app.api.routes.upload_routes import router as upload_router
from app.api.routes.inference_routes import router as inference_router
print("UPLOAD ROUTER IMPORTED")
from app.api.routes.metadata_routes import router as metadata_router
from fastapi.staticfiles import StaticFiles
from app.api.routes.dashboard_routes import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME
)
Base.metadata.create_all(bind=engine)
app.mount(
    "/predictions",
    StaticFiles(directory="data/results/predictions"),
    name="predictions"
)

app.mount(
    "/metadata_files",
    StaticFiles(directory="data/results/metadata"),
    name="metadata_files"
)
app.mount(
    "/videos",
    StaticFiles(
        directory="data/results/videos"
    ),
    name="videos"
)
app.include_router(job_router)
app.include_router(upload_router)
print("UPLOAD ROUTER REGISTERED")
app.include_router(inference_router)
app.include_router(metadata_router)
app.include_router(dashboard_router)

@app.get("/")
def root():
    return {
        "message": "Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy"
    }

for route in app.routes:
    print(route.path)
