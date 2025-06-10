document.addEventListener('DOMContentLoaded', async () => {
  try {
   const res = await fetch('http://localhost:3000/kpis-llenar');

    const data = await res.json();

    // Pacientes: Tabla y Gráfico
    llenarTabla('tabla-pacientes-body', data.pacientes);
    renderizarGraficoBarras('grafico-pacientes', 'Pacientes', data.pacientes);

    // Citas: Tabla y Gráfico
    llenarTabla('tabla-citas-body', data.citas);
    renderizarGraficoPastel('grafico-citas', data.citas);

  } catch (err) {
    console.error('Error al cargar datos del dashboard:', err);
  }
});

function llenarTabla(idTabla, datos) {
  const tbody = document.getElementById(idTabla);
  tbody.innerHTML = '';

  datos.meses.forEach((mes, i) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${mes}</td>
      <td>${datos.valores[i]}</td>
    `;
    tbody.appendChild(fila);
  });
}

function renderizarGraficoBarras(canvasId, label, datos) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.meses,
      datasets: [{
        label: label,
        data: datos.valores,
        backgroundColor: '#4caf50'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false }
      }
    }
  });
}

function renderizarGraficoPastel(canvasId, datos) {
  const ctx = document.getElementById(canvasId).getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: datos.meses,
      datasets: [{
        data: datos.valores,
        backgroundColor: generarColores(datos.meses.length)
      }]
    },
    options: {
      responsive: true
    }
  });
}

function generarColores(cantidad) {
  const colores = [];
  for (let i = 0; i < cantidad; i++) {
    colores.push(`hsl(${i * (360 / cantidad)}, 70%, 60%)`);
  }
  return colores;
}

  // Gráfico de pastel - total general
    const totalPacientes = pacientes.valores.reduce((a, b) => a + b, 0);
    const totalCitas = citas.valores.reduce((a, b) => a + b, 0);
 new Chart(document.getElementById('grafico-pastel'), {
      type: 'pie',
      data: {
        labels: ['Pacientes Registrados', 'Citas Atendidas'],
        datasets: [{
          data: [totalPacientes, totalCitas],
          backgroundColor: ['#f39c12', '#9b59b6']
        }]
      },
      options: {
        responsive: true
      }
    });
