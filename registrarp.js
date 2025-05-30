const form = document.getElementById('form-paciente');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value.trim();
  const apellido = document.getElementById('apellido').value.trim();
  const genero = document.getElementById('genero').value;
  const edad = parseInt(document.getElementById('edad').value, 10);

  if (!nombre || !apellido || !genero || !edad) {
    alert('Por favor, completa todos los campos.');
    return;
  }

  try {
    const response = await fetch('http://localhost:3000/registrar-paciente', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre, apellido, genero, edad })
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.mensaje);
      form.reset();
    } else {
      const errorData = await response.json();
      alert('Error al registrar paciente: ' + (errorData.error || 'Error desconocido'));
    }
  } catch (error) {
    alert('Error al conectar con el servidor');
    console.error(error);
  }
});
