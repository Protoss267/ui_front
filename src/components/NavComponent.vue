<template>
  <v-app-bar scroll-behavior="elevate" class="bg-blue-darken-4">
    <v-app-bar-nav-icon v-model="toggle" @click.stop="toggle = !toggle"></v-app-bar-nav-icon>
    <v-avatar>
      <v-img
        alt="logo"
        src="../assets/logo.png"
      ></v-img>
    </v-avatar>
  <v-app-bar-title>Merida's Bodegon</v-app-bar-title>
  <v-icon size="x-large" class="mr-4">
    <v-container
    fluid
    class="mx-0 my-0 px-0 py-0"
  >
    <v-row justify="center">
      <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
          <v-btn
            icon
            v-bind="props"
          >
            <v-avatar
            color="brown"
              size="large"
            >
              <span class="text-h5">{{ user.initials }}</span>
            </v-avatar>
          </v-btn>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center">
              <v-avatar
                color="brown"
              >
                <span class="text-h5"><b>{{ user.initials }}</b></span>
              </v-avatar>
              <h3>{{ User }}</h3>
              <p class="text-caption mt-1">
                {{ user.email }}
              </p>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
              >
                Edit Account
              </v-btn>
              <v-divider class="my-3"></v-divider>
              <v-btn
                variant="text"
                rounded
                @click="cerrar"
              >
                Disconnect
              </v-btn>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    </v-row>
  </v-container></v-icon>
  

  </v-app-bar>
 
  
  
      <v-navigation-drawer
        v-model="toggle"
        temporary
        :width="320"
        class="bg-yellow-lighten-5"
      >
        <v-list-item
        prepend-icon="mdi-account-circle"
          
        >
        {{ User }}
      </v-list-item>

        <v-divider></v-divider>

        <v-list density="compact" nav >
          <v-list-item prepend-icon="mdi-view-dashboard" title="Inicio" value="inicio" to="/"></v-list-item>
          <v-list-item prepend-icon="mdi-clipboard-account" title="Usuarios" value="usuarios" to="/usuarios"></v-list-item>
          <v-list-item prepend-icon="mdi-muffin" title="Productos" value="productos" to="/producto"></v-list-item>
          <v-list-item prepend-icon="mdi-cart" title="Ventas" value="ventas" to="/venta"></v-list-item>
        </v-list>
      </v-navigation-drawer>

      
  

      
    
</template>

<script>
import auth from '@/logic/auth';
//import Profile from '@/components/UserProfileComponent.vue'

export default {
  components:{},
    data(){
        return {
            toggle: null,
            dialog:false,
            user: {
        initials: 'JD',
        fullName: 'John Doe',
        email: 'john.doe@doe.com',
      },
            
        }
    },
    methods:{
        cerrar(){
            auth.logout()
            this.$router.replace('/login')
        },

    },
    computed:{
      User(){
        return auth.getUserLogged();
      }
        
    }
}
</script>

<style>

</style>