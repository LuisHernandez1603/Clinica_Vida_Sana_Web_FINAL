const form = document.querySelector('.agendar-cita__form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const correo = document.getElementById('correo').value.trim();
  const fechacita = document.getElementById('fechaCita').value;
  const horacita = document.getElementById('horaCita').value;
  const motivo = document.getElementById('motivo').value.trim();

  // Validar campos
  if (!correo|| !fechacita || !horacita || !motivo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/agendar-cita', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, fechacita, horacita, motivo }),
    });

    const data = await response.json();

    if (response.ok) {
      mostrarMensajeBonito(data.mensaje || '¡Cita agendada con éxito!');
      form.reset();
    } else {
      mostrarMensajeBonito(data.error || 'Error al agendar la cita.');
    }
  } catch (error) {
    mostrarMensajeBonito('Error de conexión con el servidor.');
    console.error(error);
  }
});

function mostrarMensajeBonito(texto) {
  const mensaje = document.getElementById('mensaje-exito');
  const mensajeTexto = document.getElementById('mensaje-texto');
  mensajeTexto.textContent = texto;
  mensaje.style.display = 'flex';

  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // reflow
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}
