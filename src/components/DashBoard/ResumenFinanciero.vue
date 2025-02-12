<template>
    <v-container class="pa-4">
      <!-- Tarjeta Principal: Resumen Financiero -->
      <v-card class="elevation-12 rounded-xl overflow-hidden mx-auto px-4 py-4">
        <v-card-item>
          <div>
            <div class="text-overline mb-2 text-h1 font-weight-bold">Resumen General</div>
            <div class="text-caption">
              Datos clave sobre ingresos, costos y ganancias netas
            </div>
          </div>
        </v-card-item>
  
        <v-row class="mt-2">
          <!-- Tarjeta de Ingresos -->
          <v-col cols="12" md="4">
            <v-card color="blue-darken-3" variant="tonal" class="mx-auto">
              <v-card-item>
                <div>
                  <div class="text-overline mb-1">Ingresos Totales</div>
                  <div class="text-h6 mb-1 font-weight-bold">
                    {{ ingresos ? `$${ingresos.toLocaleString()}` : "Cargando..." }}
                  </div>
                  <div class="text-caption">Total generado por ventas</div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
  
          <!-- Tarjeta de Costos -->
          <v-col cols="12" md="4">
            <v-card color="red-darken-3" variant="tonal" class="mx-auto">
              <v-card-item>
                <div>
                  <div class="text-overline mb-1">Costos Totales</div>
                  <div class="text-h6 mb-1 font-weight-bold">
                    {{ costos ? `$${costos.toLocaleString()}` : "Cargando..." }}
                  </div>
                  <div class="text-caption">Costos de productos vendidos</div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
  
          <!-- Tarjeta de Ganancia Neta -->
          <v-col cols="12" md="4">
            <v-card color="green-darken-1" variant="tonal" class="mx-auto">
              <v-card-item>
                <div>
                  <div class="text-overline mb-1">Ganancia Neta</div>
                  <div class="text-h6 mb-1 font-weight-bold">
                    {{ gananciaNeta ? `$${gananciaNeta.toLocaleString()}` : "Cargando..." }}
                  </div>
                  <div class="text-caption">Ingresos menos costos</div>
                </div>
              </v-card-item>
            </v-card>
          </v-col>
        </v-row>
      </v-card>
    </v-container>
  </template>
  
  <script>
  import auth from '@/logic/auth';
  
  export default {
    data() {
      return {
        ingresos: null,
        costos: null,
        gananciaNeta: null
      };
    },
    async created() {
      try {
        const ingresosRes = await auth.obtenerTotalIngresos();
        this.ingresos = ingresosRes.data.data;
  
        const costosRes = await auth.obtenerTotalCosto();
        this.costos = costosRes.data.data;
        const gananciaRes = await auth.obtenerGananciaNeta();
        this.gananciaNeta = gananciaRes.data.data;
      } catch (error) {
        console.error('Error obteniendo los datos financieros:', error);
      }
    }
  };
  </script>