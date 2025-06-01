// Seleccionamos el formulario usando la clase BEM
const form = document.querySelector('.registro-paciente__form');

// Añadimos un "escuchador de eventos" para cuando se envíe el formulario
form.addEventListener('submit', async (e) => {
  e.preventDefault(); // Prevenimos que se recargue la página al enviar el formulario

  // Obtenemos y limpiamos los valores de los inputs usando el DOM
  const correo = document.getElementById('correo').value.trim();
  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const genero = document.getElementById('genero').value;
  const edad = parseInt(document.getElementById('edad').value, 10); // Convertimos la edad a número

  // Validamos que ningún campo esté vacío
  if (!nombre || !apellido || !genero || !edad || !correo) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    // Enviamos los datos al backend con fetch, usando JSON
    const response = await fetch('http://localhost:3000/registrar-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, genero, edad, correo }),
    });

    // Intentamos leer la respuesta como JSON
    let data;
    try {
      data = await response.json();
    } catch {
      // Si la respuesta no es JSON válido, la leemos como texto
      data = { mensaje: await response.text() };
    }

    // Si la respuesta fue exitosa (status 200–299)
    if (response.ok) {
      mostrarMensajeBonito(data.mensaje || '¡Agregado con éxito!');
      form.reset(); // Limpiamos los campos del formulario
    } else {
      // Si hubo error (por ejemplo 400 o 500)
      mostrarMensajeBonitoerror(data.error || 'Error al registrar paciente.');
    }
  } catch (error) {
    // Si no se pudo conectar al servidor
    mostrarMensajeBonitoerror('Error al conectar con el servidor');
    console.error('Error:', error);
  }
});

// Función para mostrar un mensaje bonito en pantalla (estilo alerta temporal)
function mostrarMensajeBonito(texto) {
  const mensaje = document.getElementById('mensaje-exito'); // Contenedor del mensaje
  const mensajeTexto = document.getElementById('mensaje-texto'); // Texto dentro del contenedor

  mensajeTexto.textContent = texto; // Insertamos el texto recibido
  mensaje.style.display = 'block'; // Mostramos el mensaje

  // Reiniciamos animación CSS (por si ya se mostró antes)
  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // Forzamos reflow para que se aplique nuevamente
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards'; // Activamos animación

  // Ocultamos el mensaje después de 4 segundos
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);

  
}

// Función para mostrar un mensaje bonito en pantalla (estilo alerta temporal)
function mostrarMensajeBonitoerror(texto) {
  const mensaje = document.getElementById('mensaje-error'); // Contenedor del mensaje
  const mensajeTexto = document.getElementById('mensaje-error'); // Texto dentro del contenedor

  mensajeTexto.textContent = texto; // Insertamos el texto recibido
  mensaje.style.display = 'block'; // Mostramos el mensaje

  // Reiniciamos animación CSS (por si ya se mostró antes)
  mensaje.style.animation = 'none';
  mensaje.offsetHeight; // Forzamos reflow para que se aplique nuevamente
  mensaje.style.animation = 'fadeInOut 4s ease-in-out forwards'; // Activamos animación

  // Ocultamos el mensaje después de 4 segundos
  setTimeout(() => {
    mensaje.style.display = 'none';
  }, 4000);

  
}


