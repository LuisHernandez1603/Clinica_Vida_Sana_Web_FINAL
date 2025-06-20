// Espera a que todo el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
  // Referencia al formulario por su ID
  const form = document.getElementById('loginForm');

  // Evento cuando se envía el formulario
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // Previene que se recargue la página

    // Obtiene y limpia los valores de los campos
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    // Validación básica: campos vacíos
    if (!username || !password) {
      alert('Por favor, completa todos los campos');
      return;
    }

    try {
      // Petición POST al backend con los datos de login
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirige según el rol devuelto por el backend
                if (data.rol === 'admin') {
            window.location.href = '/AdministradorMain.html';
          } else if (data.rol === 'paciente') {
            window.location.href = '/PacienteMain.html';
          } else if (data.rol === 'doctor') {
            window.location.href = '/DoctorMenu.html';  // La ruta del módulo doctor
          } else {
            alert('Rol desconocido');
          }

      } else {
        // Muestra el error del backend o uno genérico
        alert(data.error || 'Usuario o contraseña incorrectos');
      }
    } catch (error) {
      // Error de red o del servidor
      console.error('Error en la conexión:', error);
      alert('Error al conectar con el servidor');
    }
  });
});
