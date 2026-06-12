from pydantic import BaseModel


class UploadRequest(BaseModel):
    model_name: str


class UploadResponse(BaseModel):
    job_id: int
    filename: str
    status: str
    model_name: str