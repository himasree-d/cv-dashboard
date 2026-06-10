from pathlib import Path

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException,
    Form
)

from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.repository import JobRepository
from app.schemas.upload import UploadResponse
from app.services.file_service import FileService

from app.core.constants import AVAILABLE_MODELS

from app.tasks.image_tasks import process_image
from app.tasks.video_tasks import process_video


router = APIRouter(
    prefix="/upload",
    tags=["Upload"]
)


def get_db():

    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()


IMAGE_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png"
}

VIDEO_EXTENSIONS = {
    ".mp4",
    ".avi",
    ".mov"
}


@router.post(
    "",
    response_model=UploadResponse
)
def upload_file(
    file: UploadFile = File(...),
    model_name: str = Form(...),
    db: Session = Depends(get_db)
):

    if model_name not in AVAILABLE_MODELS:

        raise HTTPException(
            status_code=400,
            detail="Invalid model selection"
        )

    selected_model = AVAILABLE_MODELS[
        model_name
    ]

    try:

        saved_filename = (
            FileService.save_file(file)
        )

        job = (
            JobRepository.create_job(
                db=db,
                filename=saved_filename,
                model_name=selected_model
            )
        )

        extension = (
            Path(saved_filename)
            .suffix
            .lower()
        )

        # Queue image jobs
        if extension in IMAGE_EXTENSIONS:

            process_image.delay(
                job.id
            )

        # Queue video jobs
        elif extension in VIDEO_EXTENSIONS:

            process_video.delay(
                job.id
            )

        else:

            raise HTTPException(
                status_code=400,
                detail="Unsupported file type"
            )

        return UploadResponse(
            job_id=job.id,
            filename=job.filename,
            status=job.status,
            model_name=job.model_name
        )

    except ValueError as e:

        raise HTTPException(
            status_code=400,
            detail=str(e)
        )