<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-card
  class="mx-2 my-2"
  title="Ventas"
  >
  <v-divider></v-divider>
 <!-- <v-row>
<v-col
cols="6"
>
  <v-select 
  :item-props="itemProps" 
  :items="productos" 
  label="Productos"
  v-model="item"
  ></v-select>
</v-col>
</v-row>-->
<v-row>
<v-col
cols="6"

>
<v-text-field label="Codigo" type="text"  v-model="codigo"
    hint=""
    ></v-text-field>
</v-col>
<v-col
cols="4"
>
<v-btn rounded="xl" size="x-large" block color="indigo-darken-3" prepend-icon="mdi-plus" @click="agregar">Agregar</v-btn>
</v-col>
</v-row>
<v-row>
    <v-col
    cols="4"
    >
    <v-text-field label="Cantidad" type="number" v-model="cant"
    hint=""
    ></v-text-field>
  </v-col>
  <v-col
  cols="4"
  >
  <v-checkbox
      v-model="checkbox1"
      label="Transferencia"
    ></v-checkbox>
</v-col>
<v-col
cols="4"
>
<v-btn rounded="xl" size="x-large" block color="indigo-darken-3" prepend-icon="mdi-plus" @click="venta">Agregar Venta</v-btn>
</v-col>
  </v-row>
    
  </v-card>
  <v-card>

  </v-card>
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth';

export default {
    data(){
        return{
            productos:[],
            item:'',
            codigo:'',
            
        }
    },
    components:{NavComponentVue},
    mounted(){
        this.list()
    },
    methods:{
   async list(){
      const res = await auth.getProductos();
      this.productos=res.data;
      console.log(res.data);
    },
    itemProps (item) {
        return {
          title: item.codigo,
          subtitle: item.nombre,
        }
  },
}
}
</script>

<style>

</style>