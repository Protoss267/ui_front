<template>
  <NavComponent />
  <div id="dashboard" v-if="hasPermission" class="dashboard-container">
    <!-- Barra de navegación superior -->
    <header class="dashboard-nav">
      <v-tabs
          v-model="activeView"
          center-active
          grow
          color="blue-darken-4"
      >
        <v-tab value="Ventas" class="nav-tab">
          <v-icon left>mdi-chart-bar</v-icon>
          Monitoreo de Ventas
        </v-tab>
        <v-tab value="Ganancia" class="nav-tab">
          <v-icon left>mdi-finance</v-icon>
          Ingresos y Gastos
        </v-tab>
        <v-tab value="Productos" class="nav-tab">
          <v-icon left>mdi-package-variant</v-icon>
          Productos
        </v-tab>
      </v-tabs>
    </header>

    <!-- Contenedor principal -->
    <v-main class="main-content">
      <v-container fluid class="content-container">
        <v-window v-model="activeView">
          <!-- Vista de Ventas -->
          <v-window-item value="Ventas">
            <v-row class="single-chart-row">
              <v-col cols="12">
                <div class="chart-wrapper">
                  <salesChart class="chart-component"></salesChart>
                </div>
              </v-col>
            </v-row>
            <v-row class="single-chart-row">
              <v-col cols="12">
                <div class="chart-wrapper">
                  <PieChartGraf class="chart-component"></PieChartGraf>
                </div>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Vista de Ganancia -->
          <v-window-item value="Ganancia">
            <v-row class="single-chart-row">
              <v-col cols="12">
                <div class="chart-wrapper">
                  <ResumenFinanciero class="chart-component"></ResumenFinanciero>
                </div>
              </v-col>
            </v-row>
            <v-row class="single-chart-row">
              <v-col cols="12">
                <div class="chart-wrapper">
                  <GananciasNetasGraf class="chart-component"></GananciasNetasGraf>
                </div>
              </v-col>
            </v-row>


          </v-window-item>

          <!-- Vista de Productos -->
          <v-window-item value="Productos">
            <v-row class="single-chart-row">
              <v-col cols="12">
                <div class="chart-wrapper">
                  <ProductoBajoGraf class="chart-component"></ProductoBajoGraf>
                </div>
              </v-col>
            </v-row>
          </v-window-item>
        </v-window>
      </v-container>
    </v-main>
  </div>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import NavComponent from '@/components/NavComponent.vue';
import salesChart from '@/components/DashBoard/VentasPorFechaGraf.vue';
import PieChartGraf from '@/components/DashBoard/PieChartGraf.vue';
import ResumenFinanciero from '@/components/DashBoard/ResumenFinanciero.vue';
import GananciasNetasGraf from '@/components/DashBoard/GananciasNetasGraf.vue';
import ProductoBajoGraf from '@/components/DashBoard/ProductoBajoGraf.vue';
import { checkPermission } from '@/logic/admin.js';

export default defineComponent({
  name: 'HomeView',
  components: {
    NavComponent,
    salesChart,
    PieChartGraf,
    ResumenFinanciero,
    GananciasNetasGraf,
    ProductoBajoGraf
  },
  setup() {
    const activeView = ref('Ganancia');
    const hasPermission = ref(false);

    onMounted(async () => {
      hasPermission.value = await checkPermission();
    });

    return {
      activeView,
      hasPermission
    };
  }
});
</script>

<style scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.dashboard-nav {
  background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-tab {
  color: white !important;
  font-weight: 500;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  padding: 16px 24px;
}

.nav-tab:hover {
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.main-content {
  padding: 24px;
  flex: 1;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 16px;
}

.single-chart-row {
  margin-bottom: 24px;
}

.chart-wrapper {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: visible;
}

.chart-component {
  flex: 1;
  width: 100%;
  min-height: 400px;
  position: relative;
}

/* Ajustes para los gráficos */
.chart-wrapper >>> .apexcharts-canvas {
  margin: 0 auto;
}

.chart-wrapper >>> .apexcharts-legend {
  position: relative !important;
  padding: 16px 0;
  justify-content: center;
  width: 100% !important;
}

.chart-wrapper >>> .apexcharts-tooltip {
  font-family: 'Roboto', sans-serif;
  font-size: 14px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
  border-radius: 8px;
}

/* Responsive design */
@media (max-width: 960px) {
  .main-content {
    padding: 16px;
  }

  .content-container {
    padding: 0 8px;
  }

  .chart-wrapper {
    padding: 16px;
  }

  .chart-component {
    min-height: 350px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 12px;
  }

  .nav-tab {
    padding: 12px 8px;
    font-size: 0.85rem;
  }

  .nav-tab .v-icon {
    font-size: 1.2rem;
    margin-right: 4px;
  }

  .chart-wrapper {
    padding: 12px;
  }

  .chart-component {
    min-height: 300px;
  }

  .chart-wrapper >>> .apexcharts-legend {
    font-size: 12px;
    padding: 8px 0;
  }
}
</style>