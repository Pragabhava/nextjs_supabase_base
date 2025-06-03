from .config import settings
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# Create FastAPI app
app = FastAPI(
    title="SP ERP API",
    description="FastAPI backend for SP ERP application",
    version="1.0.0"
)

# CORS middleware to allow Next.js frontend to communicate
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health check endpoint (important for Docker healthcheck)
@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "SP ERP API"}

# Root endpoint
@app.get("/")
async def root():
    return {"message": "SP ERP API is running!", "environment": "production"}

# Example API endpoints
@app.get("/api/hello")
async def hello():
    return {"message": "Hello from FastAPI!", "framework": "FastAPI"}

@app.get("/api/config")
async def get_config():
    return {
        "supabase_url": settings.public_supabase_url,
        "database_server": settings.private_db_server,
        "database_name": settings.private_db_database,
        "allowed_origins": settings.allowed_origins
    }

# Run the app (for development)
if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )