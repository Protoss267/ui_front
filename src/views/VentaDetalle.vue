<template>
  <div class="sales-detail-container">
    <NavComponentVue></NavComponentVue>
    <router-view/>

    <div class="sales-detail-content">
      <v-card class="sales-detail-card" elevation="12" rounded="xl">
        <v-card-title class="sales-detail-title">Detalles de la venta</v-card-title>
        <v-divider></v-divider>

        <v-card-text>
          <v-table density="comfortable" class="sales-detail-table">
            <thead>
            <tr>
              <th class="text-left">Fecha</th>
              <th class="text-left">Productos</th>
              <th class="text-left">Cantidad Vendida</th>
              <th class="text-left">Precio del Producto</th>
              <th class="text-left">Total</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(venta, i) in ventas.items" :key="i">
              <td v-if="i == 0" :rowspan="ventas.items.length" class="date-cell">
                {{ ventas.fecha }}
              </td>
              <td>{{ venta.product.name }}</td>
              <td>{{ venta.amount }}</td>
              <td>{{ venta.product.priceF }}</td>
              <td v-if="i == 0" :rowspan="ventas.items.length" class="total-cell">
                {{ ventas.amount }}
              </td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth';

export default {
  data() {
    return {
      ventaID: this.$route.params.id,
      ventas: []
    }
  },
  components: { NavComponentVue },
  mounted() {
    this.venta()
  },
  methods: {
    async venta() {
      const res = await auth.getSold(this.ventaID)
      console.log(res);
      if(res.data.success) {
        this.ventas = res.data.data
      }
      console.log(this.ventas.items.length);
    }
  }
}
</script>

<style scoped>
.sales-detail-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #FFEB3B 0%, #FFF9C4 100%);
  padding: 24px;
}

.sales-detail-content {
  max-width: 1200px;
  margin: 0 auto;
}

.sales-detail-card {
  width: 100%;
  padding: 24px;
  border-radius: 16px !important;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.sales-detail-title {
  color: #0D47A1;
  font-weight: 600;
  padding-bottom: 12px;
}

.sales-detail-table {
  margin-top: 16px;
}

.sales-detail-table th {
  font-weight: 600;
  color: #0D47A1 !important;
  background-color: #E3F2FD;
}

.sales-detail-table tr:hover {
  background-color: #E3F2FD !important;
}

.date-cell {
  font-weight: 500;
  color: #1565C0;
}

.total-cell {
  font-weight: 600;
  color: #0D47A1;
  background-color: #E8F5E9;
}

/* Estilos consistentes para los bordes de los campos */
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