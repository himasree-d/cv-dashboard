from pathlib import Path

from celery_app import celery

from app.db.database import SessionLocal
from app.db.repository import JobRepository

from app.core.job_status import JobStatus
from app.services.inference_service import InferenceService


@celery.task
def process_image(job_id: int):

    db = SessionLocal()

    try:

        JobRepository.update_status(
            db,
            job_id,
            JobStatus.PROCESSING.value
        )

        job = JobRepository.get_job(
            db,
            job_id
        )

        image_path = (
            Path("data/uploads")
            / job.filename
        )

        InferenceService.run_image_inference(
            str(image_path),
            job.model_name
        )

        JobRepository.update_status(
            db,
            job_id,
            JobStatus.COMPLETED.value
        )

    except Exception as e:

        print("IMAGE TASK ERROR:", e)

        JobRepository.update_status(
            db,
            job_id,
            JobStatus.FAILED.value
        )

    finally:

        db.close()