<template>
  <v-dialog v-model="localModel" max-width="500px" persistent>
    <v-card class="create-modal" elevation="4">
      <v-card-title class="modal-header">
        <v-icon class="mr-2">mdi-account-plus</v-icon>
        Crear Usuario
      </v-card-title>

      <v-divider></v-divider>

      <v-card-text class="modal-body">
        <v-form @submit.prevent="handleSubmit">
          <v-text-field
              v-model="formData.name"
              label="Nombre*"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="formData.usuario"
              label="Usuario*"
              hint="Debe ser único"
              persistent-hint
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="formData.pass"
              label="Contraseña*"
              type="password"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-text-field
              v-model="formData.pass1"
              label="Confirmar Contraseña*"
              type="password"
              required
              color="primary"
              class="mb-4"
              density="comfortable"
          ></v-text-field>

          <v-checkbox
              v-model="formData.isAdmin"
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
          Crear
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    modelValue: Boolean
  },
  emits: ['update:modelValue', 'submit', 'close'],
  data() {
    return {
      formData: {
        name: '',
        usuario: '',
        pass: '',
        pass1: '',
        isAdmin: false
      },
      localModel: this.modelValue
    }
  },
  watch: {
    modelValue(val) {
      this.localModel = val
    },
    localModel(val) {
      this.$emit('update:modelValue', val)
    }
  },
  methods: {
    handleSubmit() {
      this.$emit('submit', this.formData)
    },
    emitClose() {
      this.$emit('close')
    }
  }
}
</script>

<style scoped>
.create-modal {
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
