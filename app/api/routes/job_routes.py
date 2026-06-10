from fastapi import APIRouter

from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.repository import JobRepository


from typing import List

from app.schemas.job import (
    JobCreate,
    JobResponse,
    JobStatusUpdate
)

from pathlib import Path
import json
from pathlib import Path
from fastapi.responses import FileResponse

router = APIRouter(
    prefix="/jobs",
    tags=["Jobs"]
)


def get_db():
    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()


@router.post(
    "",
    response_model=JobResponse
)
def create_job(
    payload: JobCreate,
    db: Session = Depends(get_db)
):
    job = JobRepository.create_job(
        db=db,
        filename=payload.filename,
        model_name=payload.model_name
    )

    return job


@router.get("/{job_id}/metadata")
def get_job_metadata(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = JobRepository.get_job(
        db,
        job_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    metadata_file = (
        Path("data/results/metadata")
        / f"{Path(job.filename).stem}.json"
    )

    if not metadata_file.exists():
        raise HTTPException(
            status_code=404,
            detail="Metadata not found"
        )

    with open(metadata_file) as f:
        return json.load(f)
@router.get(
    "",
    response_model=List[JobResponse]
)
def get_all_jobs(
    db: Session = Depends(get_db)
):
    return JobRepository.list_jobs(db)
@router.patch(
    "/{job_id}/status",
    response_model=JobResponse
)
def patch_job_status(
    job_id: int,
    payload: JobStatusUpdate,
    db: Session = Depends(get_db)
):
    job = JobRepository.update_status(
    db,
    job_id,
    payload.status.value
)
    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    return job
@router.get("/{job_id}/result")
def get_result_image(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = JobRepository.get_job(
        db,
        job_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    image_path = (
        Path("data/results/predictions")
        / job.filename
    )

    if not image_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Result image not found"
        )

    return FileResponse(image_path)

@router.get("/{job_id}/video")
def get_result_video(
    job_id: int,
    db: Session = Depends(get_db)
):

    job = JobRepository.get_job(
        db,
        job_id
    )

    if not job:
        raise HTTPException(
            status_code=404,
            detail="Job not found"
        )

    video_path = (
        Path("data/results/videos")
        / job.filename
    )

    if not video_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Video not found"
        )

    return FileResponse(
        path=video_path,
        media_type="video/mp4",
        filename=job.filename
    )