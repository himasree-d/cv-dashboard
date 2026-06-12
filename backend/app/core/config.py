from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str
    API_V1_PREFIX: str
    DATABASE_URL: str
    REDIS_URL: str
    MAX_FILE_SIZE_MB: int
    ALLOWED_EXTENSIONS: str
    DEFAULT_MODEL: str
    UPLOAD_DIR: str
    RESULT_DIR: str

    class Config:
        env_file = ".env"

    @property
    def allowed_extensions_list(self) -> List[str]:
        return [
            ext.strip().lower()
            for ext in self.ALLOWED_EXTENSIONS.split(",")
        ]


settings = Settings()