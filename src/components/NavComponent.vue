<template>
  <v-app-bar scroll-behavior="elevate" class="bg-blue-darken-4">
    <v-app-bar-nav-icon v-model="toggle" @click.stop="toggle = !toggle"></v-app-bar-nav-icon>
    <v-avatar>
      <v-img
        alt="John"
        src="../assets/logo.png"
      ></v-img>
    </v-avatar>
  <v-app-bar-title>Merida's Bodegon</v-app-bar-title>
  <v-icon icon="mdi-exit-to-app" size="x-large" class="mr-3" @click="cerrar"></v-icon>
  </v-app-bar>

  
      <v-navigation-drawer
        v-model="toggle"
        temporary
        :width="320"
        class="bg-yellow-lighten-5"
      >
        <v-list-item
        prepend-icon="mdi-account-circle"
          title="John Leider"
        ></v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav >
          <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="inicio" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-account" title="Usuarios" value="usuarios" to="/usuarios"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-account" title="Productos" value="productos" to="/producto"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-account" title="Ventas" value="ventas" to="/producto"></v-list-item>
        </v-list>
      </v-navigation-drawer>
      
    
</template>

<script>
import auth from '@/logic/auth';

export default {
    data(){
        return {
            toggle: null,
        }
    },
    methods:{
        cerrar(){
            auth.logout()
            this.$router.replace('/login')
        }
    }
}
</script>

<style>

</style>