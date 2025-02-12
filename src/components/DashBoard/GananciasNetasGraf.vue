<template>
    <v-container>
      <v-card class="pa-4">
        <v-card-title class="text-h5 font-weight-bold">Ganancias Netas</v-card-title>
  
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
      const datos = ref([]);
  
      const obtenerDatos = async () => {
        let url = "";
  
        switch (tipoSeleccionado.value) {
          case "diario":
            url = "dash/gananciaNetaDia";
            break;
          case "semanal":
            url = "dash/gananciaNetaSemana";
            break;
          case "mensual":
            url = "dash/gananciaNetaMes";
            break;
          default:
            console.error("Filtro inválido");
            return;
        }
  
        try {
          const response = await auth.obtenerGananciaNetaPorDia(url);
          if (response.data.success && Array.isArray(response.data.data)) {
            datos.value = response.data.data;
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
  
        let labels = [];
        let valores = [];
  
        if (tipoSeleccionado.value === "diario") {
          labels = datos.value.map((item) => item.fecha);
        } else if (tipoSeleccionado.value === "semanal") {
          labels = datos.value.map((item) => `Semana ${item.semana} - ${item.anno}`);
        } else if (tipoSeleccionado.value === "mensual") {
          labels = datos.value.map((item) => `Mes ${item.mes} - ${item.anno}`);
        }
  
        valores = datos.value.map((item) => item.ganancia_neta);
  
        chartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels,
            datasets: [
              {
                label: "Ganancia Neta",
                data: valores,
                backgroundColor: "rgba(34, 197, 94, 0.2)", // Área sombreada verde claro
                borderColor: "rgba(34, 197, 94, 1)", // Línea verde fuerte
                borderWidth: 2,
                fill: true,
                tension: 0.3,
                pointBackgroundColor: "rgba(34, 197, 94, 1)",
                pointBorderColor: "#fff",
                pointHoverRadius: 6,
              },
            ],
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: true },
              tooltip: {
                enabled: true,
                mode: "nearest",
                intersect: false,
                callbacks: {
                  label: function (tooltipItem) {
                    return `Ganancia: ${tooltipItem.raw}`;
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
                title: { display: true, text: "Periodo" },
                ticks: {
                  autoSkip: true,
                  maxRotation: 45,
                  minRotation: 0,
                  callback: function (value, index, values) {
                    // Ajusta la cantidad de etiquetas mostradas dinámicamente
                    const totalLabels = values.length;
                    const step = Math.ceil(totalLabels / 10); // Muestra aproximadamente 10 etiquetas
                    return index % step === 0 ? this.getLabelForValue(value) : "";
                  },
                },
              },
              y: {
                title: { display: true, text: "Ganancia Neta" },
                beginAtZero: true,
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
    overflow-x: auto;
    padding-bottom: 10px;
  }
  
  /* Expande el gráfico para permitir desplazamiento */
  .chart-wrapper canvas {
    min-width: 1200px;
  }
  
  /* Estilo mejorado para el select */
  .custom-select {
    max-width: 300px;
    margin-bottom: 20px;
  }
  </style>
  