from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import traceback

from app.db.database import get_db
from app.db.repository import JobRepository
from app.services.inference_service import InferenceService
from app.services.video_inference_service import (
    VideoInferenceService
)
router = APIRouter(
    prefix="/inference",
    tags=["Inference"]
)

@router.post("/video/{job_id}")
def run_video_inference(
    job_id: int,
    model_name: str,
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

    JobRepository.update_status(
        db,
        job_id,
        "processing"
    )

    try:

        video_path = (
            f"data/uploads/{job.filename}"
        )

        result = (
            VideoInferenceService
            .run_video_inference(
                video_path=video_path,
                model_name=job.model_name
            )
        )

        JobRepository.update_status(
            db,
            job_id,
            "completed"
        )

        return {
            "job_id": job_id,
            "status": "completed",
            "video_path":
                result["output_path"],
            "frames_processed":
                result["frames_processed"]
        }

    except Exception as e:

        JobRepository.update_status(
            db,
            job_id,
            "failed"
        )

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
@router.post("/{job_id}")
def run_inference(
    job_id: int,
    model_name: str,
    db: Session = Depends(get_db)
):

    try:

        job = JobRepository.get_job(db, job_id)

        print("JOB =", job)
        print("JOB TYPE =", type(job))

        if not job:
            raise HTTPException(
                status_code=404,
                detail="Job not found"
            )

        JobRepository.update_status(
            db,
            job_id,
            "processing"
        )

        image_path = f"data/uploads/{job.filename}"

        print("IMAGE PATH =", image_path)

        result = InferenceService.run_image_inference(
            image_path=image_path,
            model_name=job.model_name
        )

        print("RESULT TYPE =", type(result))
        print("RESULT =", result)

        JobRepository.update_status(
            db,
            job_id,
            "completed"
        )

        response = {
            "job_id": job_id,
            "status": "completed",
            "result_path": result["output_path"],
            "metadata_path": result["metadata_path"],
            "detections": result["detections"]
        }

        print("RESPONSE =", response)

        return response

    except Exception as e:

        print("\n\n===== FULL ERROR =====")
        traceback.print_exc()
        print("======================\n\n")

        try:
            JobRepository.update_status(
                db,
                job_id,
                "failed"
            )
        except Exception:
            traceback.print_exc()

        raise HTTPException(
            status_code=500,
            detail=str(e)
        )
    
