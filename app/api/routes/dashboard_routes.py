from fastapi import APIRouter
from sqlalchemy.orm import Session

from app.db.database import SessionLocal
from app.db.models import Job

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


@router.get("/stats")
def dashboard_stats():

    db: Session = SessionLocal()

    try:

        total_jobs = db.query(Job).count()

        completed = (
            db.query(Job)
            .filter(Job.status == "completed")
            .count()
        )

        processing = (
            db.query(Job)
            .filter(Job.status == "processing")
            .count()
        )

        queued = (
            db.query(Job)
            .filter(Job.status == "queued")
            .count()
        )

        failed = (
            db.query(Job)
            .filter(Job.status == "failed")
            .count()
        )

        return {
            "total_jobs": total_jobs,
            "completed": completed,
            "processing": processing,
            "queued": queued,
            "failed": failed
        }

    finally:
        db.close()