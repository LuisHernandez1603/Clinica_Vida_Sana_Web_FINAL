document.addEventListener('DOMContentLoaded', () => {
  const btnVerificar = document.getElementById('btn-verificar-codigo');
  const inputCodigo = document.getElementById('codigo_cita');
  const infoCita = document.getElementById('info-cita');
  const formConsulta = document.getElementById('form-registrar-consulta');

  let citaValida = null; // guardará datos de la cita verificada

  btnVerificar.addEventListener('click', async () => {
    const codigo = inputCodigo.value.trim();
    if (!codigo) {
      infoCita.textContent = 'Por favor ingrese un código de cita.';
      citaValida = null;
      return;
    }

    infoCita.textContent = 'Verificando código...';

    try {
      // Ajusta URL según tu backend, suponiendo GET con código en query
      const res = await fetch(`http://localhost:3000/consultas/cita?codigo=${encodeURIComponent(codigo)}`);

      if (!res.ok) throw new Error('Código no encontrado');

      const datos = await res.json();

      // Ejemplo: { pacienteNombre: "Juan Pérez", doctorNombre: "Dra. Ana Gómez", idCita: 123 }
      infoCita.innerHTML = `
        Paciente: <strong>${datos.pacienteNombre}</strong><br>
        Doctor: <strong>${datos.doctorNombre}</strong>
      `;

      citaValida = datos; // guardamos para luego usar idCita en submit

    } catch (error) {
      infoCita.textContent = 'Código inválido o no encontrado.';
      citaValida = null;
    }
  });

  formConsulta.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!citaValida) {
      alert('Debe verificar un código de cita válido antes de registrar la consulta.');
      return;
    }
     const codigoCita = document.getElementById('codigo_cita').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const diagnostico = document.getElementById('diagnostico').value.trim();
    const recomendaciones = document.getElementById('recomendaciones').value.trim();

    if (!descripcion || !diagnostico) {
      alert('Los campos de descripción y diagnóstico son obligatorios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/consultas/registrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        codigo_cita: codigoCita,
          descripcion,
          diagnostico,
          recomendaciones,
          activo: 1
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Consulta registrada correctamente.');
        formConsulta.reset();
        infoCita.textContent = '';
        citaValida = null;
      } else {
        alert(`Error: ${data.error || 'No se pudo registrar la consulta.'}`);
      }

    } catch (error) {
      console.error('Error al registrar consulta:', error);
      alert('Error de conexión con el servidor.');
    }
  });
});
