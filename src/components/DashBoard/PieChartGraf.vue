<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <h2 class="text-center font-weight-bold">📊 Productos Vendidos por Mes</h2>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="6">
        <v-select
          v-model="month"
          :items="months"
          item-title="text"
          item-value="value"
          label="Mes"
          outlined
          dense
          rounded
        ></v-select>
      </v-col>
      <v-col cols="6">
        <v-select
          v-model="year"
          :items="years"
          item-title="text"
          item-value="value"
          label="Año"
          outlined
          dense
          rounded
        ></v-select>
      </v-col>
    </v-row>
    <v-btn @click="fetchData" color="primary">Obtener datos</v-btn>
    <v-sheet class="mt-4 chart-container" v-if="chartReady">
      <canvas id="myChart"></canvas>
    </v-sheet>
  </v-container>
</template>

<script>
import auth from '@/logic/auth';
import Chart from 'chart.js/auto';
import zoomPlugin from 'chartjs-plugin-zoom';

Chart.register(zoomPlugin);

export default {
  data() {
    return {
      month: '',
      year: '',
      chart: null,
      chartReady: false,
      months: [
        { text: 'Enero', value: 1 },
        { text: 'Febrero', value: 2 },
        { text: 'Marzo', value: 3 },
        { text: 'Abril', value: 4 },
        { text: 'Mayo', value: 5 },
        { text: 'Junio', value: 6 },
        { text: 'Julio', value: 7 },
        { text: 'Agosto', value: 8 },
        { text: 'Septiembre', value: 9 },
        { text: 'Octubre', value: 10 },
        { text: 'Noviembre', value: 11 },
        { text: 'Diciembre', value: 12 }
      ],
      years: Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { text: year.toString(), value: year };
      }),
    };
  },
  methods: {
    async fetchData() {
      if(this.month =='' || this.year=='') {
        alert('No pueden haber campos vacíos');
      } else {
        try {
          const response = await auth.obtenerProductosVendidosPorRango(this.month, this.year);
          this.chartReady = false;
          await this.$nextTick();
          this.chartReady = true;
          await this.$nextTick();
          this.updateChart(response.data);
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      }
    },

    updateChart(data) {
      if (this.chart) {
        this.chart.destroy();
      }

      const canvas = document.getElementById('myChart');
      if(!canvas) {
        console.log("No se encontró el canvas");
      }
      const ctx = canvas.getContext('2d');
      const productos = data.data.map(item => item.producto);
      const cantidades = data.data.map(item => item.cantidad_vendida);

      this.chart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: productos,
          datasets: [
            {
              label: 'Cantidad Vendida',
              data: cantidades,
              backgroundColor: 'rgba(75, 192, 192, 0.5)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            },
          ],
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false,
            },
            zoom: {
              pan: {
                enabled: true,
                mode: 'y',
              },
              zoom: {
                wheel: {
                  enabled: true,
                },
                pinch: {
                  enabled: true,
                },
                mode: 'y',
              },
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad Vendida',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Productos',
              }
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
.chart-container {
  width: 100%;
  height: 500px;
  overflow-x: auto;
  position: relative;
}

.chart-container canvas {
  width: 100% !important;
  height: 100% !important;
}

.text-center {
  text-align: center;
}
.font-weight-bold {
  font-weight: bold;
}
</style>