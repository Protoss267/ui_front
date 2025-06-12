<template>
  <v-app-bar
      scroll-behavior="elevate"
      class="app-bar"
      :elevation="2"
  >
    <!-- Botón hamburguesa izquierdo -->
    <v-app-bar-nav-icon
        @click.stop="toggle = !toggle"
        class="nav-icon"
        variant="text"
    ></v-app-bar-nav-icon>

    <!-- Logo y título -->
    <div class="brand-container">
      <v-avatar class="logo">
        <v-img
            alt="logo"
            src="../assets/logo.png"
            contain
        ></v-img>
      </v-avatar>
      <v-app-bar-title class="app-title">Merida's Bodegón</v-app-bar-title>
    </div>

    <v-spacer></v-spacer>

    <!-- Menú de usuario derecho -->
    <v-menu
        min-width="200px"
        rounded
        offset-y
    >
      <template v-slot:activator="{ props }">
        <v-btn
            v-bind="props"
            icon
            variant="text"
            class="user-menu-btn"
        >
          <v-avatar
              color="blue-darken-4"
              size="40"
          >
            <span class="text-h6 white--text"><b>{{ usuario.initials }}</b></span>
          </v-avatar>
        </v-btn>
      </template>
      <v-card class="user-menu-card">
        <v-card-text class="text-center">
          <v-avatar
              color="blue-darken-4"
              size="64"
              class="mb-2"
          >
            <span class="text-h4 white--text"><b>{{ usuario.initials }}</b></span>
          </v-avatar>
          <h3 class="mb-1">{{ usuario.name }}</h3>
          <p class="text-caption text-medium-emphasis">
            {{ usuario.username }}
          </p>
          <v-divider class="my-3"></v-divider>
          <v-btn
              variant="text"
              color="error"
              rounded
              @click="cerrar"
              class="logout-btn"
          >
            <v-icon left>mdi-logout</v-icon>
            Salir
          </v-btn>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-app-bar>

  <!-- Menú lateral rediseñado -->
  <v-navigation-drawer
      v-model="toggle"
      temporary
      :width="300"
      class="modern-drawer"
      app
  >
    <!-- Encabezado con gradiente -->
    <div class="drawer-header">
      <v-avatar class="logo">
        <v-img
            alt="logo"
            src="../assets/logo.png"
            contain
        ></v-img>
      </v-avatar>
      <h3 class="drawer-title">Menú Principal</h3>
      <p class="drawer-subtitle">Bienvenido, {{ usuario.name }}</p>
    </div>

    <v-divider class="divider"></v-divider>

    <!-- Lista de opciones mejorada -->
    <v-list class="menu-list">
      <!-- Inicio -->
      <v-list-item
          prepend-icon="mdi-home"
          title="Inicio"
          value="inicio"
          to="/"
          class="menu-item"
          active-class="active-menu-item"
      ></v-list-item>

      <!-- Usuarios (solo admin) -->
      <v-list-item
          v-if="administrador"
          prepend-icon="mdi-account-circle"
          title="Usuarios"
          value="usuarios"
          to="/usuarios"
          class="menu-item"
          active-class="active-menu-item"
      ></v-list-item>

      <!-- Productos (solo admin) -->
      <v-list-group
          v-if="administrador"
          value="Productos"
          class="menu-group"
      >
        <template v-slot:activator="{ props }">
          <v-list-item
              v-bind="props"
              prepend-icon="mdi-muffin"
              title="Productos"
              class="menu-item"
          ></v-list-item>
        </template>

        <v-list-item
            prepend-icon="mdi-playlist-edit"
            title="Listar Productos"
            to="/producto"
            class="submenu-item"
            active-class="active-submenu-item"
        ></v-list-item>

        <v-list-item
            prepend-icon="mdi-gauge-low"
            title="Baja Existencia"
            to="/bajoStock"
            class="submenu-item"
            active-class="active-submenu-item"
        ></v-list-item>
      </v-list-group>

      <!-- Ventas -->
      <v-list-item
          prepend-icon="mdi-cart"
          title="Ventas"
          value="ventas"
          to="/venta"
          class="menu-item"
          active-class="active-menu-item"
      ></v-list-item>

      <!-- Listado de Ventas (solo admin) -->
      <v-list-item
          v-if="administrador"
          prepend-icon="mdi-store"
          title="Listado de Ventas"
          value="listado"
          to="/ventaList"
          class="menu-item"
          active-class="active-menu-item"
      ></v-list-item>
    </v-list>

    <!-- Footer del menú -->
    <template v-slot:append>
      <div class="drawer-footer ">
        <v-btn
            block
            variant="text"
            color="primary"

            class="logout-btn"
        >

          Created By Protoss
        </v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
import auth from '@/logic/auth';

export default {
  data() {
    return {
      toggle: null,
      usuario: {
        initials: 'JD',
        name: 'John Doe',
        username: 'john.doe@doe.com',
        isAdmin: false
      }
    }
  },
  methods: {
    cerrar() {
      auth.logout()
      this.$router.replace('/login')
    },
    async getUser() {
      try {
        const res = await auth.getUserLogged()
        this.usuario = res.data.data[0]
      } catch(e) {
        console.error('Error al obtener usuario:', e)
      }
    }
  },
  mounted() {
    this.getUser()
  },
  computed: {
    administrador() {
      return this.usuario.isAdmin
    }
  }
}
</script>

<style scoped>
/* Barra de aplicación */
.app-bar {
  background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%) !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important;
  padding: 0 24px;
  height: 64px;
}

.nav-icon {
  color: white !important;
  margin-right: 12px;
}

.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

.logo {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255, 255, 255, 0.2);
}

.app-title {
  color: white;
  font-weight: 600;
  font-size: 1.3rem;
  white-space: nowrap;
}

/* Menú lateral moderno */
.modern-drawer {
  background: #ffffff !important;
  box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1) !important;
}

.drawer-header {
  padding: 24px 16px;
  text-align: center;
  background: linear-gradient(135deg, #0D47A1 0%, #1565C0 100%);
  color: white;
}

.drawer-header .logo {
  width: 80px;
  height: 80px;
  margin: 0 auto 12px;
  border: 3px solid rgba(255, 255, 255, 0.3);
}

.drawer-title {
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 4px;
}

.drawer-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
}

.divider {
  border-color: rgba(0, 0, 0, 0.1) !important;
  margin: 0 16px;
}

/* Lista de menú */
.menu-list {
  padding: 8px 0;
}

.menu-item {
  margin: 4px 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.menu-item:hover {
  background-color: #E3F2FD !important;
}

.menu-item :deep(.v-list-item__prepend) .v-icon {
  color: #0D47A1 !important;
}

.active-menu-item {
  background-color: #E3F2FD !important;
  color: #0D47A1 !important;
  font-weight: 600;
}

.active-menu-item :deep(.v-list-item__prepend) .v-icon {
  color: #0D47A1 !important;
}

/* Submenú */
.menu-group :deep(.v-list-group__items) {
  background-color: #F5F5F5 !important;
}

.submenu-item {
  padding-left: 56px !important;
}

.submenu-item:hover {
  background-color: #E3F2FD !important;
}

.active-submenu-item {
  background-color: #E3F2FD !important;
  color: #0D47A1 !important;
}

/* Footer del menú */
.drawer-footer {
  padding: 16px;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.logout-btn {
  text-transform: none;
  letter-spacing: normal;
}

/* Menú de usuario */
.user-menu-btn {
  margin-right: 8px;
}

.user-menu-card {
  border-radius: 12px !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

/* Responsive */
@media (max-width: 600px) {
  .app-title {
    font-size: 1.1rem;
  }

  .logo {
    width: 36px;
    height: 36px;
  }

  .modern-drawer {
    width: 280px !important;
  }
}
</style>