document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.registrar-especialidad__form');
  const mensajeExito = document.getElementById('mensaje-exito');
  const mensajeError = document.getElementById('mensaje-error');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const descripcion = document.getElementById('descripcion').value.trim();

    if (!nombre || !descripcion) {
      mostrarMensajeError('Por favor, completa todos los campos.');
      return;
    }

    try {
     fetch('http://localhost:3000/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre, descripcion })
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { mensaje: await response.text() };
      }

      if (response.ok) {
        mostrarMensajeExito(data.message || 'Especialidad registrada con éxito.');
        form.reset();
      } else {
        mostrarMensajeError(data.error || data.mensaje || 'Error al registrar la especialidad.');
      }

    } catch (error) {
      mostrarMensajeError('Error al conectar con el servidor.');
      console.error('Error:', error);
    }
  });

  function mostrarMensajeExito(texto) {
    mensajeExito.textContent = texto;
    mensajeExito.style.display = 'block';

    mensajeExito.style.animation = 'none';
    mensajeExito.offsetHeight; // reflow para reiniciar animación
    mensajeExito.style.animation = 'fadeInOut 4s ease-in-out forwards';

    setTimeout(() => {
      mensajeExito.style.display = 'none';
    }, 4000);
  }

  function mostrarMensajeError(texto) {
    mensajeError.textContent = texto;
    mensajeError.style.display = 'block';

    mensajeError.style.animation = 'none';
    mensajeError.offsetHeight;
    mensajeError.style.animation = 'fadeInOut 4s ease-in-out forwards';

    setTimeout(() => {
      mensajeError.style.display = 'none';
    }, 4000);
  }
});
