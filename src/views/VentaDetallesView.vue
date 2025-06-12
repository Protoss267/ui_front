<template>
  <div class="sales-container">
    <NavComponentVue></NavComponentVue>
    <router-view/>

    <div class="sales-content">
      <v-card class="sales-card" elevation="12" rounded="xl">
        <v-card-title class="sales-title">Lista de Ventas Diaria</v-card-title>
        <v-divider></v-divider>

        <v-row class="date-filters">
          <v-col cols="12" md="4">
            <v-menu
                v-model="menuI"
                :close-on-content-click = "false"
                min-width="200px" rounded>
              <template v-slot:activator="{ props }">
                <v-text-field
                    v-bind="props"
                    label="Seleccione la fecha Inicial"
                    v-model="dateI"
                    variant="outlined"
                    color="blue-darken-4"
                    bg-color="yellow-lighten-5"
                    prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-card>
                <v-card-text>
                  <div class="mx-auto text-center pb-2">
                    <v-date-picker
                        color="primary"
                        elevation="24"
                        :max="fechaActual"
                        v-model="dateI"
                        @update:model-value="menuI = false"
                    ></v-date-picker>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" md="4">
            <v-menu
                v-model="menuF"
                :close-on-content-click="false"
                min-width="200px" rounded>
              <template v-slot:activator="{ props }">
                <v-text-field
                    v-bind="props"
                    label="Seleccione la fecha final"
                    v-model="dateF"
                    variant="outlined"
                    color="blue-darken-4"
                    bg-color="yellow-lighten-5"
                    prepend-inner-icon="mdi-calendar"
                ></v-text-field>
              </template>
              <v-card>
                <v-card-text>
                  <div class="mx-auto text-center pb-2">
                    <v-date-picker
                        color="primary"
                        elevation="24"
                        :max="fechaActual"
                        v-model="dateF"
                        @update:model-value="menuF = false"
                    ></v-date-picker>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-col>

          <v-col cols="12" md="4" class="d-flex align-center">
            <v-btn
                prepend-icon="mdi-magnify"
                color="blue-darken-4"
                size="large"
                block
                @click="listVenta"
                class="filter-btn"
            >
              Mostrar
            </v-btn>
          </v-col>
        </v-row>

        <v-card-text>
          <v-table density="comfortable" class="sales-table">
            <thead>
            <tr>
              <th class="text-left">No</th>
              <th class="text-left">Fecha</th>
              <th class="text-left">Transferencia</th>
              <th class="text-left">Saldo Final</th>
              <th class="text-left">Detalles</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sold,a) in solds" :key="sold.id">
              <td>{{ a+1 }}</td>
              <td>{{ sold.sold.fecha }}</td>
              <td>{{ sold.sold.transfer }}</td>
              <td>{{ sold.sold.amount }}</td>
              <td>
                <router-link :to="{name: 'VentaDetalle', params: {id: sold.sold.id}}">
                  <v-btn
                      icon
                      variant="text"
                      color="blue-darken-4"
                      size="small"
                  >
                    <v-icon>mdi-eye-outline</v-icon>
                  </v-btn>
                </router-link>
              </td>
            </tr>

            <tr class="total-row">
              <td colspan="2" class="font-weight-bold">Importe Total</td>
              <td class="font-weight-bold">{{ this.ventaT }}</td>
              <td colspan="2"></td>
            </tr>
            <tr class="summary-row">
              <td class="font-weight-bold">Costo: {{ this.coste }}</td>
              <td class="font-weight-bold">Ganancia: {{ this.ganancia }}</td>
              <td colspan="3"></td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>

    <alert v-model="alert" :tex="tex" :titu="titu" :typ="typ"></alert>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth';
import Alert from '@/components/AlertComponent.vue';

export default {
  data(){
    return{
      dateI: null,
      dateF: null,
      menuI: false,
      menuF: false,
      fechaFFormateada: '',
      fechaIFormateada: '',
      fechaActual: this.obtenerFechaActual(),
      ventaT: 0,
      coste: 0,
      ganancia: 0,
      stock: 0,
      alert: false,
      tex: '',
      typ: '',
      titu: '',
      solds: []
    }
  },
  components: { NavComponentVue, Alert },
  methods: {
    Detalle(id) {
      this.$router.push("/ventaDetalle/" + id)
    },

    obtenerFechaActual() {
      const hoy = new Date();
      const year = hoy.getFullYear();
      const mes = ('0'+ (hoy.getMonth()+1)).slice(-2);
      const dia = ('0'+ hoy.getDate()).slice(-2);
      return year+'-'+mes+'-'+dia;
    },

    async listVenta() {
      if(this.dateI == null || this.dateF == null) {
        this.alert = true
        this.tex = 'Los campos no pueden estar vacios'
        this.typ = 'error'
        this.titu = 'Algo salio mal'
      } else {
        try {
          this.loading = true
          const res = await auth.getSoldsByRange(this.dateI, this.dateF);
          if(res.data) {
            console.log(res.data.data);
            this.loading = false
            this.solds = res.data.data
            this.ventaT = res.data.total
            this.coste = res.data.coste
            this.ganancia = res.data.ganancia
          } else {
            console.log('Algo salio mal en el if');
          }
        } catch(error) {
          console.log('Algo salio mal');
        }
      }
    }
  }
}
</script>

<style scoped>
.sales-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFEB3B 0%, #FFF9C4 100%);
  padding: 24px;
}

.sales-content {
  max-width: 1200px;
  margin: 0 auto;
}

.sales-card {
  width: 100%;
  padding: 24px;
  border-radius: 16px !important;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.sales-title {
  color: #0D47A1;
  font-weight: 600;
  padding-bottom: 12px;
}

.date-filters {
  padding: 16px;
}

.filter-btn {
  background: linear-gradient(90deg, #1565C0 0%, #0D47A1 100%) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 56px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.2);
  transition: all 0.3s ease;
}

.filter-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 71, 161, 0.3);
}

.sales-table {
  margin-top: 16px;
}

.sales-table th {
  font-weight: 600;
  color: #0D47A1 !important;
  background-color: #E3F2FD;
}

.sales-table tr:hover {
  background-color: #E3F2FD !important;
}

.total-row, .summary-row {
  background-color: #E8F5E9;
}

.total-row td {
  font-size: 1.1em;
}

.summary-row td {
  font-size: 1em;
}

:deep(.v-field__outline) {
  color: #BBDEFB !important;
}

:deep(.v-field--variant-outlined .v-field__outline__start) {
  border-radius: 8px 0 0 8px !important;
}

:deep(.v-field--variant-outlined .v-field__outline__end) {
  border-radius: 0 8px 8px 0 !important;
}
</style>