# CV Inference Dashboard

A production-style full-stack computer vision application. Upload images or videos, run AI inference using YOLOv8 models, and view annotated results on an interactive dashboard with live per-frame metadata.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser                              │
│              React + Vite + Tailwind CSS                    │
│     Upload → Status Polling → Dashboard + Metadata Sidebar  │
└───────────────────────┬─────────────────────────────────────┘
                        │ HTTP (REST)
                        ▼
┌─────────────────────────────────────────────────────────────┐
│                FastAPI Backend  :8000                       │
│   POST /upload  ·  GET /jobs/*  ·  GET /models  ·  /health  │
└──────────┬────────────────────────────┬────────────────────-┘
           │ Enqueue task               │ Read results
           ▼                            ▼
┌────────────────────┐      ┌─────────────────────────────────┐
│  Redis :6379       │      │  Local Volume  /data/           │
│  (Celery broker)   │      │  ├── uploads/                   │
└────────┬───────────┘      │  └── results/                   │
         │                  │       ├── predictions/          │
         ▼                  │       ├── videos/               │
┌────────────────────┐      │       └── metadata/             │
│  Celery Worker     └──────┘                                 │
│  YOLOv8 / YOLOv8-Seg                                        │
│  Inference + FFmpeg re-encode                               │
└─────────────────────────────────────────────────────────────┘
```

## Supported Models

| Model | Task | File |
|---|---|---|
| YOLOv8n | Object Detection (80 COCO classes) | `yolov8n.pt` |
| YOLOv8n-Seg | Detection + Instance Segmentation | `yolov8n-seg.pt` |

## Prerequisites

- **Docker** ≥ 24 and **Docker Compose** ≥ 2.20
- ~3 GB free disk space (images + model weights)
- GPU optional (CPU inference works, but is slower)

## Quick Start

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd <repo-dir>

# 2. Copy environment config
cp .env.example .env

# 3. Build and start all services (one command)
docker compose up --build

# 4. Open the app
open http://localhost        # Frontend (Nginx)
open http://localhost:8000/docs  # FastAPI Swagger UI
```

> **Model weights** (`yolov8n.pt`, `yolov8n-seg.pt`) are mounted from the project root into the containers. If they are not present, the Celery worker will download them automatically from Ultralytics on first inference.

## Configuration

All configuration lives in `.env`. Copy `.env.example` to get started.

| Variable | Default | Description |
|---|---|---|
| `APP_NAME` | `CV Full Stack Backend` | FastAPI app title |
| `DATABASE_URL` | `sqlite:///./jobs.db` | SQLite DB path |
| `REDIS_URL` | `redis://localhost:6379/0` | Celery broker URL |
| `MAX_FILE_SIZE_MB` | `500` | Max upload size in MB |
| `ALLOWED_EXTENSIONS` | `jpg,jpeg,png,mp4,avi,mov` | Allowed file types |
| `DEFAULT_MODEL` | `yolov8n` | Default model if none specified |
| `UPLOAD_DIR` | `data/uploads` | Upload directory |
| `RESULT_DIR` | `data/results` | Results directory |
| `VITE_API_BASE_URL` | `http://localhost:8000` | Frontend → Backend URL |

## API Reference

### Upload & Jobs

```bash
# Upload a file and start inference
curl -X POST http://localhost:8000/upload \
  -F "file=@/path/to/image.jpg" \
  -F "model_name=detection"

# Poll job status
curl http://localhost:8000/jobs/1

# Get annotated result image/video
curl http://localhost:8000/jobs/1/result --output result.jpg

# Get all frame metadata
curl http://localhost:8000/jobs/1/metadata

# Get single frame metadata
curl http://localhost:8000/jobs/1/metadata/42
```

### Models & Health

```bash
# List available models
curl http://localhost:8000/models

# Health check
curl http://localhost:8000/health
```

## Running Tests

```bash
# With venv activated
pip install pytest httpx
pytest tests/ -v

# Or via Docker
docker compose exec backend pytest tests/ -v
```

## Known Limitations & Future Work

- **No GPU support yet** — inference runs on CPU only. Future: add `nvidia-docker` runtime and `device_requests` in compose.
- **No real-time streaming** — processing is fully async (upload → poll). Future: WebSocket streaming per frame.
- **Single worker concurrency** — set `--concurrency=1` in worker to avoid VRAM OOM on shared GPU.
- **No object tracking** — each frame is independent. Future: SORT or ByteTrack integration.
- **SQLite** — fine for single-node dev, but should be swapped for PostgreSQL in multi-replica production.
- **Model weights not bundled** — downloaded on first use. Future: bake into image or use a model registry.
