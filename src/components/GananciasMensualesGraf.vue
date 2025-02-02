<template>
    <div class="chart-container">
      <Line
        ref="myChart"
        v-if="loaded"
        id="my-chart-id"
        :options="chartOptions"
        :data="chartData"
      />
    </div>
  </template>
  
  <script>
  import { Line } from 'vue-chartjs';
  import {
    Chart as ChartJS,
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler,
  } from 'chart.js';
  import auth from '@/logic/auth';
  
  ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Filler,
  );
  
  export default {
    name: 'LineChart',
    components: {
      Line,
    },
    data() {
      return {
        loaded: false,
        chartData: {
          labels: [], // Meses
          datasets: [
            {
              label: 'Ganancias Mensuales',
              data: [],
              borderColor: '#00aaff',
              backgroundColor: 'rgba(0, 170, 255, 0.2)',
              fill: true,
              tension: 0.4,
              borderWidth: 3,
              pointBackgroundColor: '#00aaff',
              pointBorderColor: '#fff',
              pointBorderWidth: 2,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointHoverBackgroundColor: '#ff9900',
            },
          ],
        },
        chartOptions: {
          responsive: true,
          animations: {
            tension: {
              duration: 1000,
              easing: 'easeOutBounce',
              from: 1,
              to: 0,
              loop: false,
            },
          },
          plugins: {
            title: {
              display: true,
              text: 'Ganancias Mensuales',
              font: {
                size: 20,
                weight: 'bold',
                family: 'Arial, sans-serif',
              },
            },
            tooltip: {
              callbacks: {
                label: function (tooltipItem) {
                  return `Ganancia: $${parseFloat(tooltipItem.raw).toFixed(2)}`;
                },
              },
              backgroundColor: '#fff',
              titleColor: '#000',
              bodyColor: '#000',
              borderColor: '#ccc',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Meses',
                font: {
                  size: 14,
                  family: 'Arial, sans-serif',
                },
                color: '#555',
              },
              grid: {
                color: '#f0f0f0',
                borderColor: '#e0e0e0',
              },
            },
            y: {
              title: {
                display: true,
                text: 'Ganancia ($)',
                font: {
                  size: 14,
                  family: 'Arial, sans-serif',
                },
                color: '#555',
              },
              grid: {
                color: '#f0f0f0',
                borderColor: '#e0e0e0',
              },
            },
          },
        },
      };
    },
  
    mounted() {
      this.obtenerDatos();
    },
  
    methods: {
      async obtenerDatos() {
        this.loaded = false;
        try {
          const respuesta = await auth.obtenerGanaciasMensuales();
          const months = Object.keys(respuesta.data.data);
          const earnings = Object.values(respuesta.data.data);
  
          // Convertir meses a formato más legible
          this.chartData.labels = months.map((month) => {
            const date = new Date(`${month}-01`);
            return date.toLocaleString('es-ES', { month: 'short', year: 'numeric' });
          });
  
          this.chartData.datasets[0].data = earnings;
  
          // Esperamos a que el gráfico se haya renderizado y luego aplicamos el degradado
          this.$nextTick(() => {
            this.aplicarDegradado();
          });
  
          this.loaded = true;
        } catch (e) {
          console.log(e);
        }
      },
  
      aplicarDegradado() {
        const chartInstance = this.$refs.myChart?.chart;
        if (chartInstance) {
          const ctx = chartInstance.ctx;
          const gradient = ctx.createLinearGradient(0, 0, 0, 400);
          gradient.addColorStop(0, 'rgba(0, 170, 255, 0.5)');
          gradient.addColorStop(1, 'rgba(0, 255, 170, 0.2)');
          chartInstance.data.datasets[0].backgroundColor = gradient;
          chartInstance.update();
        } else {
          console.error('El gráfico no está disponible aún.');
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px;
    max-width: 100%;
    min-height: 400px;
  }
  
  @media (max-width: 768px) {
    .chart-container {
      height: 300px;
    }
  }
  </style>