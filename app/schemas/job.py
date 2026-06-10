from pydantic import BaseModel

from app.core.job_status import JobStatus


class JobCreate(BaseModel):
    filename: str
    model_name: str


class JobResponse(BaseModel):
    id: int
    filename: str
    status: str
    model_name: str

    class Config:
        from_attributes = True

class JobStatusUpdate(BaseModel):
    status: JobStatus