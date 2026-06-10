from pathlib import Path
from uuid import uuid4
from fastapi import UploadFile
import shutil


UPLOAD_DIR = Path("data/uploads")

UPLOAD_DIR.mkdir(
    parents=True,
    exist_ok=True
)


ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".mp4",
    ".avi",
    ".mov"
}


class FileService:

    @staticmethod
    def validate_file(filename: str):

        extension = Path(filename).suffix.lower()

        if extension not in ALLOWED_EXTENSIONS:
            raise ValueError(
                f"Unsupported file type: {extension}"
            )

    @staticmethod
    def save_file(file: UploadFile):

        FileService.validate_file(file.filename)

        extension = Path(
            file.filename
        ).suffix.lower()

        unique_name = (
            f"{uuid4()}{extension}"
        )

        destination = (
            UPLOAD_DIR / unique_name
        )

        with open(destination, "wb") as buffer:
            shutil.copyfileobj(
                file.file,
                buffer
            )

        return unique_name