from app.db.database import engine, Base
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api.routes.job_routes import router as job_router
from app.api.routes.upload_routes import router as upload_router
from app.api.routes.inference_routes import router as inference_router
from app.api.routes.metadata_routes import router as metadata_router
from app.api.routes.dashboard_routes import router as dashboard_router

app = FastAPI(
    title=settings.APP_NAME,
    description="Computer Vision Inference Dashboard API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

app.mount("/predictions", StaticFiles(directory="data/results/predictions"), name="predictions")
app.mount("/metadata_files", StaticFiles(directory="data/results/metadata"), name="metadata_files")
app.mount("/videos", StaticFiles(directory="data/results/videos"), name="videos")

app.include_router(job_router)
app.include_router(upload_router)
app.include_router(inference_router)
app.include_router(metadata_router)
app.include_router(dashboard_router)

AVAILABLE_MODELS = [
    {
        "id": "detection",
        "name": "YOLOv8n — Object Detection",
        "description": "Fast and accurate real-time object detection across 80 COCO classes.",
        "task": "detection",
        "weight_file": "yolov8n.pt"
    },
    {
        "id": "segmentation",
        "name": "YOLOv8n-Seg — Instance Segmentation",
        "description": "Object detection with pixel-level instance segmentation masks.",
        "task": "segmentation",
        "weight_file": "yolov8n-seg.pt"
    }
]

@app.get("/models", tags=["Models"])
def list_models():
    """Return all available computer vision models."""
    return {"models": AVAILABLE_MODELS}

@app.get("/", tags=["Health"])
def root():
    return {"message": "CV Dashboard API is running", "docs": "/docs"}

@app.get("/health", tags=["Health"])
def health():
    return {"status": "healthy"}
