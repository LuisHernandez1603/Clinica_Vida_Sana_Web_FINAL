document.addEventListener('DOMContentLoaded', () => {
  const formulario = document.getElementById('form-agendar-cita');

  // Inputs y elementos importantes
  const inputCorreo = document.getElementById('correo');
  const btnBuscarPaciente = document.getElementById('btn-buscar-paciente');
  const infoPaciente = document.getElementById('info-paciente');
  const pacienteIdInput = document.getElementById('paciente_id'); // input hidden
  
  // Cargar doctores en el select
  fetch('http://localhost:3000/citas/doctores')
    .then(res => res.json())
    .then(doctores => {
      const select = document.getElementById('doctor');
      doctores.forEach(doc => {
        const option = document.createElement('option');
        option.value = doc.idDoctor; // ajusta según tu BD
        option.textContent = `${doc.nombre}  (${doc.especialidad})`;
        select.appendChild(option);
      });
    });

  // Botón buscar paciente por correo
  btnBuscarPaciente.addEventListener('click', async () => {
    const correo = inputCorreo.value.trim();
    if (!correo) {
      infoPaciente.textContent = 'Ingrese un correo válido.';
      pacienteIdInput.value = '';
      return;
    }
    infoPaciente.textContent = 'Buscando paciente...';
    pacienteIdInput.value = '';

    


    try {
     const res = await fetch(`http://localhost:3000/citas/pacientes?correo=${encodeURIComponent(correo)}`);
      if (!res.ok) throw new Error('Paciente no encontrado');
      const paciente = await res.json();

      if (paciente && paciente.idPaciente) {
        infoPaciente.textContent = `Paciente: ${paciente.nombreCompleto}`;
        pacienteIdInput.value = paciente.idPaciente;
      } else {
        infoPaciente.textContent = 'Paciente no encontrado.';
        pacienteIdInput.value = '';
      }
    } catch {
      infoPaciente.textContent = 'Error al buscar paciente.';
      pacienteIdInput.value = '';
    }
  });

  formulario.addEventListener('submit', async (e) => {
    e.preventDefault();

    const doctor_id = document.getElementById('doctor').value;
    const paciente_id = pacienteIdInput.value;
    const fecha = document.getElementById('fecha').value; // nuevo campo fecha
    const hora = document.getElementById('hora').value;

    if (!paciente_id) {
      alert('Debe buscar y seleccionar un paciente válido antes de agendar.');
      return;
    }
    if (!doctor_id || !fecha || !hora) {
      alert('Debe completar todos los campos obligatorios.');
      return;
    }

    // Combinar fecha y hora en formato ISO 8601 para enviar
    // ej: '2025-06-08' + 'T' + '14:30' = '2025-06-08T14:30:00'
    const fechaHora = `${fecha}T${hora}:00`; // formato "2025-06-08T14:30:00"


    try {
      const response = await fetch('http://localhost:3000/citas/agendar-cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ doctor_id, paciente_id, fechaHora })
      });

      const data = await response.json();

      if (response.ok) {
        alert(`✅ Cita agendada correctamente.\nCódigo: ${data.codigoCita}`);
        formulario.reset();
        infoPaciente.textContent = '';
        pacienteIdInput.value = '';
      } else {
        alert(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error en la solicitud:', error);
      alert('Error de conexión con el servidor.');
    }
  });
});
