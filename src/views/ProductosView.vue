<template>
  <div class="products-container">
    <NavComponentVue />

    <div class="content-wrapper">
      <div class="text-center">
        <carga v-if="loading"></carga>
      </div>

      <v-card class="products-card" elevation="4">
        <v-card-title class="card-header">
          <v-icon large class="mr-2">mdi-package-variant</v-icon>
          Listado de Productos
          <v-spacer></v-spacer>
          <v-btn
              class="create-btn"
              color="primary"
              @click="openCreateModal"
              prepend-icon="mdi-plus"
          >
            Crear Producto
          </v-btn>
        </v-card-title>

        <v-divider class="divider"></v-divider>

        <v-table class="products-table">
          <thead>
          <tr>
            <th class="text-center">No.</th>
            <th class="text-center">Código</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Precio Compra</th>
            <th class="text-center">Precio Venta</th>
            <th class="text-center">Existencias</th>
            <th class="text-center">Fecha Entrada</th>
            <th class="text-center">Fecha Actualización</th>
            <th class="text-center">Acciones</th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, a) in list" :key="a">
            <td class="text-center">{{ a+1 }}</td>
            <td class="text-center">{{ item.codigo }}</td>
            <td class="text-center">{{ item.name }}</td>
            <td class="text-center">{{ formatCurrency(item.priceI) }}</td>
            <td class="text-center">{{ formatCurrency(item.priceF) }}</td>
            <td class="text-center">
              <v-chip :color="getStockColor(item.stock)" small>
                {{ item.stock }}
              </v-chip>
            </td>
            <td class="text-center">{{ formatDate(item.dateIn) }}</td>
            <td class="text-center">{{ formatDate(item.dateUp) }}</td>
            <td class="text-center actions-cell">
              <v-btn icon variant="text" color="primary" @click="openEditModal(item)" class="action-btn">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon variant="text" color="error" @click="openDialog(item)" class="action-btn">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Modal Edición -->
      <v-dialog v-model="dialog" max-width="600" persistent>
        <v-card class="edit-modal">
          <v-card-title class="modal-header">
            <v-icon class="mr-2">mdi-food-fork-drink</v-icon>
            Editar Producto
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitEditForm">
              <v-text-field v-model="productEdit.codigo" label="Código*" required color="primary" hint="El código del producto es único" class="mb-4" />
              <v-text-field v-model="productEdit.name" label="Nombre*" required color="primary" class="mb-4" />
              <v-text-field v-model="productEdit.priceI" label="Precio de Coste*" type="number" required color="primary" prefix="$" class="mb-4" />
              <v-text-field v-model="productEdit.priceF" label="Precio de Venta*" type="number" required color="primary" prefix="$" class="mb-4" />
              <v-text-field v-model="productEdit.stock" label="Existencias*" type="number" required color="primary" class="mb-4" />
              <small class="text-caption text-medium-emphasis"><span class="text-red">* indica que los campos son requeridos</span></small>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="error" @click="closeEditModal">Cancelar</v-btn>
            <v-btn color="primary" variant="tonal" @click="submitEditForm">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- Modal Creación -->
      <v-dialog v-model="create" max-width="600" persistent>
        <v-card class="create-modal">
          <v-card-title class="modal-header">
            <v-icon class="mr-2">mdi-ice-pop</v-icon>
            Crear Producto
          </v-card-title>
          <v-card-text>
            <v-form @submit.prevent="submitCreateForm">
              <v-text-field v-model="productCreate.codigo" label="Código*" required color="primary" hint="El código es único" class="mb-4" />
              <v-text-field v-model="productCreate.name" label="Nombre del producto*" required color="primary" class="mb-4" />
              <v-text-field v-model="productCreate.priceI" label="Precio de coste*" type="number" required color="primary" prefix="$" class="mb-4" />
              <v-text-field v-model="productCreate.priceF" label="Precio de venta*" type="number" required color="primary" prefix="$" class="mb-4" />
              <v-text-field v-model="productCreate.stock" label="Existencias*" type="number" required color="primary" class="mb-4" />
              <small class="text-caption text-medium-emphasis"><span class="text-red">* indica que los campos son requeridos</span></small>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="text" color="error" @click="closeCreatedModal">Cancelar</v-btn>
            <v-btn color="primary" variant="tonal" @click="submitCreateForm">Crear</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <modal @delete="deleteUser" :user="usuarioDele" ref="Modal" />
      <alert v-model="changes" :tex="tex" :titu="titu" :typ="typ" />
    </div>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth'
import carga from '@/components/LoadingComponent.vue'
import modal from '@/components/ModalDeleteComponent.vue'
import alert from '@/components/AlertComponent.vue'

export default {
  data() {
    return {
      list: [],
      dialog: false,
      showDelete: false,
      productEdit: { id: '', codigo: '', name: '', priceI: '', priceF: '', stock: '' },
      productCreate: { id: '', codigo: '', name: '', priceI: '', priceF: '', stock: '' },
      changes: false,
      tex: '',
      titu: '',
      typ: '',
      timeoutDuration: 5000,
      timerId: null,
      loading: false,
      usuarioDele: null,
      create: false
    }
  },
  components: { NavComponentVue, carga, modal, alert },
  mounted() {
    this.getProducts()
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const [day, month, year] = dateString.split('-')
      if (!day || !month || !year) return dateString
      const fullYear = year.length === 2 ? `20${year}` : year
      const date = new Date(`${fullYear}-${month}-${day}`)
      return new Intl.DateTimeFormat('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(date)
    },
    formatCurrency(value) {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
    },
    getStockColor(stock) {
      return stock < 10 ? 'error' : stock < 20 ? 'warning' : 'success'
    },
    async getProducts() {
      try {
        this.loading = true
        const res = await auth.getProducts()
        this.list = res.data.data
      } catch (error) {
        this.showAlert('Algo salió mal', 'error', 'Ha ocurrido un error obteniendo los datos')
        console.error('Error al obtener productos:', error)
      } finally {
        this.loading = false
      }
    },
    openEditModal(product) {
      this.productEdit = { ...product }
      this.dialog = true
    },
    openCreateModal() {
      this.create = true
    },
    async submitEditForm() {
      try {
        await auth.updateProdut(
            this.productEdit.codigo,
            this.productEdit.name,
            this.productEdit.priceI,
            this.productEdit.priceF,
            this.productEdit.stock,
            this.productEdit.id
        )
        this.closeEditModal()
        this.showAlert('Producto modificado', 'success', 'Producto actualizado satisfactoriamente')
        this.getProducts()
      } catch {
        this.showAlert('Error', 'error', 'No se pudo actualizar el producto')
      }
    },
    async submitCreateForm() {
      try {
        await auth.createProduct(
            this.productCreate.codigo,
            this.productCreate.name,
            this.productCreate.priceI,
            this.productCreate.priceF,
            this.productCreate.stock
        )
        this.closeCreatedModal()
        this.showAlert('Producto añadido', 'success', 'Producto creado satisfactoriamente')
        this.getProducts()
      } catch {
        this.showAlert('Error', 'error', 'No se pudo crear el producto')
      }
    },
    closeEditModal() {
      this.dialog = false
      this.resetEditForm()
    },
    closeCreatedModal() {
      this.create = false
      this.resetCreateForm()
    },
    resetEditForm() {
      this.productEdit = { id: '', codigo: '', name: '', priceI: '', priceF: '', stock: '' }
    },
    resetCreateForm() {
      this.productCreate = { id: '', codigo: '', name: '', priceI: '', priceF: '', stock: '' }
    },
    showAlert(titu, typ, tex) {
      this.titu = titu
      this.typ = typ
      this.tex = tex
      this.changes = true
      this.timerId = setTimeout(this.closeAlert, this.timeoutDuration)
    },
    closeAlert() {
      this.changes = false
      clearTimeout(this.timerId)
    },
    openDialog(product) {
      this.usuarioDele = product
      this.$refs.Modal.dialog = true
    },
    async deleteUser(product) {
      try {
        await auth.deleteProducto(product.id)
        this.showAlert('Producto eliminado', 'success', 'El producto ha sido eliminado satisfactoriamente')
        this.getProducts()
      } catch {
        this.showAlert('Error', 'error', 'No se pudo eliminar el producto')
      }
    }
  }
}
</script>

<style scoped>
.products-container {
  min-height: 100vh;
  background-color: #FFF9C4;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
}

.products-card {
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  background-color: #0D47A1;
  color: white;
  padding: 16px 24px;
}

.create-btn {
  text-transform: none;
  letter-spacing: normal;
}

.divider {
  border-color: rgba(0, 0, 0, 0.1);
}

.products-table {
  width: 100%;
}

.products-table th {
  background-color: #E3F2FD;
  color: #0D47A1;
  font-weight: 600;
  padding: 12px;
}

.products-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.products-table tr:hover {
  background-color: #F5F5F5;
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  margin: 0 4px;
}

.edit-modal,
.create-modal {
  border-radius: 12px;
}

.modal-header {
  background-color: #0D47A1;
  color: white;
}

/* Responsive */
@media (max-width: 960px) {
  .content-wrapper {
    padding: 16px;
  }

  .products-table {
    display: block;
    overflow-x: auto;
  }
}

@media (max-width: 600px) {
  .content-wrapper {
    padding: 12px;
  }

  .card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .create-btn {
    width: 100%;
  }

  .products-table th,
  .products-table td {
    padding: 8px 4px;
    font-size: 0.85rem;
  }
}
</style>
