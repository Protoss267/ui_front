<template>
  <div class="users-container">
    <NavComponentVue />

    <div class="content-wrapper">
      <div class="text-center">
        <carga v-if="loading"></carga>
      </div>

      <v-card class="users-card" elevation="4">
        <v-card-title class="card-header">
          <v-icon large class="mr-2">mdi-account-group</v-icon>
          Listado de Usuarios
          <v-spacer></v-spacer>
          <v-btn
              class="create-btn"
              color="primary"
              @click="openCreateModal"
              prepend-icon="mdi-plus"
          >
            Crear Usuario
          </v-btn>
        </v-card-title>

        <v-divider class="divider"></v-divider>

        <v-table class="users-table">
          <thead>
          <tr>
            <th class="text-center">No.</th>
            <th class="text-center">Nombre</th>
            <th class="text-center">Usuario</th>
            <th class="text-center">Administrador</th>
            <th class="text-center">Creado</th>
            <th class="text-center">Modificado</th>
            <th class="text-center">Acciones</th>
          </tr>
          </thead>

          <tbody>
          <tr v-for="(item, a) in list" :key="a">
            <td class="text-center">{{ a+1 }}</td>
            <td class="text-center">{{ item.name }}</td>
            <td class="text-center">{{ item.username }}</td>
            <td class="text-center">
              <v-chip :color="item.isAdmin ? 'primary' : 'secondary'" small>
                {{ item.isAdmin ? 'Sí' : 'No' }}
              </v-chip>
            </td>
            <td class="text-center">{{ formatDate(item.created.date) }}</td>
            <td class="text-center">{{ formatDate(item.updated.date) }}</td>
            <td class="text-center actions-cell">
              <v-btn
                  icon
                  variant="text"
                  color="primary"
                  @click="openEditModal(item)"
                  class="action-btn"
              >
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn
                  icon
                  variant="text"
                  color="error"
                  @click="openDialog(item)"
                  class="action-btn"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
          </tbody>
        </v-table>
      </v-card>

      <!-- Modal de Edición -->
      <user-edit-modal
          v-model="dialog"
          :user="userEdit"
          @submit="submitEditForm"
          @close="closeEditModal"
      />

      <!-- Modal de Creación -->
      <user-create-modal
          v-model="create"
          :user="userCreate"
          @submit="submitCreateForm"
          @close="closeCreatedModal"
      ></user-create-modal>

      <modal @delete="deleteUser" :user="usuarioDele" ref="Modal"></modal>
      <alert v-model="changes" :tex="tex" :titu="titu" :typ="typ"></alert>
    </div>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth'
import carga from '@/components/LoadingComponent.vue'
import modal from '@/components/ModalDeleteComponent.vue'
import alert from '@/components/AlertComponent.vue'
import userEditModal from "@/components/UserEditModal.vue";
import userCreateModal from "@/components/UserCreateModal.vue";


export default {
  data() {
    return {
      list: [],
      dialog: false,
      showDelete: false,
      userEdit: {
        id: '',
        name: '',
        usuario: '',
        pass: '',
        pass1: '',
        isAdmin: false,
      },
      userCreate: {
        id: '',
        name: '',
        usuario: '',
        pass: '',
        pass1: '',
        admin: false,
      },
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
  components: { NavComponentVue, carga, modal, alert, userEditModal, userCreateModal },
  mounted() {
    this.getUsers()
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleDateString()
    },
    async getUsers() {
      try {
        this.loading = true
        const res = await auth.getUsers()
        if (res.data.success) {
          this.list = res.data.data
        }
      } catch(error) {
        console.error('Error al obtener usuarios:', error)
      } finally {
        this.loading = false
      }
    },
    openEditModal(user) {
      this.userEdit = {
        id: user.id,
        name: user.name,
        usuario: user.username,
        isAdmin: user.isAdmin,
        pass: '',
        pass1: ''
      }
      this.dialog = true
    },
    openCreateModal() {
      this.create = true
    },
    async submitEditForm(editedUser) {
      if (editedUser.pass !== editedUser.pass1) {
        this.showAlert('Contraseña Incorrecta', 'error', 'Las contraseñas no coinciden')
        return
      }

      try {
        await auth.updateUser(
            editedUser.usuario,
            editedUser.name,
            editedUser.pass,
            editedUser.isAdmin,
            editedUser.id
        )
        this.closeEditModal()
        this.showAlert('Usuario modificado', 'success', 'Usuario ha sido actualizado satisfactoriamente')
        this.getUsers()
      } catch (error) {
        this.showAlert('Error', 'error', 'No se pudo actualizar el usuario')
      }
    },
    async submitCreateForm(newUser) {
      if (!newUser.usuario || !newUser.name || !newUser.pass || !newUser.pass1) {
        this.showAlert('Campos Vacíos', 'error', 'No puede haber campos vacíos')
        return
      }

      if (newUser.pass !== newUser.pass1) {
        this.showAlert('Contraseña Incorrecta', 'error', 'Las contraseñas deben coincidir')
        return
      }

      try {
        await auth.createUser(
            newUser.usuario,
            newUser.name,
            newUser.pass,
            newUser.isAdmin // Nota: debe ser `isAdmin`, no `admin`
        )
        this.closeCreatedModal()
        this.showAlert('Usuario Creado', 'success', 'Usuario ha sido creado satisfactoriamente')
        this.getUsers()
      } catch (error) {
        this.showAlert('Error', 'error', 'No se pudo crear el usuario')
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
      this.userEdit = {
        id: '',
        name: '',
        usuario: '',
        isAdmin: false,
        pass: '',
        pass1: ''
      }
    },
    resetCreateForm() {
      this.userCreate = {
        id: '',
        name: '',
        usuario: '',
        admin: false,
        pass: '',
        pass1: ''
      }
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
    openDialog(user) {
      this.usuarioDele = user
      this.$refs.Modal.dialog = true
    },
    async deleteUser(user) {
      try {
        await auth.deleteUser(user.id)
        this.showAlert('Usuario eliminado', 'success', 'Usuario ha sido eliminado satisfactoriamente')
        this.getUsers()
      } catch (error) {
        this.showAlert('Error', 'error', 'No se pudo eliminar el usuario')
      }
    }
  }
}
</script>

<style scoped>
.users-container {
  min-height: 100vh;
  background-color: #FFF9C4;
  display: flex;
  flex-direction: column;
}

.content-wrapper {
  flex: 1;
  padding: 24px;
}

.users-card {
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

.users-table {
  width: 100%;
}

.users-table th {
  background-color: #E3F2FD;
  color: #0D47A1;
  font-weight: 600;
  padding: 12px;
}

.users-table td {
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.users-table tr:hover {
  background-color: #F5F5F5;
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  margin: 0 4px;
}

/* Responsive */
@media (max-width: 960px) {
  .content-wrapper {
    padding: 16px;
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
}
</style>