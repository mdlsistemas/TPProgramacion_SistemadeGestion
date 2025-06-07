document.addEventListener('DOMContentLoaded', () => {
  const token = localStorage.getItem('token');
  const tablaUsuarios = document.getElementById('usuarios-tbody');
  const buscador = document.getElementById('buscador-usuarios');
  let listaUsuarios = [];

  // Renderiza la tabla de usuarios
  function renderUsuarios(usuarios) {
    tablaUsuarios.innerHTML = '';
    usuarios.forEach(user => {
      const urlFoto = user.foto
        ? `http://localhost:8000/${user.foto.replace(/\\/g, "/")}`
        : 'https://randomuser.me/api/portraits/men/1.jpg';
      const row = document.createElement('tr');
      row.innerHTML = `
        <td><img src="${urlFoto}" width="32" height="32" class="rounded-circle"></td>
        <td>${user.nombre}</td>
        <td>${user.email}</td>
        <td>${user.rol}</td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary me-1" title="Editar"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-warning me-1" title="Cambiar clave"><i class="bi bi-key"></i></button>
          <button class="btn btn-sm btn-outline-danger" title="Eliminar"><i class="bi bi-trash"></i></button>
        </td>
      `;

      // --- Handler de botón Editar ---
      row.querySelector('.btn-outline-secondary').addEventListener('click', () => {
        document.getElementById('editar-id').value = user.id;
        document.getElementById('editar-nombre').value = user.nombre;
        document.getElementById('editar-email').value = user.email;
        document.getElementById('editar-rol').value = user.rol;
        const modal = new bootstrap.Modal(document.getElementById('modalEditarUsuario'));
        modal.show();
      });

      // --- Handler Cambiar clave ---
      row.querySelector('.btn-outline-warning').addEventListener('click', () => {
        document.getElementById('cambiarclave-id').value = user.id;
        document.getElementById('nueva-clave').value = '';
        document.getElementById('cambiarClaveExito').classList.add('d-none');
        document.getElementById('cambiarClaveError').classList.add('d-none');
        const modal = new bootstrap.Modal(document.getElementById('modalCambiarClave'));
        modal.show();
      });

 // Handler Eliminar usuario
row.querySelector('.btn-outline-danger').addEventListener('click', () => {
  document.getElementById('eliminar-id').value = user.id;
  document.getElementById('eliminar-nombre').textContent = user.nombre;
  document.getElementById('eliminarUsuarioExito').classList.add('d-none');
  document.getElementById('eliminarUsuarioError').classList.add('d-none');
  const modal = new bootstrap.Modal(document.getElementById('modalEliminarUsuario'));
  modal.show();
});


      tablaUsuarios.appendChild(row);
    });
  }

  // Trae todos los usuarios
  function cargarUsuarios() {
    fetch('http://localhost:8000/usuarios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('No autorizado o error al cargar usuarios');
        return res.json();
      })
      .then(usuarios => {
        listaUsuarios = usuarios;
        renderUsuarios(usuarios);
        document.getElementById('usuariosError').classList.add('d-none');
      })
      .catch(() => {
        document.getElementById('usuariosError').classList.remove('d-none');
      });
  }

  // Buscador de usuarios
  buscador.addEventListener('input', e => {
    const valor = e.target.value.trim().toLowerCase();
    const filtrados = listaUsuarios.filter(u =>
      u.nombre.toLowerCase().includes(valor) || u.email.toLowerCase().includes(valor)
    );
    renderUsuarios(filtrados);
  });

  // Alta de usuario (con foto)
  document.getElementById('formAgregarUsuario').addEventListener('submit', async function (e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await fetch('http://localhost:8000/usuarios/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        document.getElementById('agregarUsuarioExito').classList.remove('d-none');
        document.getElementById('agregarUsuarioError').classList.add('d-none');
        form.reset();
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalAgregarUsuario'));
        modal.hide();
        cargarUsuarios();
      } else {
        document.getElementById('agregarUsuarioError').classList.remove('d-none');
        document.getElementById('agregarUsuarioExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('agregarUsuarioError').classList.remove('d-none');
      document.getElementById('agregarUsuarioExito').classList.add('d-none');
    }
  });

  // Edición de usuario
  document.getElementById('formEditarUsuario').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('editar-id').value;
    const form = e.target;
    const formData = new FormData(form);
    try {
      const res = await fetch(`http://localhost:8000/usuarios/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });
      if (res.ok) {
        document.getElementById('editarUsuarioExito').classList.remove('d-none');
        document.getElementById('editarUsuarioError').classList.add('d-none');
        setTimeout(() => {
          const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEditarUsuario'));
          modal.hide();
          cargarUsuarios();
        }, 1000);
      } else {
        document.getElementById('editarUsuarioError').classList.remove('d-none');
        document.getElementById('editarUsuarioExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('editarUsuarioError').classList.remove('d-none');
      document.getElementById('editarUsuarioExito').classList.add('d-none');
    }
  });

  // Cambio de clave
  document.getElementById('formCambiarClave').addEventListener('submit', async function (e) {
    e.preventDefault();
    const id = document.getElementById('cambiarclave-id').value;
    const nuevaClave = document.getElementById('nueva-clave').value;
    try {
      const res = await fetch(`http://localhost:8000/usuarios/${id}/clave`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nueva_clave: nuevaClave })
      });
      if (res.ok) {
        document.getElementById('cambiarClaveExito').classList.remove('d-none');
        document.getElementById('cambiarClaveError').classList.add('d-none');
        setTimeout(() => {
          const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalCambiarClave'));
          modal.hide();
        }, 1000);
      } else {
        document.getElementById('cambiarClaveError').classList.remove('d-none');
        document.getElementById('cambiarClaveExito').classList.add('d-none');
      }
    } catch {
      document.getElementById('cambiarClaveError').classList.remove('d-none');
      document.getElementById('cambiarClaveExito').classList.add('d-none');
    }
  });


// Eliminar usuario
document.getElementById('formEliminarUsuario').addEventListener('submit', async function (e) {
  e.preventDefault();
  const id = document.getElementById('eliminar-id').value;
  try {
    const res = await fetch(`http://localhost:8000/usuarios/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (res.ok) {
      document.getElementById('eliminarUsuarioExito').classList.remove('d-none');
      document.getElementById('eliminarUsuarioError').classList.add('d-none');
      setTimeout(() => {
        const modal = bootstrap.Modal.getOrCreateInstance(document.getElementById('modalEliminarUsuario'));
        modal.hide();
        cargarUsuarios();
      }, 1000);
    } else {
      document.getElementById('eliminarUsuarioError').classList.remove('d-none');
      document.getElementById('eliminarUsuarioExito').classList.add('d-none');
    }
  } catch {
    document.getElementById('eliminarUsuarioError').classList.remove('d-none');
    document.getElementById('eliminarUsuarioExito').classList.add('d-none');
  }
});


  // Inicial
  cargarUsuarios();
});

