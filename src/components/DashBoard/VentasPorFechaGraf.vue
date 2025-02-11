<template>
    <div>
      <label for="filter">Filtrar por:</label>
      <select v-model="selectedFilter" @change="fetchData">
        <option value="diario">Día</option>
        <option value="semanal">Semana</option>
        <option value="mensual">Mes</option>
      </select>
  
      <canvas ref="salesChart"></canvas>
    </div>
  </template>
  
  <script>
  import { ref, onMounted, watch,computed  } from 'vue';
  import Chart from 'chart.js/auto';
  import auth from '@/logic/auth';
  
  export default {
    name: 'SalesChart',
    setup() {
      const salesChart = ref(null);
      const selectedFilter = ref("diario"); // Filtro por defecto
      let chartInstance = null; // Guardar la instancia del gráfico

      const xAxisLabel = computed(() => {
      switch (selectedFilter.value) {
        case "semanal": return "Semana del Año";
        case "mensual": return "Mes del Año";
        default: return "Fecha (Día)";
      }
    });
  
      // Función para obtener el endpoint correcto
      const getApiEndpoint = () => {
        switch (selectedFilter.value) {
          case "semanal":
            return auth.obtenerVentasPorSemana(); // Llamar API semanal
          case "mensual":
            return auth.obtenerVentasPorMes(); // Llamar API mensual
          default:
            return auth.obtenerVentasPorFecha(); // Llamar API diario
        }
      };
  
      const fetchData = async () => {
  try {
    const response = await getApiEndpoint();
    const data = response.data.data;

    console.log("Datos recibidos:", data); // 📌 Verifica los datos en la consola

    if (chartInstance) {
      chartInstance.destroy();
    }

    const chartData = {
      labels: data.labels,
      datasets: [
        {
          label: "Monto Total de Ventas",
          data: data.totales,
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
          yAxisID: "y",
        },
        {
          label: "Cantidad de Ventas",
          data: data.cantidades,
          backgroundColor: "rgba(255, 99, 132, 0.2)",
          borderColor: "rgba(255, 99, 132, 1)",
          borderWidth: 1,
          yAxisID: "y1", // 🚀 Eje secundario para cantidades
        },
      ],
    };

    chartInstance = new Chart(salesChart.value, {
      type: "bar",
      data: chartData,
      options: {
        responsive: true,
        scales: {
            x: {
                title: { 
                  display: true, 
                  text: xAxisLabel.value 
                }
              },
          y: { 
            beginAtZero: true, 
            title: { display: true, text: "Total de Ventas" }
          },
          y1: { 
            beginAtZero: true, 
            position: "right", 
            title: { display: true, text: "Cantidad de Ventas" },
            grid: { drawOnChartArea: false } 
          }
        }
      }
    });

  } catch (error) {
    console.error("Error al obtener los datos de ventas:", error);
  }
};

  
      // Llamar datos al iniciar el componente
      onMounted(fetchData);
  
      // Reactualizar datos al cambiar el filtro
      watch(selectedFilter, fetchData);
  
      return {
        salesChart,
        selectedFilter,
      };
    },
  };
  </script>
  
  <style scoped>
  select {
    margin-bottom: 10px;
    padding: 5px;
  }
  </style>