# ── Backend Dockerfile ─────────────────────────────────────────────────────────
# Uses python:3.11-slim. Model weights are downloaded on first run (not baked in)
# to keep the image lean. See docs/setup.md for details.
FROM python:3.11-slim

# System dependencies: ffmpeg for H.264 re-encoding, libgomp for PyTorch
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    libglib2.0-0 \
    libsm6 \
    libxext6 \
    libxrender-dev \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Install Python dependencies first (layer cache)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source
COPY app/ ./app/
COPY celery_app.py .

# Create data directories
RUN mkdir -p data/uploads data/results/predictions data/results/metadata data/results/videos

# Expose the FastAPI port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD python -c "import urllib.request; urllib.request.urlopen('http://localhost:8000/health')"

# Download model weights on first run via entrypoint
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
