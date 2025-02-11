<template>
  <div>
    <input v-model="month" type="number" placeholder="Mes" />
    <input v-model="year" type="number" placeholder="Año" />
    <button @click="fetchData">Obtener datos</button>
    
    <canvas id="myChart" width="400" height="200"></canvas>
  </div>
</template>

<script>
import auth from '@/logic/auth';
import Chart from 'chart.js/auto';

export default {
  data() {
    return {
      month: '',
      year: '',
      chart: null,
    };
  },
  methods: {
    // Función que hace la petición al backend
    async fetchData() {
      try {
        // Obtén los datos del backend
        const response = await auth.obtenerProductosVendidosPorRango(this.month, this.year);

        // Actualiza el gráfico con los datos obtenidos
        this.updateChart(response.data);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    },

    // Método para realizar la petición al backend
   
    // Actualiza el gráfico con los datos recibidos
    updateChart(data) {
      // Si ya hay un gráfico, destrúyelo antes de crear uno nuevo
      if (this.chart) {
        this.chart.destroy();
      }

      const ctx = document.getElementById('myChart').getContext('2d');
      
      // Extrae los productos y las cantidades vendidas de los datos
      const productos = data.data.map(item => item.producto);
      const cantidades = data.data.map(item => item.cantidad_vendida);

      // Crea el gráfico con los datos recibidos
      this.chart = new Chart(ctx, {
        type: 'bar',  // Puedes cambiar el tipo de gráfico (por ejemplo, 'line' para un gráfico de líneas)
        data: {
          labels: productos,  // Los productos como etiquetas en el eje X
          datasets: [
            {
              label: 'Cantidad Vendida',  // Nombre de la serie de datos
              data: cantidades,  // Las cantidades vendidas
              backgroundColor: 'rgba(75, 192, 192, 0.2)',  // Color de las barras
              borderColor: 'rgba(75, 192, 192, 1)',  // Color de los bordes de las barras
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              beginAtZero: true,  // Empieza el eje X en 0
              title: {
                display: true,
                text: 'Productos',
              },
            },
            y: {
              beginAtZero: true,  // Empieza el eje Y en 0
              title: {
                display: true,
                text: 'Cantidad Vendida',
              },
            },
          },
        },
      });
    },
  },
};
</script>
