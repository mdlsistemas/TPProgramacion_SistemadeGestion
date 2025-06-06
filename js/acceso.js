document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();
    document.getElementById('loginError').classList.add('d-none');

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
      const res = await fetch('http://localhost:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem('token', data.token);
        // Opcional: limpiar errores previos
        document.getElementById('loginError').classList.add('d-none');
        window.location.href = 'dashboard.html';
      } else {
        document.getElementById('loginError').classList.remove('d-none');
      }
    } catch {
      document.getElementById('loginError').classList.remove('d-none');
    }
  });
});
