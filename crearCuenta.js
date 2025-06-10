document.querySelector('.registro-usuario__form').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const confirmPassword = document.getElementById('confirm-password').value;

  if (password !== confirmPassword) {
    alert('Las contraseñas no coinciden');
    return;
  }

  try {
   const response = await fetch('http://localhost:3000/crear-cuenta-paciente', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    username,
    password,
    confirmPassword
  }),
});

    const data = await response.json();

    if (response.ok) {
      alert('¡Paciente registrado exitosamente!');
      window.location.href = 'login.html'; // o donde tengas el login
    } else {
      alert(data.error || 'Error al registrar');
    }
  } catch (error) {
    console.error('Error al conectar con el servidor', error);
    alert('Error al conectar con el servidor');
  }
});
