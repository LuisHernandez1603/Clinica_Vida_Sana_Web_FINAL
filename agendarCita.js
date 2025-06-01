// Seleccionamos el formulario y los elementos para mostrar mensajes
const formAgendar = document.getElementById('form-agendar-cita');
const mensaje = document.getElementById('mensaje-agendar');
const mensajeTexto = document.getElementById('mensaje-texto-agendar');

// Al cargar la página, ponemos la fecha mínima hoy para el input fecha
window.addEventListener('DOMContentLoaded', () => {
  const inputFecha = document.getElementById('fecha');
  const hoy = new Date().toISOString().split('T')[0];
  inputFecha.min = hoy;
});

// Evento submit para el formulario de agendar cita
formAgendar.addEventListener('submit', async (e) => {
  e.preventDefault();

  // Recogemos valores del formulario
  const correo = document.getElementById('correo').value.trim();
  const fecha = document.getElementById('fecha').value;
  let hora = document.getElementById('hora').value;
  const motivo = document.getElementById('motivo').value.trim();

  // Agregar segundos si no los tiene (de HH:mm a HH:mm:ss)
  if (hora.length === 5) {
    hora = hora + ':00';
  }

  // Validación sencilla (aunque required ya lo hace)
  if (!correo || !fecha || !hora || !motivo) {
    mostrarMensaje('Por favor, completa todos los campos.', true);
    return;
  }

  // Crear objeto con los datos a enviar
  const datosCita = { correo, fecha, hora, motivo };

  try {
  // Petición POST para enviar la cita al backend
  const response = await fetch('http://localhost:3000/agendar-cita', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(datosCita)
  });

  let data;
  try {
    data = await response.json();
  } catch {
    data = { mensaje: await response.text() };
  }

  if (response.ok) {
    mostrarMensaje(data.mensaje || '¡Cita agendada con éxito!');
    formAgendar.reset();
  } else {
    mostrarMensaje(data.error || 'Error al agendar la cita.', true);
  }
} catch (error) {
  mostrarMensaje('Error al conectar con el servidor.', true);
  console.error('Error:', error);
}
});

// Función para mostrar mensaje bonito, true si es error
function mostrarMensaje(texto, esError = false) {
  mensajeTexto.textContent = texto;
  mensaje.style.backgroundColor = esError ? '#bc0000' : '#28a745';
  mensaje.style.display = 'block';

  // Animar y ocultar después de 4 segundos
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}
