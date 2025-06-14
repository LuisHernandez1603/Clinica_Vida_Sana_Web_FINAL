// Espera a que el DOM esté completamente cargado para ejecutar el código
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Hace una petición GET al endpoint para obtener los datos del dashboard
    const res = await fetch('http://localhost:3000/kpis-llenar');
    // Convierte la respuesta a formato JSON
    const data = await res.json();

    // Llenar la tabla y graficar para Pacientes (barras y pastel)
    llenarTabla('tabla-pacientes-body', data.pacientes);
    renderizarGraficoBarras('grafico-pacientes-barras', 'Pacientes', data.pacientes);
    renderizarGraficoPastel('grafico-pacientes-pastel', data.pacientes);

    // Llenar la tabla y graficar para Citas (barras y pastel)
    llenarTabla('tabla-citas-body', data.citas);
    renderizarGraficoBarras('grafico-citas-barras', 'Citas', data.citas);
    renderizarGraficoPastel('grafico-citas-pastel', data.citas);

  } catch (err) {
    // En caso de error, mostrarlo en consola
    console.error('Error al cargar datos del dashboard:', err);
  }
});

// Función que llena la tabla HTML con los datos recibidos
function llenarTabla(idTabla, datos) {
  // Obtiene el tbody de la tabla por su id
  const tbody = document.getElementById(idTabla);
  // Limpia cualquier contenido previo
  tbody.innerHTML = '';
  // Itera sobre los meses y los valores para crear filas
  datos.meses.forEach((mes, i) => {
    // Crea una fila nueva
    const fila = document.createElement('tr');
    // Inserta columnas con mes y valor correspondiente
    fila.innerHTML = `
      <td>${mes}</td>
      <td>${datos.valores[i]}</td>
    `;
    // Agrega la fila al tbody
    tbody.appendChild(fila);
  });
}

// Función para renderizar gráfico de barras en un canvas dado
function renderizarGraficoBarras(canvasId, label, datos) {
  // Obtiene el contexto 2D del canvas por su id (si existe)
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  // Si no encuentra el canvas, muestra advertencia y sale
  if (!ctx) {
    console.warn(`No se encontró el canvas con id ${canvasId}`);
    return;
  }
  // Crea un nuevo gráfico de barras usando Chart.js
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: datos.meses, // Etiquetas del eje X (meses)
      datasets: [{
        label, // Nombre de la serie (ej. 'Pacientes' o 'Citas')
        data: datos.valores, // Valores para cada mes
        backgroundColor: '#4caf50' // Color de las barras
      }]
    },
    options: {
      responsive: true, // Hace el gráfico responsivo
      plugins: { legend: { display: false } } // No muestra leyenda
    }
  });
}

// Función para renderizar gráfico de pastel en un canvas dado
function renderizarGraficoPastel(canvasId, datos) {
  // Obtiene el contexto 2D del canvas por su id (si existe)
  const ctx = document.getElementById(canvasId)?.getContext('2d');
  // Si no encuentra el canvas, muestra advertencia y sale
  if (!ctx) {
    console.warn(`No se encontró el canvas con id ${canvasId}`);
    return;
  }
  // Crea un nuevo gráfico tipo pastel usando Chart.js
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: datos.meses, // Etiquetas (meses)
      datasets: [{
        data: datos.valores, // Valores para cada mes
        backgroundColor: generarColores(datos.meses.length) // Colores generados
      }]
    },
    options: { responsive: true } // Gráfico responsivo
  });
}

// Función que genera un array de colores HSL para la cantidad indicada
function generarColores(cantidad) {
  const colores = [];
  for (let i = 0; i < cantidad; i++) {
    // Calcula un color distinto para cada índice, variando el tono
    colores.push(`hsl(${i * (360 / cantidad)}, 70%, 60%)`);
  }
  return colores; // Retorna el array con los colores generados
}
