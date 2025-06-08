# tests/conftest.py
import os
import sys
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

# 1) Ruta al root del proyecto (donde está carpeta backend/)
PROJECT_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
# 2) Insertamos primero el path a backend/ para que "import models" resuelva backend/models.py
sys.path.insert(0, os.path.join(PROJECT_ROOT, 'backend'))
# 3) Luego insertamos el root para que "import backend.database" funcione
sys.path.insert(0, PROJECT_ROOT)

from database import Base       # carga backend/database.py
from crud import generar_product_id  # opcional, si lo necesitás en algún fixture

# Crear motor SQLite en memoria
ENGINE = create_engine(
    "sqlite:///:memory:",
    connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=ENGINE
)

@pytest.fixture(scope="session", autouse=True)
def init_db():
    # Se ejecuta antes de cualquier test
    Base.metadata.create_all(bind=ENGINE)
    yield
    Base.metadata.drop_all(bind=ENGINE)

@pytest.fixture
def db_session():
    # Cada test obtiene su propia sesión limpia
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()