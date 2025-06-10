document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('loginForm');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if (!username || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Aquí se decidesa dónde redirigir según el rol que venga del backend
        if (data.rol === 'admin') {
          window.location.href = '/admin.html';  // Cambia según tu ruta real
        } else if (data.rol === 'paciente') {
          window.location.href = '/PacienteMain.html'; // Cambia según tu ruta real
        } else {
          alert('Rol desconocido');
        }
      } else {
        alert(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en la conexión:', error);
      alert('Error al conectar con el servidor');
    }
  });
});
