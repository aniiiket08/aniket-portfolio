from typing import Literal
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application settings loaded from environment variables or .env file."""

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application Information
    PROJECT_NAME: str = "Meeting Organizer Agent"
    VERSION: str = "0.1.0"
    API_V1_STR: str = "/api/v1"

    # LLM Settings
    LLM_PROVIDER: Literal["anthropic", "openrouter"] = Field(
        default="openrouter",
        description="LLM provider: 'anthropic' or 'openrouter'",
    )
    LLM_MODEL: str = Field(
        default="anthropic/claude-3.5-sonnet",
        description="Model name to pass to the provider",
    )
    ANTHROPIC_API_KEY: str | None = Field(
        default=None,
        description="API key for Anthropic provider",
    )
    OPENROUTER_API_KEY: str | None = Field(
        default=None,
        description="API key for OpenRouter provider",
    )
    OPENROUTER_BASE_URL: str = Field(
        default="https://openrouter.ai/api/v1",
        description="Base URL for OpenRouter API",
    )

    # Security
    SECRET_KEY: str = Field(
        default="super-secret-key-change-in-production",
        description="JWT secret key",
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 hours

    # Database
    DATABASE_URL: str = Field(
        default="sqlite:///./sql_app.db",
        description="SQLAlchemy database URL",
    )

    # Vector Storage
    CHROMADB_PATH: str = Field(
        default="./data/chroma",
        description="Path to ChromaDB persistent directory",
    )

    # Logging
    LOG_LEVEL: str = Field(
        default="INFO",
        description="Log level (DEBUG, INFO, WARNING, ERROR, CRITICAL)",
    )


settings = Settings()
