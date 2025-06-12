<template>
  <div class="page-container">
    <v-row no-gutters>
      <v-col>
        <NavComponentVue />
      </v-col>
    </v-row>

    <router-view />

    <v-card class="productos-card my-5 mx-5" elevation="12" rounded="xl">
      <v-card-title class="productos-title">
        <v-icon left color="white" size="24">mdi-package-variant</v-icon>
        Listado de productos con baja existencia
      </v-card-title>

      <v-card-text>
        <v-simple-table dense class="productos-table" fixed-header>
          <thead>

          <tr class="table-header-row">
            <th>No</th>
            <th>Código</th>
            <th>Nombre</th>
            <th>Existencia Actual</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(product, i) in productos" :key="product.id || i" class="table-row">
            <td class="text-center">{{ i + 1 }}</td>
            <td class="text-center">{{ product.codigo }}</td>
            <td class="text-center">{{ product.name }}</td>
            <td class="text-center">
              <v-chip
                  :color="product.stock < 5 ? 'red darken-2' : product.stock < 10 ? 'orange lighten-1' : 'green lighten-2'"
                  dark
                  small
              >
                {{ product.stock }}
              </v-chip>
            </td>
          </tr>
          <tr v-if="productos.length === 0">
            <td colspan="4" class="no-products">No hay productos con baja existencia.</td>
          </tr>
          </tbody>
        </v-simple-table>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth'

export default {
  components: { NavComponentVue },
  data() {
    return {
      productos: []
    }
  },
  mounted() {
    this.venta()
  },
  methods: {
    async venta() {
      try {
        const res = await auth.getLowStock()
        if (res.data.success) {
          this.productos = res.data.data
        } else {
          this.productos = []
        }
      } catch (error) {
        console.error('Error obteniendo productos:', error)
        this.productos = []
      }
    }
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fdf39b 0%, #FFF9C4 100%);
  padding: 24px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.productos-card {
  width: 100%;
  max-width: 960px;
  border-radius: 16px !important;
  background-color: white;
  box-shadow: 0 15px 30px rgba(13, 71, 161, 0.2) !important;
  padding: 32px 32px;
  transition: box-shadow 0.3s ease;
}

.productos-card:hover {
  box-shadow: 0 20px 40px rgba(13, 71, 161, 0.3) !important;
}

.productos-title {
  font-weight: 700;
  font-size: 24px;
  color: #0D47A1;
  margin-bottom: 20px;
  user-select: none;
}

/* Encabezado mejorado */
.productos-table {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  background-color: #fefefe;
  border: 1px solid #e3eaf9;
  font-size: 15px;
  color: #263238;
  width: 100%;
  user-select: none;
}

.productos-table thead tr:first-child td.table-header-title {
  background: linear-gradient(90deg, #1565c0, #0d47a1);
  color: white;
  font-weight: 700;
  font-size: 20px;
  padding: 16px 0;
  text-align: center;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.productos-table thead tr.table-header-row th {
  background-color: #bbdefb;
  color: #0d47a1;
  font-weight: 600;
  padding: 14px 20px;
  text-align: center;
  border-bottom: 2px solid #90caf9;
  border-right: 1px solid #e3eaf9;
  transition: background-color 0.3s ease;
  text-transform: uppercase;
  font-size: 14px;
  letter-spacing: 1.5px;
  user-select: none;
}

.productos-table thead tr.table-header-row th:last-child {
  border-right: none;
  border-top-right-radius: 12px;
}

.productos-table thead tr.table-header-row th:first-child {
  border-top-left-radius: 12px;
}

.productos-table thead tr.table-header-row th:hover {
  background-color: #90caf9;
  cursor: default;
}

.productos-table tbody tr.table-row:hover {
  background-color: #e3f2fd;
  cursor: default;
  transition: background-color 0.3s ease;
}

.productos-table tbody td {
  padding: 14px 20px;
  border-bottom: 1px solid #e3eaf9;
  text-align: center;
  vertical-align: middle;
}

.no-products {
  padding: 20px;
  text-align: center;
  color: #90a4ae;
  font-style: italic;
}

.v-chip {
  font-weight: 600;
  font-size: 14px;
  padding: 0 12px;
  height: 28px;
  border-radius: 14px;
  user-select: none;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12);
  transition: background-color 0.3s ease;
}
</style>
