function crearFilaCita(mes, total) {
  const fila = document.createElement('tr');
  fila.className = 'citas-mensuales__fila';

  const celdaMes = document.createElement('td');
  celdaMes.textContent = mes;

  const celdaTotal = document.createElement('td');
  celdaTotal.textContent = total;

  fila.appendChild(celdaMes);
  fila.appendChild(celdaTotal);

  return fila;
}

async function cargarCitasMensuales() {
  try {
    const res = await fetch('http://localhost:3000/citas-mensuales');
    const data = await res.json();

    const labels = data.map(d => d.mes);
    const valores = data.map(d => d.totalCitas);

    // 🟦 Gráfico de barras
    const ctx = document.getElementById('barChart').getContext('2d');
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels,
        datasets: [{
          label: 'Citas por mes',
          data: valores,
          backgroundColor: 'rgba(54, 162, 235, 0.6)',
          borderRadius: 5
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true }
        }
      }
    });

    // 📋 Tabla
    const tbody = document.querySelector('.citas-mensuales__tbody');
    tbody.innerHTML = ''; // Limpiar contenido anterior

    data.forEach(({ mes, totalCitas }) => {
      const fila = crearFilaCita(mes, totalCitas);
      tbody.appendChild(fila);
    });

  } catch (err) {
    console.error('Error cargando datos de citas mensuales:', err);
  }
}

document.addEventListener('DOMContentLoaded', cargarCitasMensuales);
