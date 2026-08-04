from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = Field(default="Embodied Collect Backend", alias="APP_NAME")
    app_env: str = Field(default="dev", alias="APP_ENV")
    debug: bool = Field(default=True, alias="DEBUG")
    api_v1_prefix: str = Field(default="/api/v1", alias="API_V1_PREFIX")

    secret_key: str = Field(default="change_me", alias="SECRET_KEY")
    access_token_expire_minutes: int = Field(default=120, alias="ACCESS_TOKEN_EXPIRE_MINUTES")
    refresh_token_expire_minutes: int = Field(default=10080, alias="REFRESH_TOKEN_EXPIRE_MINUTES")
    jwt_algorithm: str = "HS256"

    mysql_host: str = Field(default="127.0.0.1", alias="MYSQL_HOST")
    mysql_port: int = Field(default=3306, alias="MYSQL_PORT")
    mysql_user: str = Field(default="root", alias="MYSQL_USER")
    mysql_password: str = Field(default="123456", alias="MYSQL_PASSWORD")
    mysql_db: str = Field(default="embodied_collect", alias="MYSQL_DB")
    mysql_charset: str = Field(default="utf8mb4", alias="MYSQL_CHARSET")

    redis_url: str = Field(default="redis://127.0.0.1:6379/0", alias="REDIS_URL")
    minio_endpoint: str = Field(default="127.0.0.1:9000", alias="MINIO_ENDPOINT")
    minio_access_key: str = Field(default="minioadmin", alias="MINIO_ACCESS_KEY")
    minio_secret_key: str = Field(default="minioadmin", alias="MINIO_SECRET_KEY")
    minio_secure: bool = Field(default=False, alias="MINIO_SECURE")
    minio_bucket: str = Field(default="embodied-collect", alias="MINIO_BUCKET")

    @property
    def sqlalchemy_database_uri(self) -> str:
        return (
            f"mysql+asyncmy://{self.mysql_user}:{self.mysql_password}"
            f"@{self.mysql_host}:{self.mysql_port}/{self.mysql_db}?charset={self.mysql_charset}"
        )


settings = Settings()
