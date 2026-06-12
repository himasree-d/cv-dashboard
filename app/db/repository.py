from sqlalchemy.orm import Session

from app.db.models import Job


class JobRepository:

    @staticmethod
    def create_job(
        db: Session,
        filename: str,
        model_name: str
    ):
        job = Job(
            filename=filename,
            model_name=model_name
        )

        db.add(job)
        db.commit()
        db.refresh(job)

        return job

    @staticmethod
    def get_job(
        db: Session,
        job_id: int
    ):
        return (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )
    @staticmethod
    def list_jobs(db: Session):
        return (
            db.query(Job)
            .order_by(Job.created_at.desc())
            .all()
        )


    @staticmethod
    def update_status(
        db: Session,
        job_id: int,
        status: str
    ):
        job = (
            db.query(Job)
            .filter(Job.id == job_id)
            .first()
        )

        if not job:
            return None

        job.status = status

        db.commit()
        db.refresh(job)

        return job
    @staticmethod
    def update_filename(
        db: Session,
        job_id: int,
        filename: str
    ):
        job = db.query(Job).filter(
            Job.id == job_id
        ).first()

        if not job:
            return None

        job.filename = filename

        db.commit()
        db.refresh(job)

        return job