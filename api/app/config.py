from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file="app/.env", case_sensitive=False)
    
    # Supabase
    public_supabase_url: str
    public_supabase_anon_key: str

    # Database
    private_db_server: str
    private_db_database: str
    private_db_user: str
    private_db_password: str
    private_db_port: int
    
    # # CORS
    allowed_origins: List[str] = ["http://localhost:3000"]

settings = Settings()
