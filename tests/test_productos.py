import pytest
from backend import crud

def test_crear_listar_get_producto(db_session):
    # 1) Generar un nuevo ID
    nuevo_id = crud.generar_product_id(db_session)
    # 2) Crear producto
    prod = crud.crear_producto(
        db_session,
        product_id=nuevo_id,
        product_name="Producto Demo",
        sku="SKU-DEMO",
        unit_of_measure="unidad",
        cost=100.0,
        sale_price=150.0,
        category="Categoría X",
        location="Depósito A",
        active="Yes",
        foto=None
    )
    # 3) Validaciones básicas
    assert prod.product_id == nuevo_id
    assert prod.product_name == "Producto Demo"

    # 4) Listar y comprobar que hay exactamente 1
    lista = crud.listar_productos(db_session)
    assert len(lista) == 1
    assert lista[0].product_id == nuevo_id

    # 5) Obtener por ID
    encontrado = crud.get_producto_by_id(db_session, nuevo_id)
    assert encontrado is not None
    assert encontrado.product_name == "Producto Demo"

    print("\n✅ Test de productos completado exitosamente")