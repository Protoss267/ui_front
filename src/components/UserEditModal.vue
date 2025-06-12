<template>
  <v-dialog v-model="localModel" max-width="500px" persistent>
    <v-card class="edit-modal" elevation="4">
      <v-card-title class="modal-header">
        <v-icon class="mr-2">mdi-account-edit</v-icon>
        Editar Usuario
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="modal-body">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
              v-model="localUser.name"
              label="Nombre*"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="localUser.usuario"
              label="Usuario*"
              hint="El nombre de usuario es único"
              persistent-hint
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="localUser.pass"
              label="Contraseña*"
              type="password"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="localUser.pass1"
              label="Confirmar Contraseña*"
              type="password"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-checkbox
              v-model="localUser.isAdmin"
              label="¿Administrador?"
              color="primary"
              class="mb-2"
          ></v-checkbox>

          <small class="text-caption text-medium-emphasis">
            <span class="text-red">* Campos obligatorios</span>
          </small>
        </v-form>
      </v-card-text>

      <v-divider></v-divider>

      <v-card-actions class="modal-actions">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="error" @click="emitClose" class="action-btn">
          Cancelar
        </v-btn>
        <v-btn color="primary" variant="tonal" @click="handleSubmit" class="action-btn">
          Guardar
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean,
    user: Object
  },
  emits: ['update:modelValue', 'submit', 'close'],
  data() {
    return {
      localUser: { ...this.user },
      localModel: this.modelValue
    }
  },
  watch: {
    user(newUser) {
      this.localUser = { ...newUser }
    },
    modelValue(val) {
      this.localModel = val
    },
    localModel(val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.localUser)
    },
    emitClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.edit-modal {
  border-radius: 12px;
  overflow: hidden;
}

.modal-header {
  background-color: #0D47A1;
  color: white;
  padding: 16px 24px;
  font-weight: bold;
  display: flex;
  align-items: center;
}

.modal-body {
  padding: 24px;
  background-color: #FAFAFA;
}

.modal-actions {
  padding: 16px 24px;
  background-color: #F5F5F5;
}

.action-btn {
  text-transform: none;
  letter-spacing: normal;
  font-weight: 500;
}
</style>
