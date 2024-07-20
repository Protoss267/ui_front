<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-card class="my-5 mx-5">
    <v-card-title>Detalles de la venta</v-card-title>
    <v-divider></v-divider>
    <v-card-text >
      <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          Fecha
        </th>
        <th class="text-left">
          Productos
        </th>
      
        <th class="text-left">
          Cantidad Vendida
        </th>
        <th class="text-left">
          Precio del Producto
        </th>
        <th class="text-left">
          Total
        </th>
        
      </tr>
    </thead>
    <tbody>
      <tr v-for="(venta,i) in ventas.items" :key="i">
      <td v-if="i == 0" :rowspan="ventas.items.length">{{ ventas.fecha }}</td> 
      <td >{{ venta.product.name }}</td>
      <td >{{ venta.amount }}</td>
      <td>{{ venta.product.priceF }}</td>  
      <td v-if="i == 0" :rowspan="ventas.items.length">{{ ventas.amount }}</td>  
    </tr>
    </tbody>
  </v-table>

    </v-card-text>
  </v-card>
  
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth';


export default {
    data(){
        return{
         ventaID: this.$route.params.id,
         ventas:[]
            
        }
    },
    components:{NavComponentVue},
    computed:{
      
    },

    
    
    mounted(){
        this.venta()
    },
    methods:{
      async venta(){
        const res = await auth.getSold(this.ventaID)
        console.log(res);
        if(res.data.success)
      {
        this.ventas= res.data.data
      }
      console.log(this.ventas.items.length);
      
      }
}
}
    
</script>

<style>

</style>