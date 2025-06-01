const form = document.querySelector('.registro-paciente__form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
   const correo = document.getElementById('correo').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const genero = document.getElementById('genero').value;
  const edad = parseInt(document.getElementById('edad').value, 10);

  if (!nombre || !apellido || !genero || !edad ||!correo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/registrar-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, genero, edad,correo }),
    });

    // Lee el cuerpo solo una vez, tratando de parsear JSON
    let data;
    try {
      data = await response.json();
    } catch {
      // Si no es JSON, lee como texto plano
      data = { mensaje: await response.text() };
    }

    if (response.ok) {
      mostrarMensajeBonito(data.mensaje || '¡Agregado con éxito!');
      form.reset();
    } else {
      mostrarMensajeBonito(data.error || 'Error al registrar paciente.');
    }
  } catch (error) {
    mostrarMensajeBonito('Error al conectar con el servidor');
    console.error('Error:', error);
  }
});

function mostrarMensajeBonito(texto) {
  const mensaje = document.getElementById('mensaje-exito');
  const mensajeTexto = document.getElementById('mensaje-texto');
  mensajeTexto.textContent = texto;
  mensaje.style.display = 'block';

  // Reiniciar animación si tienes CSS para eso (opcional)
  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // Trigger reflow para reiniciar animación
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}
