// Seleccionamos el formulario y el input de número de cédula
const form = document.querySelector('.registro-paciente__form');
const inputCedula = document.getElementById('numero_cedula');

// Evento que se activa cada vez que el usuario escribe en el input de cédula
inputCedula.addEventListener('input', (e) => {
 let value = e.target.value.toUpperCase();


  // Quitamos todo menos números y letras (mayúsculas)
  value = value.replace(/[^0-9A-Z]/g, '');

  // Limitamos máximo 14 caracteres
  if (value.length > 14) {
    value = value.slice(0, 14);
  }

  // La última posición debe ser solo letra (A-Z)
  if (value.length === 14) {
    const lastChar = value.charAt(13);
    if (!/[A-Z]/.test(lastChar)) {
      // Si no es letra, la eliminamos
      value = value.slice(0, 13);
    }
  }

  // Insertar guiones en las posiciones fijas (sin guiones aún)
  if (value.length > 3 && value.charAt(3) !== '-') {
    value = value.slice(0, 3) + '-' + value.slice(3);
  }
  if (value.length > 10 && value.charAt(10) !== '-') {
    value = value.slice(0, 10) + '-' + value.slice(10);
  }

  e.target.value = value;
});

// Evento para el envío del formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Evitamos que se recargue la página

  // Obtenemos los valores de los campos y eliminamos espacios innecesarios
  const numero_cedula = document.getElementById('numero_cedula').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellidos = document.getElementById('apellidos').value.trim();
  const fecha_nacimiento = document.getElementById('fecha_nacimiento').value;
  const correo_electronico = document.getElementById('correo_electronico').value.trim();

  // Validamos que todos los campos estén completos
  if (!numero_cedula || !nombre || !apellidos || !fecha_nacimiento || !correo_electronico) {
    alert('Por favor, completa todos los campos.');
    return; // Salimos para que no se envíe el formulario
  }

  const datosDoctor = { numero_cedula , nombre, apellidos, fecha_nacimiento, correo_electronico};
  try {
    // Enviamos los datos al backend usando fetch con método POST
    const response = await fetch('http://localhost:3000/registrar-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // Convertimos los datos a JSON antes de enviarlos
      body:JSON.stringify(datosDoctor)
    });

    let data;
    try {
      // Intentamos interpretar la respuesta como JSON
      data = await response.json();
    } catch {
      // Si no es JSON válido, leemos como texto
      data = { mensaje: await response.text() };
    }

    // Si el servidor respondió con éxito (status 2xx)
    if (response.ok) {
      mostrarMensajeBonito(data.mensaje || '¡Agregado con éxito!');
      form.reset(); // Limpiamos el formulario para nuevos datos
    } else {
      // Si hubo algún error, mostramos mensaje de error
      mostrarMensajeBonitoerror(data.error || 'Error al registrar paciente.');
    }
  } catch (error) {
    // Si no pudimos conectar con el servidor, mostramos mensaje de error
    mostrarMensajeBonitoerror('Error al conectar con el servidor');
    console.error('Error:', error);
  }
});

// Función para mostrar mensaje de éxito bonito y temporal
function mostrarMensajeBonito(texto) {
  const mensaje = document.getElementById('mensaje-exito'); // Contenedor del mensaje de éxito
  const mensajeTexto = document.getElementById('mensaje-texto'); // Elemento donde ponemos el texto

  mensajeTexto.textContent = texto; // Insertamos el texto recibido
  mensaje.style.display = 'block'; // Mostramos el mensaje

  // Reiniciamos la animación para que se reproduzca cada vez que se muestra
  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // Forzamos el reflow para reiniciar animación
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards'; // Animación fade in/out de 4 segundos

  // Ocultamos el mensaje después de 4 segundos
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}

// Función para mostrar mensaje de error bonito y temporal
function mostrarMensajeBonitoerror(texto) {
  const mensaje = document.getElementById('mensaje-error'); // Contenedor del mensaje de error
  const mensajeTexto = document.getElementById('mensaje-error'); // Usamos el mismo contenedor para el texto

  mensajeTexto.textContent = texto; // Insertamos el texto recibido
  mensaje.style.display = 'block'; // Mostramos el mensaje

  // Reiniciamos la animación para que se reproduzca cada vez que se muestra
  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // Forzamos el reflow para reiniciar animación
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards'; // Animación fade in/out de 4 segundos

  // Ocultamos el mensaje después de 4 segundos
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);
}
