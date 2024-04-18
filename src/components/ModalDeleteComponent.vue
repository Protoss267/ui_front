<template>
  <v-dialog
      v-model="dialog"
      max-width="600"
      transition="dialog-top-transition"
     >
     <v-card
        prepend-icon="mdi-delete"
        title="Confirmar Eliminacion"
        class="bg-yellow-lighten-5"
      >
      <v-card-title class="headline"></v-card-title>
    <v-card-text>
      Seguro que desea eliminar al usuario?
    </v-card-text>

    <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn
            text="Cerrar"
            variant="plain"
            color="blue darken-1"
            @click="CloseDialog"
          ></v-btn>

          <v-btn
            color="red darken-1"
            text="Eliminar"
            variant="tonal"
            @click="deleteUser"
          ></v-btn>
        </v-card-actions>
    </v-card>
    </v-dialog>
</template>

<script>
export default {
    data(){
        return{
          dialog:false
    }
        
    },
    props:{
      user:Object
    },
    methods:{
      deleteUser(){
        this.$emit('delete',this.user)
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