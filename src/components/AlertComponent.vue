<template>
  <v-snackbar
    :v-model="cambio"
    bottom
    right
    timeout="5000"
    :color="typ"
    border="start"
    >
    <v-alert
    
    :text="tex"
    :title="titu"
    :type="typ"
    border="start"   
  ></v-alert>
    </v-snackbar>
</template>

<script>
export default {
    data(){
        return{
            changes:false
        }
    },
    props:{
        tex:String,
        titu:String,
        typ:String,
        cambio:Boolean
    }
}
</script>

<style>

</style>