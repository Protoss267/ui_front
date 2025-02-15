<template>
    <v-container fluid class="fill-height">
      <v-row class="fill-height">
        <v-col cols="12">
          <v-card class="pa-4 fill-height d-flex flex-column">
            <v-card-title class="text-h5 font-weight-bold">
              Productos con Baja Existencia
            </v-card-title>
            <v-card-text>
              <v-text-field
                v-model="umbral"
                label="Umbral de existencias"
                type="number"
                outlined
                dense
                @input="cargarDatos"
              ></v-text-field>
            </v-card-text>
            <v-card-text class="d-flex flex-grow-1">
              <v-alert v-if="error" type="error" dense>
                Error al cargar los datos. Inténtalo de nuevo.
              </v-alert>
              <div class="chart-container">
                <canvas ref="grafico"></canvas>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="resetZoom">Restablecer Zoom</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  import { ref, onMounted } from "vue";
  import auth from "@/logic/auth";
  import Chart from "chart.js/auto";
  import zoomPlugin from "chartjs-plugin-zoom";
  
  Chart.register(zoomPlugin); // Registrar el plugin de zoom
  
  export default {
    setup() {
      const grafico = ref(null);
      const umbral = ref(10);
      const error = ref(false);
      let chartInstance = null;
  
      const cargarDatos = async () => {
        try {
          const response = await auth.obtenerProductoBajos(umbral.value);
          const productos = response.data.data;
          const filtrado = productos.filter(p => p.existencia > 0);
          console.log(filtrado);
  
          error.value = false;
  
          const nombres = filtrado.map(p => p.Nombre);
          const existencias = filtrado.map(p => p.existencia);
  
          if (chartInstance) {
            chartInstance.destroy();
          }
  
          chartInstance = new Chart(grafico.value, {
            type: "bar",
            data: {
              labels: nombres,
              datasets: [
                {
                  label: "Existencias",
                  data: existencias,
                  backgroundColor: "rgba(54, 162, 235, 0.6)",
                  borderColor: "rgba(54, 162, 235, 1)",
                  borderWidth: 1,
                },
              ],
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  ticks: {
                    autoSkip: false,
                    maxRotation: 45,
                    minRotation: 45,
                    font: {
                      size: 12,
                    },
                    clip: true,
                  },
                },
                y: {
                  beginAtZero: true,
                },
              },
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  enabled: true,
                },
                zoom: {
                  pan: {
                    enabled: true,
                    mode: "x",
                  },
                  zoom: {
                    wheel: {
                      enabled: true,
                    },
                    pinch: {
                      enabled: true,
                    },
                    mode: "x",
                  },
                },
              },
            },
          });
        } catch (err) {
          console.error("Error al cargar los datos:", err);
          error.value = true;
        }
      };
  
      const resetZoom = () => {
        if (chartInstance) {
          chartInstance.resetZoom();
        }
      };
  
      onMounted(() => {
        cargarDatos();
      });
  
      return { grafico, umbral, error, cargarDatos, resetZoom };
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh !important; /* Hace que todo el contenedor ocupe el alto completo */
  }
  
  .chart-container {
    flex-grow: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
  }
  
  canvas {
    width: 100% !important;
    height: 100% !important;
  }
  </style>
  