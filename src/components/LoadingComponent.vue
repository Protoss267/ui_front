<template>
  
  <v-progress-circular
    color="primary"
    indeterminate
    v-model="loading"
  ></v-progress-circular>
  
</template>

<script>
export default {
    data()
    {
        return{
            loading:false
        }
    },
props:{
    carga:Boolean,
}
}
</script>

<style>

</style>