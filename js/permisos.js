// js/permisos.js

document.addEventListener('DOMContentLoaded', () => {
  // Función para obtener el rol desde el token JWT
  function getRolUsuario() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.rol;
    } catch {
      return null;
    }
  }

  const rol = getRolUsuario();

  // Si no hay rol, forzamos logout o redirigimos al login
  if (!rol) {
    alert('No tienes permisos suficientes o tu sesión expiró.');
    window.location.href = 'login.html';
    return;
  }

  // Ocultar menús según el rol
  if (rol === 'operador') {
    document.getElementById('nav-usuarios')?.classList.add('d-none');
  }
  if (rol === 'analista') {
    document.getElementById('nav-usuarios')?.classList.add('d-none');
    document.getElementById('nav-productos')?.classList.add('d-none');
  }

  // Proteger acceso directo por URL (ruta actual)
  const path = window.location.pathname;

  if (rol === 'operador' && (
      path.endsWith('usuarios.html')
    )) {
    alert('No tienes permisos suficientes para esta sección.');
    window.location.href = 'dashboard.html';
  }
  if (rol === 'analista' && (
      path.endsWith('usuarios.html') || path.endsWith('productos.html')
    )) {
    alert('No tienes permisos suficientes para esta sección.');
    window.location.href = 'dashboard.html';
  }
  // Si querés proteger otras secciones, agregá condiciones similares.
});
