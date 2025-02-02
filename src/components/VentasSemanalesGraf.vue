<template>
    <div class="chart-container">
    <Bar v-if="loaded"
      id="my-chart-id"
      :options="chartOptions"
      :data="chartData"
    />
</div>
  </template>
  
  <script>
  import { Bar } from 'vue-chartjs'
  import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js'
import auth from '@/logic/auth';
  
  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)
  
  export default {
    name: 'BarChart',
    components: { Bar },
    data() {
  return {
    loaded: false,
    chartData: {
      labels: [], // Aquí irían los días de la semana
      datasets: [
    {
      label: 'Ventas',
      borderColor: '#9b59b6', // Morado para el borde
      borderWidth: 3,
      data: [],
      backgroundColor: function(context) {
        const chart = context.chart;
        const ctx = chart.ctx;
        const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
        gradient.addColorStop(0, '#f39c12'); // Rosa al inicio
        gradient.addColorStop(1, '#9b59b6'); // Morado al final
        return gradient;
      }
    }
  ]

    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          ticks: {
            font: {
              size: 14,
              family: 'Arial, sans-serif',
              weight: 'bold',
              lineHeight: 1.2
            }
          }
        },
        y: {
          ticks: {
            font: {
              size: 14,
              family: 'Arial, sans-serif',
              weight: 'bold',
              lineHeight: 1.2
            }
          },
          beginAtZero: true,
        }
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: function(context) {
              return `Ventas: ${context.raw}`;
            }
          }
        }
      },
      elements: {
        bar: {
          borderRadius: 8, // Bordes redondeados para un estilo más suave
          borderSkipped: 'top', // Opcional: hace que el borde no sea visible en la parte superior de la barra
          backgroundColor: function(context) {
            // Añadimos un gradiente en el fondo
            const chart = context.chart;
            const ctx = chart.ctx;
            const gradient = ctx.createLinearGradient(0, 0, 0, chart.height);
            gradient.addColorStop(0, '#f39c12'); // Color inicial
            gradient.addColorStop(1, '#e67e22'); // Color final
            return gradient;
          },
          // Sombra para hacer que las barras resalten más
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.2)',
        }
      }
    }
  };


    
},
      
    
    mounted(){
        this.obtenerDatos();
        
            
        
    },
    methods:{
       async obtenerDatos()
       {
        this.loaded = false;

            try{
                const respuesta = await auth.getSoldsByWeek();
                console.log(respuesta);
                this.chartData.labels = Object.keys(respuesta.data.data).map(fecha=>{
                    const day = new Date(fecha);
                    return day.toLocaleDateString('es-ES',{weekday:'long'})
                }); 
                this.chartData.datasets[0].data = Object.values(respuesta.data.data); 
                this.loaded=true;
            }
            catch(e)
            {
                console.log(e);
                
            }
       }
    }
  }
  </script>
  <style scoped>
  .chart-container {
    width: 100%;
    height: 400px; /* Establece una altura mínima */
    max-width: 100%;
    min-height: 400px; /* Puedes ajustar esta altura a lo que necesites */
  }
  
  @media (max-width: 768px) {
    .chart-container {
      height: 300px; /* Ajusta la altura en pantallas más pequeñas */
    }
  }
  </style>
  