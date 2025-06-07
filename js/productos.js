document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const tablaProductos = document.getElementById('productos-tbody');
  const buscador = document.getElementById('buscador-productos');
  let listaProductos = [];

  // Renderiza productos
  function renderProductos(productos) {
    tablaProductos.innerHTML = '';
    productos.forEach(prod => {
      const urlFoto = prod.foto
        ? `http://localhost:8000/${prod.foto.replace(/\\/g, "/")}`
        : 'https://cdn-icons-png.flaticon.com/512/2909/2909831.png';
      const stock = (typeof prod.stock !== "undefined" && prod.stock !== null) ? prod.stock : "-";
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${urlFoto}" width="36" height="36" class="rounded"></td>
        <td>${prod.product_id}</td>
        <td>${prod.product_name}</td>
        <td>${prod.sku || ""}</td>
        <td>${prod.unit_of_measure || ""}</td>
        <td>${prod.category || ""}</td>
        <td>${stock}</td>
        <td>${prod.sale_price !== undefined ? `$${prod.sale_price}` : '-'}</td>
        <td>${prod.active === 'Yes' ? 'Sí' : 'No'}</td>
        <td style="min-width:92px;">
          <div class="d-flex flex-column align-items-end gap-1">
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-primary btn-historial" title="Historial" data-id="${prod.product_id}">
                <i class="bi bi-clock-history"></i>
              </button>
              <button class="btn btn-sm btn-outline-success btn-movimiento" title="Movimiento de Stock" data-id="${prod.product_id}">
                <i class="bi bi-arrow-left-right"></i>
              </button>
            </div>
            <div class="d-flex gap-1">
              <button class="btn btn-sm btn-outline-secondary btn-editar" title="Editar" data-id="${prod.product_id}">
                <i class="bi bi-pencil"></i>
              </button>
              <button class="btn btn-sm btn-outline-danger btn-eliminar" title="Eliminar" data-id="${prod.product_id}" data-name="${prod.product_name}">
                <i class="bi bi-trash"></i>
              </button>
            </div>
          </div>
        </td>
      `;
      tablaProductos.appendChild(row);
    });

    // Handler: historial de movimientos
    tablaProductos.querySelectorAll('.btn-historial').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        mostrarHistorialMovimientos(productId);
      });
    });

    // Handler: movimiento de stock
    tablaProductos.querySelectorAll('.btn-movimiento').forEach(btn => {
      btn.addEventListener('click', () => {
        const productId = btn.getAttribute('data-id');
        document.getElementById('mov-product-id').value = productId;
        document.getElementById('mov-tipo').value = '';
        document.getElementById('mov-cantidad').value = '';
        document.getElementById('mov-descripcion').value = '';
        document.getElementById('movimientoStockExito').classList.add('d-none');
        document.getElementById('movimientoStockError').classList.add('d-none');
        new bootstrap.Modal(document.getElementById('modalMovimientoStock')).show();
      });
    });

    // Handler: editar producto
    tablaProductos.querySelectorAll('.btn-editar').forEach(btn => {
      btn.addEventListener('click', () => {
        const prod = listaProductos.find(p => p.product_id === btn.getAttribute('data-id'));
        document.getElementById('editar-id').value = prod.product_id;
        document.getElementById('editar-nombre').value = prod.product_name;
        document.getElementById('editar-sku').value = prod.sku;
        document.getElementById('editar-unit').value = prod.unit_of_measure;
        document.getElementById('editar-cost').value = prod.cost;
        document.getElementById('editar-sale_price').value = prod.sale_price;
        document.getElementById('editar-category').value = prod.category;
        document.getElementById('editar-location').value = prod.location;
        document.getElementById('editar-active').value = prod.active;
        document.getElementById('editar-foto').value = '';
        document.getElementById('editarProductoError').classList.add('d-none');
        document.getElementById('editarProductoExito').classList.add('d-none');
        new bootstrap.Modal(document.getElementById('modalEditarProducto')).show();
      });
    });

    // Handler: eliminar producto
    tablaProductos.querySelectorAll('.btn-eliminar').forEach(btn => {
      btn.addEventListener('click', () => {
        document.getElementById('eliminar-id').value = btn.getAttribute('data-id');
        document.getElementById('eliminar-nombre').textContent = btn.getAttribute('data-name');
        document.getElementById('eliminarProductoExito').classList.add('d-none');
        document.getElementById('eliminarProductoError').classList.add('d-none');
        new bootstrap.Modal(document.getElementById('modalEliminarProducto')).show();
      });
    });
  }

  // Cargar productos de la API
  function cargarProductos() {
    fetch('http://localhost:8000/productos', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado o error al cargar productos');
        return res.json();
      })
      .then(productos => {
        listaProductos = productos;
        renderProductos(productos);
        document.getElementById('productosError').classList.add('d-none');
      })
      .catch(() => {
        document.getElementById('productosError').classList.remove('d-none');
      });
  }

  // Buscador de productos
  buscador.addEventListener('input', e => {
    const valor = e.target.value.trim().toLowerCase();
    const filtrados = listaProductos.filter(p =>
      (p.product_name && p.product_name.toLowerCase().includes(valor)) ||
      (p.sku && p.sku.toLowerCase().includes(valor)) ||
      (p.category && p.category.toLowerCase().includes(valor)) ||
      (p.location && p.location.toLowerCase().includes(valor))
    );
    renderProductos(filtrados);
  });

  // Alta de producto
  document.getElementById('formAgregarProducto').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await fetch('http://localhost:8000/productos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        document.getElementById('agregarProductoExito').classList.remove('d-none');
        document.getElementById('agregarProductoError').classList.add('d-none');
        form.reset();
        bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAgregarProducto')).hide();
        cargarProductos();
      } else {
        document.getElementById('agregarProductoError').classList.remove('d-none');
        document.getElementById('agregarProductoExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('agregarProductoError').classList.remove('d-none');
      document.getElementById('agregarProductoExito').classList.add('d-none');
    }
  });

  // Edición de producto
  document.getElementById('formEditarProducto').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('editar-id').value;
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await fetch(`http://localhost:8000/productos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        document.getElementById('editarProductoExito').classList.remove('d-none');
        document.getElementById('editarProductoError').classList.add('d-none');
        setTimeout(() => {
          bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditarProducto')).hide();
          cargarProductos();
        }, 1000);
      } else {
        document.getElementById('editarProductoError').classList.remove('d-none');
        document.getElementById('editarProductoExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('editarProductoError').classList.remove('d-none');
      document.getElementById('editarProductoExito').classList.add('d-none');
    }
  });

  // Eliminar producto
  document.getElementById('formEliminarProducto').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('eliminar-id').value;
    try {
      const res = await fetch(`http://localhost:8000/productos/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        document.getElementById('eliminarProductoExito').classList.remove('d-none');
        document.getElementById('eliminarProductoError').classList.add('d-none');
        setTimeout(() => {
          bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEliminarProducto')).hide();
          cargarProductos();
        }, 1000);
      } else {
        document.getElementById('eliminarProductoError').classList.remove('d-none');
        document.getElementById('eliminarProductoExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('eliminarProductoError').classList.remove('d-none');
      document.getElementById('eliminarProductoExito').classList.add('d-none');
    }
  });

  // --- Movimiento de stock ---
  document.getElementById('formMovimientoStock').addEventListener('submit', async function (e) {
    e.preventDefault();
    const product_id = document.getElementById('mov-product-id').value;
    const movement_type = document.getElementById('mov-tipo').value;
    const quantity = parseInt(document.getElementById('mov-cantidad').value);
    const notes = document.getElementById('mov-descripcion').value;
    try {
      const res = await fetch('http://localhost:8000/movimientos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          product_id,
          movement_type,
          quantity,
          notes
        })
      });
      if (res.ok) {
        document.getElementById('movimientoStockExito').classList.remove('d-none');
        document.getElementById('movimientoStockError').classList.add('d-none');
        setTimeout(() => {
          bootstrap.Modal.getOrCreateInstance(document.getElementById('modalMovimientoStock')).hide();
          cargarProductos();
        }, 1000);
      } else {
        document.getElementById('movimientoStockError').classList.remove('d-none');
        document.getElementById('movimientoStockExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('movimientoStockError').classList.remove('d-none');
      document.getElementById('movimientoStockExito').classList.add('d-none');
    }
  });

  // Visualización de historial de movimientos
  function mostrarHistorialMovimientos(product_id) {
    const tbody = document.getElementById('historialMovimientosTbody');
    tbody.innerHTML = '';
    document.getElementById('movimientosError').classList.add('d-none');
    fetch(`http://localhost:8000/movimientos?product_id=${product_id}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No se pudo cargar el historial');
        return res.json();
      })
      .then(movs => {
        if (movs.length === 0) {
          tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Sin movimientos registrados</td></tr>`;
        } else {
          movs.forEach(mov => {
            const fecha = new Date(mov.date).toLocaleString('es-AR', { dateStyle: 'short', timeStyle: 'short' });
            tbody.innerHTML += `
              <tr>
                <td>${fecha}</td>
                <td>${mov.movement_type}</td>
                <td>${mov.quantity}</td>
                <td>${mov.notes || ""}</td>
              </tr>
            `;
          });
        }
        new bootstrap.Modal(document.getElementById('modalHistorialMovimientos')).show();
      })
      .catch(() => {
        document.getElementById('movimientosError').classList.remove('d-none');
      });
  }

  // Inicial
  cargarProductos();
});
