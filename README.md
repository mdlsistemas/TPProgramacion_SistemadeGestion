# Trabajo Práctico Integrador

### **Institución:** Universidad de la Ciudad de Buenos Aires  
### **Carrera:** Licenciatura en Tecnologías Digitales  
### **Asignatura:** Programación de Vanguardia  

## **Integrantes del grupo:**
- Alejandro Velazquez  
- Cristian Navarro  
- Federico Vicente  
- Joel Ochoa  
- Lucas Álvarez  
- Matías Bernardo  

---

##  Descripción del proyecto

Sistema de gestión de productos y stock desarrollado como parte del Trabajo Práctico Integrador. Utiliza FastAPI para la creación de una API REST, con autenticación basada en JWT y base de datos SQLite.

---

##  Tecnologías utilizadas

- **Python 3.13**
- **FastAPI** (API REST)
- **SQLite** (Base de datos en memoria para testing)
- **SQLAlchemy** (ORM)
- **Pytest** (Testing)
- **Passlib** y **JWT** (Autenticación y hashing)
- **Pydantic** (Validación de datos)

---

##  Instalación y ejecución

1. Clonar este repositorio
2. Crear y activar un entorno virtual
3. Instalar dependencias:
   ```bash
   pip install pydantic
   pip install pydantic[email]
   pip install python-multipart
   pip install pytest
   pip install httpx
   ```
4. Ejecutar el servidor:
   ```bash
   uvicorn backend.main:app --reload
   ```

---

##  Ejecución de pruebas

Para ejecutar las pruebas unitarias:

```bash
pytest -v -s
```

Esto corre las pruebas definidas en `tests/`, utilizando una base de datos SQLite en memoria para garantizar aislamiento.

---

##  Estructura de carpetas

```
TP Programacion/
│
├── backend/             # Lógica de negocio y API
│   ├── main.py
│   ├── models.py
│   ├── crud.py
│   └── ...
│
├── tests/               # Pruebas automatizadas con pytest
│   ├── conftest.py
│   └── test_productos.py
│
├── requirements.txt     # Dependencias del proyecto
└── README.md            # Este archivo
```
