<template>
  <div class="login-container">
    <v-card class="login-card" elevation="12" rounded="xl">
      <div class="login-header">
        <v-img
            class="logo"
            max-width="180"
            src="../assets/logotipo.png"
        ></v-img>
        <h1 class="welcome-text">Bienvenido</h1>
        <p class="subtitle">Ingresa tus credenciales para continuar</p>
      </div>

      <v-form @submit.prevent="validar" class="login-form">
        <v-text-field
            v-model="user"
            density="comfortable"
            placeholder="Usuario"
            prepend-inner-icon="mdi-account-outline"
            variant="outlined"
            color="blue-darken-4"
            bg-color="yellow-lighten-5"
            :rules="[required]"
            hide-details="auto"
        ></v-text-field>

        <v-text-field
            v-model="pass"
            :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
            :type="visible ? 'text' : 'password'"
            density="comfortable"
            placeholder="Contraseña"
            prepend-inner-icon="mdi-lock-outline"
            variant="outlined"
            color="blue-darken-4"
            bg-color="yellow-lighten-5"
            :rules="[required]"
            hide-details="auto"
            @click:append-inner="visible = !visible"
            class="mt-4"
        ></v-text-field>

        <v-btn
            type="submit"
            class="login-btn mt-6"
            size="large"
            block
            :loading="Loading"
        >
          Iniciar sesión
          <template v-slot:loader>
            <v-progress-circular
                indeterminate
                color="white"
                size="24"
            ></v-progress-circular>
          </template>
        </v-btn>
      </v-form>

<!--      <div class="additional-actions">-->
<!--        <v-btn variant="text" color="blue-darken-4" size="small">-->
<!--          ¿Olvidaste tu contraseña?-->
<!--        </v-btn>-->
<!--      </div>-->

      <alert
          v-model="changes"
          :tex="tex"
          :titu="titu"
          :typ="typ"
          class="mt-4"
      ></alert>
    </v-card>
  </div>
</template>

<script>
// import carga from '@/components/LoadingComponent.vue';
import auth from '../logic/auth'
import alert from '@/components/AlertComponent.vue'

export default {
  components: {  alert },
  data() {
    return {
      visible: false,
      pass: '',
      user: '',
      changes: false,
      titu: '',
      typ: '',
      tex: '',
      Loading: false,
      timeoutDuration: 5000,
      timerId: null,
    }
  },
  methods: {
    required(value) {
      return !!value || 'Campo requerido'
    },
    async autenticar() {
      this.changes = false
      this.Loading = true

      try {
        const respuesta = await auth.login(this.user, this.pass);
        if (respuesta.status) {
          localStorage.setItem('jwtToken', respuesta.data.token)
          this.showAlert('Hecho', 'success', 'Inicio de sesión correcto!')
          this.$router.push('/')
        }
      } catch (e) {
        this.showAlert('Error', 'error', 'Credenciales incorrectas')
      } finally {
        this.Loading = false
      }
    },
    validar() {
      if (!this.user || !this.pass) {
        this.showAlert('Error', 'error', 'Todos los campos son requeridos')
      } else {
        this.autenticar()
      }
    },
    showAlert(titu, typ, tex) {
      this.titu = titu
      this.typ = typ
      this.tex = tex
      this.changes = true
      clearTimeout(this.timerId)
      this.timerId = setTimeout(this.closeAlert, this.timeoutDuration)
    },
    closeAlert() {
      this.changes = false
      clearTimeout(this.timerId)
    }
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #FFEB3B 0%, #FFF9C4 100%);
  padding: 24px;
}

.login-card {
  width: 100%;
  max-width: 480px;
  padding: 40px 32px;
  border-radius: 16px !important;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
}

.login-header {
  text-align: center;
  margin-bottom: 32px;
}

.logo {
  margin: 0 auto 16px;
}

.welcome-text {
  color: #0D47A1;
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 8px;
}

.subtitle {
  color: #616161;
  font-size: 14px;
}

.login-form {
  margin-top: 24px;
}

.login-btn {
  background: linear-gradient(90deg, #1565C0 0%, #0D47A1 100%) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.2);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 71, 161, 0.3);
}

.additional-actions {
  display: flex;
  justify-content: center;
  margin-top: 16px;
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