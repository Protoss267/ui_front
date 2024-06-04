<template>
  <div class="pa-4 text-center">
    <v-dialog
      v-model="dialog"
      max-width="600"
      transition="dialog-top-transition"

     >
    
<div class="container ">
      <v-card
        prepend-icon="mdi-account"
        title="Perfil de Usuario"
        class="bg-yellow-lighten-5"
      >
        <v-card-text>
          <v-row dense>
            <v-col
              cols="12"
              md="12"
              sm="6"
              
            >
              <v-text-field
               color="primary"
                label="Nombre*"
                required
                v-model="user.name"
                class="bg-primary"
              ></v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col
              cols="12"
              md="12"
              sm="6"
              
            >
              <v-text-field
                color="primary"
                hint="El nombre de usuario es unico"
                label="Usuario*"
                
              ></v-text-field>
            </v-col>
            </v-row>
            <v-row>

            <v-col
              cols="12"
              md="12"
              sm="6"
            >
              <v-text-field
                color="primary" 
                label="Contraseña*"
                type="password"
                required
                
              ></v-text-field>
            </v-col>
            </v-row>
            <v-row>
            <v-col
              cols="12"
              md="12"
              sm="6"
            >
              <v-text-field
                color="primary"
                label="Confirmar Contraseña*"
                type="password"
                required
                
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
            cols="12"
            md="12"
            sm="6"
            >
            <v-checkbox
      :v-model="user.isAdmin"
      label="Administrador?"
      color="primary"
    ></v-checkbox>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis " ><span class="text-red">*indica que los campos son requeridos</span></small>
        </v-card-text>

        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cerrar"
            variant="plain"
            color="danger"
            @click="CloseDialog"
          ></v-btn>

          <v-btn
            color="primary"
            text="Guardar"
            variant="tonal"
            @click="editUsuario"
          ></v-btn>
        </v-card-actions>
      </v-card>
    </div>
    </v-dialog><!--Aqui termina el modal-->
    </div>
</template>

<script>
export default {
    data(){
        return{
            dialog:false,
            user:{
                id:'',
                name:'',
                isAdmin:false
            }
            
        }
    },
    props:{
        userEdit:{
            id:'',
            name:'',
           isAdmin: false
        },
    },
    methods:{
        editUsuario(){
            this.user={
                id:this.userEdit.id,
                name:this.userEdit.name,
                isAdmin:this.userEdit.isAdmin
            }
            this.$emit('editar',this.user)
            this.CloseDialog()
        },
        CloseDialog(){
        this.dialog=false
      }
    }
}
</script>

<style>

</style>