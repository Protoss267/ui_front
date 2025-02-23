<template>
  <NavComponent />
  <div id="dashboard" v-if="hasPermission ">
    <!-- Barra de navegación en la parte superior -->
    <header class="navbar">
      <ul>
        <li @click="setView('Ventas')">Monitoreo de ventas</li>
        <li @click="setView('Ganancia')">Ingresos y Gastos</li>
        <li @click="setView('Productos')">Productos</li>
      </ul>
    </header>

    <!-- Contenedor principal con contenido y gráficos -->
    <div class="main-container">
      <!-- Contenido principal -->
      <section class="content">
        <div v-if="activeView === 'Ventas'">
          
          <v-row>
            
            <v-col cols="12"><salesChart></salesChart></v-col>
            <v-col cols="12"><PieChartGraf></PieChartGraf></v-col>
          
          </v-row>
        </div>
        <div v-if="activeView === 'Ganancia'">
          <ResumenFinanciero></ResumenFinanciero>
          <GananciasNetasGraf></GananciasNetasGraf>
          <ProductoBajoGraf></ProductoBajoGraf>
        </div>
        <div v-if="activeView === 'Productos'">
          <ProductoBajoGraf></ProductoBajoGraf>
        </div>        
      </section>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import NavComponent from '@/components/NavComponent.vue';
import salesChart from '@/components/DashBoard/VentasPorFechaGraf.vue'
import PieChartGraf from '@/components/DashBoard/PieChartGraf.vue';
import ResumenFinanciero from '@/components/DashBoard/ResumenFinanciero.vue';
import GananciasNetasGraf from '@/components/DashBoard/GananciasNetasGraf.vue';
import ProductoBajoGraf from '@/components/DashBoard/ProductoBajoGraf.vue';
import { checkPermission } from '@/logic/admin.js'




export default defineComponent({
  name: 'HomeView',
   usuario: null,
  components: {
    NavComponent,
    salesChart,
    PieChartGraf,
    ResumenFinanciero,
    GananciasNetasGraf,
    ProductoBajoGraf
  },
  setup() {
    // Estado para manejar la vista activa
    const activeView = ref('Ganancia'); // Vista predeterminada es BarChart

    // Método para cambiar la vista activa
    const setView = (view) => {
      activeView.value = view;
    };      
    
    const hasPermission = ref(false);
    console.log(hasPermission);
    
    onMounted(async () => {
      hasPermission.value = await checkPermission();
      console.log("tienes permisos???", hasPermission.value);
      
    })
    return {
      activeView,
      setView,
      hasPermission
    };
  }
});

</script>

<style scoped>
#dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.navbar {
  background-color: transparent; /* Fondo transparente */
  color: #34495e; /* Amarillo claro para el texto */
  padding: 1rem;
  text-align: center;
}

.navbar ul {
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: center;
}

.navbar ul li {
  margin: 0 2rem;
  cursor: pointer;
  font-size: 1.2rem;
  color: #202020; /* Amarillo claro para las letras */
  transition: color 0.3s ease, transform 0.2s ease; /* Transición suave para el color y el efecto hover */
}

.navbar ul li:hover {
  color: #d6cf67; /* Color al hacer hover */
  transform: scale(1.05); /* Efecto de aumento al hacer hover */
  border-radius: 5px;
}


.main-container {
  display: flex;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background-color: #f5f5f5;
}

.content {
  flex: 1;
  width: 100%;
  max-width: 1200px;
  padding: 1rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.content div {
  margin-bottom: 2rem;
}
</style>