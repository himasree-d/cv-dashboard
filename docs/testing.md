# Test Plan

Manual test plan for the CV Inference Dashboard. All tests should be performed with all services running (`docker compose up` or all three local processes).

## Environment Setup

Before running tests:
1. All services are running (backend on `:8000`, frontend on `:80` or `:5173`)
2. Celery worker is connected to Redis
3. At least one test image (JPG/PNG) and one test video (MP4) are available

---

## Test Cases

### TC-01 — Upload a JPEG Image (YOLOv8 Detection)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to the Upload page | Drop zone and model selector are visible |
| 2 | Drag a `.jpg` file into the drop zone | File name appears in the drop zone |
| 3 | Select **YOLOv8n — Object Detection** model | Model card is highlighted |
| 4 | Click **Run Inference** | Button disappears; progress bar appears at "Uploading…" |
| 5 | Wait for completion | Progress bar reaches 100% and page redirects to Dashboard |
| 6 | View Dashboard | Annotated image shown with bounding boxes |
| 7 | Check right sidebar | Object names and confidence scores are displayed |

---

### TC-02 — Upload an MP4 Video (YOLOv8 Detection)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Navigate to Upload page | |
| 2 | Select a `.mp4` file | File accepted |
| 3 | Choose **YOLOv8n — Object Detection** | |
| 4 | Click **Run Inference** | Job queued; status shows processing |
| 5 | Wait for video to be processed | Redirect to Dashboard |
| 6 | Play the annotated video | Annotated video plays with bounding boxes drawn |
| 7 | Check frame counter | Frame index increments during playback |

---

### TC-03 — Metadata Sidebar Syncs with Video Playback

| Step | Action | Expected Result |
|---|---|---|
| 1 | Open a completed video job Dashboard | |
| 2 | Let the video play for a few seconds | Sidebar updates every ~100ms |
| 3 | Pause at any point | Sidebar shows detections for that exact frame |
| 4 | Drag the seek bar to a different position | Sidebar immediately updates to new frame's detections |
| 5 | Scrub to a frame with no detections | Sidebar shows "No detections in this frame" |
| 6 | Scrub to a frame with many objects | Primary object card shows highest-confidence detection |

---

### TC-04 — Model Switching (Same File, Different Models)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Upload an image with **Detection** model | Job completes, shown in Jobs History |
| 2 | Upload the **same image** with **Segmentation** model | Second job created, both listed in Jobs History |
| 3 | Open Jobs History page | Both jobs listed with correct model names |
| 4 | Click first job | Dashboard shows bounding boxes only |
| 5 | Click second job | Dashboard shows segmentation masks |

---

### TC-05 — Error Handling: Unsupported File Type

| Step | Action | Expected Result |
|---|---|---|
| 1 | Attempt to drop a `.pdf` or `.txt` file | Drop zone rejects it (file not accepted) |
| 2 | If forced via API: `curl -X POST /upload -F "file=@doc.pdf"` | `400 Bad Request` with error message |

---

### TC-06 — Large File Upload (≥100 MB video)

| Step | Action | Expected Result |
|---|---|---|
| 1 | Select a video file > 100 MB | File is accepted (up to `MAX_FILE_SIZE_MB`) |
| 2 | Start inference | Job queued and processing begins |
| 3 | Wait for completion (may take several minutes on CPU) | Job completes; video playback works |
| 4 | Check that no OOM error occurs | Worker logs show success, job status is `completed` |

---

### TC-07 — Jobs History Page

| Step | Action | Expected Result |
|---|---|---|
| 1 | Process at least 2 different files | |
| 2 | Navigate to **Jobs** in the navbar | All past jobs listed |
| 3 | Verify columns | Status badge, model, filename, type, timestamp, link shown |
| 4 | Click **View** on any job | Opens that job's Dashboard |
| 5 | Verify completed jobs show green badge | `completed` → green, `failed` → red |

---

### TC-08 — API Endpoints (curl)

```bash
# Health check
curl http://localhost:8000/health
# Expected: {"status": "healthy"}

# List models
curl http://localhost:8000/models
# Expected: {"models": [...]}

# Poll a specific job
curl http://localhost:8000/jobs/1
# Expected: {id, status, filename, model_name, ...}

# Fetch all frame metadata
curl http://localhost:8000/jobs/1/metadata
# Expected: {filename, model, fps, frames: [...]}

# Fetch a specific frame
curl http://localhost:8000/jobs/1/metadata/0
# Expected: {frame_index, timestamp_ms, model, detections, ...}
```

---

### TC-09 — Docker Cold Start

| Step | Action | Expected Result |
|---|---|---|
| 1 | `docker compose down -v` | All containers stopped |
| 2 | `docker compose up --build` | All 4 services start |
| 3 | `docker compose ps` | All show `Up (healthy)` |
| 4 | Upload a test image | End-to-end inference works |

---

## Automated Tests

```bash
# Run the backend test suite
cd /path/to/project
source venv/bin/activate
pytest tests/ -v --tb=short
```

Current coverage areas:
- Upload endpoint validation
- Job status transitions
- Metadata schema correctness
- File storage paths
