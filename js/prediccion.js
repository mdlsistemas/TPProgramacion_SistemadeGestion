document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const tbody = document.getElementById('tbody-prediccion-stock');
  const errorDiv = document.getElementById('prediccionError');
  const inputDias = document.getElementById('input-prediccion-dias'); // Si agregás un <input type="number" id="input-prediccion-dias">

  async function cargarPrediccionStock(dias = 30) {
    tbody.innerHTML = '';
    errorDiv.classList.add('d-none');
    try {
      const url = `http://localhost:8000/prediccion_stock?dias=${dias}`;
      const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('No autorizado o error al cargar predicción');
      const data = await res.json();
      if (data.length === 0) {
        tbody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">Sin datos para mostrar</td></tr>`;
        return;
      }
      data.forEach(prod => {
        const diasRestantes = (!isFinite(prod.dias_restantes) || prod.dias_restantes > 1e6)
          ? "&infin;"
          : prod.dias_restantes.toLocaleString('es-AR', {maximumFractionDigits: 2});
        tbody.innerHTML += `
          <tr>
            <td>${prod.product_name}</td>
            <td>${prod.stock}</td>
            <td>${Number(prod.consumo_diario).toLocaleString('es-AR', {maximumFractionDigits: 2})}</td>
            <td>${diasRestantes}</td>
          </tr>
        `;
      });
    } catch (err) {
      errorDiv.classList.remove('d-none');
      tbody.innerHTML = '';
    }
  }

  // Si querés un selector para la cantidad de días:
  if (inputDias) {
    inputDias.addEventListener('change', (e) => {
      let dias = parseInt(e.target.value);
      if (isNaN(dias) || dias < 7) dias = 7;
      if (dias > 365) dias = 365;
      cargarPrediccionStock(dias);
    });
    cargarPrediccionStock(inputDias.value || 30);
  } else {
    cargarPrediccionStock(30);
  }

  // --- MOSTRAR NOMBRE Y FOTO DEL USUARIO LOGUEADO ---
  if (token) {
    fetch('http://localhost:8000/usuarios/me', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
    .then(res => res.ok ? res.json() : null)
    .then(user => {
      if (!user) return;
      document.getElementById('user-name') && (document.getElementById('user-name').textContent = user.nombre);
      if (user.foto) {
        document.getElementById('user-photo') && (document.getElementById('user-photo').src = "http://localhost:8000/" + user.foto.replace(/\\/g, "/"));
      } else {
        document.getElementById('user-photo') && (document.getElementById('user-photo').src = "https://cdn-icons-png.flaticon.com/512/219/219983.png");
      }
    });
  }
});

