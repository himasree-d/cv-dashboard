from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import DateTime

from datetime import datetime

from app.db.database import Base


class Job(Base):
    __tablename__ = "jobs"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    filename = Column(
        String,
        nullable=False
    )

    status = Column(
        String,
        default="queued"
    )

    model_name = Column(
        String,
        nullable=False
    )

    created_at = Column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at = Column(
        DateTime,
        default=datetime.utcnow
    )