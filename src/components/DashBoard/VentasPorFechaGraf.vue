<template>
  <v-container>
    <v-card class="pa-4">
      <v-card-title class="text-h5 font-weight-bold">Ventas Totales</v-card-title>

      <!-- Selector de filtro -->
      <v-select
        v-model="tipoSeleccionado"
        :items="tipos"
        label="Selecciona el tipo de gráfico"
        class="mb-4 custom-select"
        variant="outlined"
        density="comfortable"
        rounded="lg"
        prepend-icon="mdi-chart-line"
      ></v-select>

      <!-- Contenedor del gráfico con scroll horizontal -->
      <div class="chart-wrapper">
        <canvas ref="chartCanvas"></canvas>
      </div>
    </v-card>
  </v-container>
</template>

<script>
import { ref, onMounted, watch } from "vue";
import Chart from "chart.js/auto";
import zoomPlugin from "chartjs-plugin-zoom";
import auth from "@/logic/auth";

Chart.register(zoomPlugin);

export default {
  setup() {
    const chartCanvas = ref(null);
    let chartInstance = null;

    const tipoSeleccionado = ref("diario");
    const tipos = [
      { title: "Por Día", value: "diario" },
      { title: "Por Semana y Año", value: "semanal" },
      { title: "Por Mes y Año", value: "mensual" },
    ];
    const datos = ref({
      labels: [],
      totales: [],
      cantidades: [],
    });

    const obtenerDatos = async () => {
      let url = "";

      switch (tipoSeleccionado.value) {
        case "diario":
          url = "dash/ventasPorFecha";
          break;
        case "semanal":
          url = "dash/ventasPorSemanaAnoo";
          break;
        case "mensual":
          url = "dash/ventasPorMesAnno";
          break;
        default:
          console.error("Filtro inválido");
          return;
      }

      try {
        const response = await auth.obtenerGananciaNetaPorDia(url);
        if (response.data.success && response.data.data) {
          datos.value = response.data.data; // Asignar los datos recibidos
          actualizarGrafico();
        } else {
          console.error("Error: Respuesta de API no válida", response.data);
        }
      } catch (error) {
        console.error("Error obteniendo los datos", error);
      }
    };

    const actualizarGrafico = () => {
      if (!chartCanvas.value) return;

      const ctx = chartCanvas.value.getContext("2d");

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: "bar", // Cambié a 'bar' para mostrar barras
        data: {
          labels: datos.value.labels, // Usar las labels de la respuesta
          datasets: [
            {
              label: "Total de Ventas",
              data: datos.value.totales, // Total de ventas
              backgroundColor: "rgba(75, 192, 192, 0.2)", // Color de las barras
              borderColor: "rgba(75, 192, 192, 1)", // Color del borde
              borderWidth: 1,
              yAxisID: "y", // Eje izquierdo
            },
            {
              label: "Cantidad de Ventas",
              data: datos.value.cantidades, // Cantidad de ventas
              backgroundColor: "rgba(255, 99, 132, 0.2)", // Color de las barras
              borderColor: "rgba(255, 99, 132, 1)", // Color del borde
              borderWidth: 1,
              yAxisID: "y1", // Eje derecho
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: true,
            },
            tooltip: {
              enabled: true,
              mode: "nearest",
              intersect: false,
              callbacks: {
                label: function (tooltipItem) {
                  return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                },
              },
            },
            zoom: {
              pan: { enabled: true, mode: "x" },
              zoom: { wheel: { enabled: true }, pinch: { enabled: true }, mode: "x" },
            },
          },
          scales: {
            x: {
              title: { display: true, text: "Fecha" },
              ticks: {
                autoSkip: true,
                maxRotation: 45,
                minRotation: 0,
                callback: function (value, index, values) {
                  const totalLabels = values.length;
                  const step = Math.ceil(totalLabels / 10); // Ajusta la cantidad de etiquetas mostradas dinámicamente
                  return index % step === 0 ? this.getLabelForValue(value) : "";
                },
              },
            },
            y: {
              title: { display: true, text: "Total de Ventas" },
              beginAtZero: true,
            },
            y1: {
              title: { display: true, text: "Cantidad de Ventas" },
              beginAtZero: true,
              position: "right",
              grid: { drawOnChartArea: false },
            },
          },
        },
      });
    };

    watch(tipoSeleccionado, obtenerDatos);

    onMounted(obtenerDatos);

    return { chartCanvas, tipoSeleccionado, tipos };
  },
};
</script>

<style scoped>
/* Contenedor del gráfico con scroll */
.chart-wrapper {
  width: 100%;
  overflow-x: hidden; /* Evita la barra de desplazamiento horizontal */
  padding-bottom: 10px;
}

/* Estilo para el canvas */
.chart-wrapper canvas {
  width: 100%; /* El canvas se ajustará al 100% del contenedor */
  height: 400px; /* Ajusta la altura según sea necesario */
}

/* Estilo mejorado para el select */
.custom-select {
  max-width: 300px;
  margin-bottom: 20px;
}
</style>
