from pathlib import Path
import json

from fastapi import APIRouter
from fastapi import HTTPException

router = APIRouter(
    prefix="/metadata",
    tags=["Metadata"]
)


@router.get("/{filename}")
def get_metadata(filename: str):

    metadata_path = (
        Path("data/results/metadata")
        / f"{filename}.json"
    )

    if not metadata_path.exists():
        raise HTTPException(
            status_code=404,
            detail="Metadata not found"
        )

    with open(metadata_path, "r") as f:
        return json.load(f)
    