# Setup Guide

Complete setup instructions for the CV Inference Dashboard from a cold clone to a running application.

## Prerequisites

| Tool | Minimum Version | Install |
|---|---|---|
| Docker | 24.0 | https://docs.docker.com/get-docker/ |
| Docker Compose | 2.20 | Included with Docker Desktop |
| Git | 2.x | https://git-scm.com/ |

**Disk space:** ~3 GB (Docker images + model weights + sample data)  
**RAM:** 4 GB minimum, 8 GB recommended for video inference

---

## 1. Clone and Configure

```bash
git clone <your-repo-url>
cd <repo-dir>

# Copy the environment template
cp .env.example .env
```

Edit `.env` if you need to change ports or paths. The defaults work for local development.

---

## 2. Model Weights

The model weights are **not bundled** in the Docker image to keep it lean. Two options:

**Option A — Pre-download (recommended for first run):**
```bash
pip install ultralytics
python -c "from ultralytics import YOLO; YOLO('yolov8n.pt'); YOLO('yolov8n-seg.pt')"
```
This downloads `yolov8n.pt` and `yolov8n-seg.pt` to the project root. Docker Compose mounts them into the containers.

**Option B — Auto-download on first inference:**
Simply skip the step above. Ultralytics will auto-download the weights the first time a job is processed. Requires internet access in the container.

---

## 3. Build and Start

```bash
docker compose up --build
```

On first build, this will:
1. Build the Python backend image (~2–3 min)
2. Build the React frontend image with Nginx (~1 min)
3. Pull Redis 7 Alpine
4. Start all 4 services

To run in the background:
```bash
docker compose up --build -d
```

---

## 4. Verify All Services Are Healthy

```bash
# Check container status
docker compose ps

# Expected output:
# NAME          STATUS
# cv_redis      Up (healthy)
# cv_backend    Up (healthy)
# cv_worker     Up (healthy)
# cv_frontend   Up (healthy)
```

**Health endpoints:**
```bash
curl http://localhost:8000/health    # {"status": "healthy"}
curl http://localhost/health         # healthy
redis-cli -h localhost ping         # PONG
```

**API documentation:**
```
http://localhost:8000/docs          # Swagger UI (interactive)
http://localhost:8000/redoc         # ReDoc
```

**Frontend:**
```
http://localhost                    # Main app
```

---

## 5. Common Troubleshooting

### Port already in use

```bash
# Find and kill the process using port 8000
lsof -ti:8000 | xargs kill -9
lsof -ti:80 | xargs kill -9
```

Or change the port mapping in `docker-compose.yml`:
```yaml
ports:
  - "8080:8000"   # Change 8000 → 8080
```

### Backend container exits immediately

```bash
docker compose logs backend
```
Usually means a Python import error. Check that `requirements.txt` has all dependencies.

### Celery worker not picking up tasks

```bash
docker compose logs worker
```
If Redis connection refused: ensure Redis is healthy before the worker starts (handled by `depends_on` with health check).

### Out of memory during video inference

Reduce worker concurrency in `docker-compose.yml`:
```yaml
command: celery -A celery_app worker --loglevel=info --concurrency=1
```

### Model weights not found

Ensure `yolov8n.pt` and `yolov8n-seg.pt` are in the project root. They are mounted via the volume:
```yaml
volumes:
  - ./yolov8n.pt:/app/yolov8n.pt
```

### GPU not detected

Add to the worker service in `docker-compose.yml`:
```yaml
deploy:
  resources:
    reservations:
      devices:
        - driver: nvidia
          count: 1
          capabilities: [gpu]
```
Requires `nvidia-container-toolkit` installed on the host.

---

## 6. Stopping and Cleanup

```bash
# Stop all services
docker compose down

# Stop and remove all data volumes
docker compose down -v

# Remove all built images
docker compose down --rmi all
```
