// Espera a que el DOM esté cargado antes de ejecutar cualquier lógica
document.addEventListener('DOMContentLoaded', () => {
  const mensaje = document.getElementById('mensaje');
  mensaje.style.display = 'none'; // Oculta el mensaje al inicio

  // Referencias a los inputs y select del formulario
  const tipoSelect = document.getElementById('tipo');
  const idInput = document.getElementById('id');
  const nombreInput = document.getElementById('nombre');
  const correoInput = document.getElementById('correo');

  // Función utilitaria para mostrar mensajes en pantalla (éxito o error)
  function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.style.display = 'block';
    mensaje.className = 'crud-admin__mensaje ' + (tipo === 'success' ? 'mensaje-exito' : 'mensaje-error');
    setTimeout(() => {
      mensaje.style.display = 'none'; // Oculta el mensaje luego de 4 segundos
    }, 4000);
  }

  // Lógica para editar un usuario existente
  async function editarUsuario() {
    let tipo = tipoSelect.value.trim().toLowerCase();
    if (tipo === 'medico') tipo = 'doctor'; // En caso de traducción visual

    const id = idInput.value.trim();
    const nombre = nombreInput.value.trim();
    const correo = correoInput.value.trim();

    // Validación de campos requeridos
    if (!id || !nombre || !correo) {
      alert('Por favor, complete todos los campos obligatorios');
      return;
    }

    try {
      // Envío de la petición PUT al backend para editar
      const res = await fetch(`http://localhost:3000/api/admin/${tipo}/editar`,  {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, nombre, correo })
      });

      const data = await res.json();

      if (res.ok) {
        mostrarMensaje('Usuario editado correctamente', 'success');
      } else {
        mostrarMensaje('Error: ' + data.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error en la petición: ' + error.message, 'error');
    }
  }

  // Lógica para desactivar (dar de baja) un usuario
  async function desactivarUsuario(tipo, id) {
    try {
      const response = await fetch('http://localhost:3000/adminbaja/baja', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, id })
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.mensaje, 'success');
      } else {
        mostrarMensaje('Error: ' + data.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error en la petición: ' + error.message, 'error');
    }
  }

  // Lógica para activar un usuario previamente desactivado
  async function activarUsuario(tipo, id) {
    try {
      const response = await fetch('http://localhost:3000/adminbaja/cambiar-estado', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tipo, id, activo: 1 }) // Se indica que el estado debe ser "activo"
      });

      const data = await response.json();

      if (response.ok) {
        mostrarMensaje(data.mensaje, 'success');
      } else {
        mostrarMensaje('Error: ' + data.error, 'error');
      }
    } catch (error) {
      mostrarMensaje('Error en la petición: ' + error.message, 'error');
    }
  }

  // Asignar evento al botón de "Editar usuario"
  document.getElementById('btn-editar').addEventListener('click', editarUsuario);

  // Asignar evento al botón "Dar de baja"
  document.getElementById('btn-desactivar').addEventListener('click', () => {
    const tipo = tipoSelect.value.trim().toLowerCase();  // Obtiene tipo seleccionado
    const id = idInput.value.trim();

    console.log('Tipo seleccionado:', tipo);  // Debug opcional

    if (!tipo || !id) {
      mostrarMensaje('Por favor, seleccione un tipo y un ID válido.', 'error');
      return;
    }

    // Confirmación antes de dar de baja
    if (confirm(`¿Estás seguro que querés dar de baja al ${tipo} con ID ${id}?`)) {
      desactivarUsuario(tipo, id);
    }
  });

  // Asignar evento al botón "Activar usuario"
  document.getElementById('btn-activar').addEventListener('click', () => {
    const tipo = tipoSelect.value.trim().toLowerCase();
    const id = idInput.value.trim();

    if (!tipo || !id) {
      mostrarMensaje('Por favor, seleccione un tipo y un ID válido.', 'error');
      return;
    }

    // Confirmación antes de activar
    if (confirm(`¿Estás seguro que querés ACTIVAR al ${tipo} con ID ${id}?`)) {
      activarUsuario(tipo, id);
    }
  });

});
