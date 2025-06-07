// Función para mostrar nombre y foto del usuario logueado
async function mostrarUsuarioLogueado() {
  const token = localStorage.getItem('token');
  if (!token) return;

  try {
    const res = await fetch('http://localhost:8000/usuarios/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    if (!res.ok) throw new Error('No autorizado');
    const usuario = await res.json();

    document.getElementById('user-name').textContent = usuario.nombre;
    if (usuario.foto) {
      let fotoUrl = usuario.foto.startsWith('http')
        ? usuario.foto
        : `http://localhost:8000/${usuario.foto.replace(/\\/g, "/")}`;
      document.getElementById('user-photo').src = fotoUrl;
    } else {
      document.getElementById('user-photo').src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
    }
  } catch {
    document.getElementById('user-name').textContent = "Usuario";
    document.getElementById('user-photo').src = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');

  mostrarUsuarioLogueado(); // Llama primero a mostrar el usuario

  // Función para cargar las métricas principales del dashboard
  async function cargarDashboard() {
    // Inicializa todo en 0
    document.getElementById('total-productos').textContent = '0';
    document.getElementById('stock-bajo').textContent = '0';
    document.getElementById('stock-total').textContent = '0';
    document.getElementById('ventas-dia').textContent = '$0';
    document.getElementById('ventas-totales').textContent = '$0';
    document.getElementById('pedidos').textContent = '0';
    document.getElementById('ganancias').textContent = '$0';

    try {
      // --- Productos ---
      const resProd = await fetch('http://localhost:8000/productos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!resProd.ok) throw new Error('No autorizado');
      const productos = await resProd.json();

      // Productos Totales
      document.getElementById('total-productos').textContent = productos.length;

      // Stock Bajo (ejemplo: bajo si stock <= 5)
      const STOCK_MIN = 5;
      const stockBajo = productos.filter(p => typeof p.stock === 'number' && p.stock <= STOCK_MIN);
      document.getElementById('stock-bajo').textContent = stockBajo.length;

      // Stock Total
      const stockTotal = productos.reduce((sum, p) => sum + (typeof p.stock === 'number' ? p.stock : 0), 0);
      document.getElementById('stock-total').textContent = stockTotal;

      // --- Movimientos recientes (del día) ---
      const resMov = await fetch('http://localhost:8000/movimientos', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const movimientos = resMov.ok ? await resMov.json() : [];

      // Ventas del Día y Ventas Totales (solo movimientos tipo "Venta")
      const hoy = new Date();
      let montoVentasDia = 0;
      let montoVentasTotales = 0;
      let pedidosTotales = 0;
      let gananciasTotales = 0;

      movimientos.forEach(mov => {
        if (mov.notes === "Venta") {
          const prod = productos.find(p => p.product_id === mov.product_id);
          if (prod && prod.sale_price) {
            const monto = Number(prod.sale_price) * Math.abs(mov.quantity);
            montoVentasTotales += monto;
            if (new Date(mov.date).toDateString() === hoy.toDateString()) {
              montoVentasDia += monto;
            }
            pedidosTotales += 1;
            if (prod.cost) {
              gananciasTotales += (Number(prod.sale_price) - Number(prod.cost)) * Math.abs(mov.quantity);
            }
          }
        }
      });

      // Movimientos recientes: los del día
      const movsDia = movimientos.filter(mov => {
        const fecha = new Date(mov.date);
        return fecha.getFullYear() === hoy.getFullYear() &&
          fecha.getMonth() === hoy.getMonth() &&
          fecha.getDate() === hoy.getDate();
      });
      document.getElementById('movimientos-recientes') && (
        document.getElementById('movimientos-recientes').textContent = movsDia.length
      );

      // Ventas del Día
      document.getElementById('ventas-dia').textContent = `$${montoVentasDia.toLocaleString('es-AR')}`;
      // Ventas Totales
      document.getElementById('ventas-totales').textContent = `$${montoVentasTotales.toLocaleString('es-AR')}`;
      // Pedidos
      document.getElementById('pedidos').textContent = pedidosTotales;
      // Ganancias Totales
      document.getElementById('ganancias').textContent = `$${gananciasTotales.toLocaleString('es-AR')}`;
    } catch (err) {
      console.error('Error cargando dashboard:', err);
    }
  }

  cargarDashboard();
});

// --- Sidebar Toggle ---
document.addEventListener('DOMContentLoaded', () => {
  const menuToggle = document.getElementById('menu-toggle');
  const wrapper = document.getElementById('wrapper');
  const sidebar = document.getElementById('sidebar-wrapper');
  if (menuToggle && wrapper && sidebar) {
    menuToggle.addEventListener('click', () => {
      // Alterna la clase 'toggled' en el wrapper para ocultar/mostrar el sidebar
      wrapper.classList.toggle('toggled');
    });
  }
});