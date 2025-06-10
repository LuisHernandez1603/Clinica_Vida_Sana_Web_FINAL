document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector('.registrar-doctor__form');
  const selectEspecialidad = document.getElementById('especialidad_id');


    const telefonoInput = document.getElementById('telefono');

telefonoInput.addEventListener('input', (e) => {
  let value = e.target.value.replace(/\D/g, ''); // quitar todo lo que no sea número
  if (value.length > 4) {
    value = value.slice(0, 4) + '-' + value.slice(4, 8);
  }
  e.target.value = value;
});

     // Cargar especialidades
  async function cargarEspecialidades() {
    try {
      const res = await fetch('http://localhost:3000/api/especialidades');
      if (!res.ok) throw new Error('Error cargando especialidades');

      const especialidades = await res.json();

      selectEspecialidad.innerHTML = '<option value="">Seleccione una especialidad</option>';

      especialidades.forEach(({ idEspecialidad, nombre }) => {
        const option = document.createElement('option');
        option.value = idEspecialidad;
        option.textContent = nombre;
        selectEspecialidad.appendChild(option);
      });
    } catch (error) {
      console.error(error);
      selectEspecialidad.innerHTML = '<option value="">No se pudieron cargar especialidades</option>';
    }
  }

  cargarEspecialidades();

  // Evento submit con validaciones + fetch POST
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const apellidos = document.getElementById('apellidos').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const especialidad_id = selectEspecialidad.value;

    if (!nombre || !apellidos || !telefono || !correo || !especialidad_id) {
      mostrarMensajeError('Por favor, completa todos los campos incluyendo la especialidad.');
      return;
    }

    const telefonoRegex = /^[0-9]{4}-[0-9]{4}$/;
    if (!telefonoRegex.test(telefono)) {
      mostrarMensajeError('El teléfono debe tener el formato 5555-5555');
      return;
    }

    const correoRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!correoRegex.test(correo)) {
      mostrarMensajeError('El correo electrónico no es válido');
      return;
    }

    const datosDoctor = { nombre, apellidos, telefono, correo, especialidad_id };

    try {
      const response = await fetch('http://localhost:3000/api/registrar-doctor', {  // aquí agregué /api
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosDoctor),
      });

      let data;
      try {
        data = await response.json();
      } catch {
        data = { mensaje: await response.text() };
      }

      if (response.ok) {
        mostrarMensajeExito(data.mensaje || '¡Doctor registrado con éxito!');
        form.reset();
        selectEspecialidad.selectedIndex = 0;
      } else {
        mostrarMensajeError(data.error || data.mensaje || 'Error al registrar el doctor.');
      }
    } catch (error) {
      mostrarMensajeError('Error al conectar con el servidor');
      console.error('Error:', error);
    }
  });
});

// Funciones para mostrar mensajes con animación
function mostrarMensajeExito(texto) {
  const mensaje = document.getElementById('mensaje-exito');
  mensaje.textContent = texto;
  mensaje.style.display = 'block';

  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // reflow para reiniciar animación
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}

function mostrarMensajeError(texto) {
  const mensaje = document.getElementById('mensaje-error');
  mensaje.textContent = texto;
  mensaje.style.display = 'block';

  mensaje.style.animation = 'none';
  mensaje.offsetHeight;
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards';

  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}
