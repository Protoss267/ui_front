<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-card class="my-5 mx-5 ">
    <v-card-title ></v-card-title>
    
    <v-card-text >
      <v-table density="compact">
    <thead class="bg-indigo-lighten-4">
      <tr>
        <td colspan="4" class="bg-primary text-center"><h2>Listado de productos con baja existencia</h2></td>
      </tr>
      <tr>
        <th class="text-center">
          No
        </th>
        <th class="text-center">
          Codigo
        </th>
      
        <th class="text-center">
          Nombre
        </th>
        <th class="text-center">
          Existencia Actual
        </th>
        
        
      </tr>
    </thead>
    <tbody class="bg-indigo-lighten-5">
      <tr v-for="(product,i) in productos" :key="i">
      <td class="text-center">{{ i+1 }}</td>
      <td class="text-center">{{ product.codigo }}</td>
      <td class="text-center">{{ product.name }}</td>
      <td class="text-center">{{ product.stock }}</td>
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
          productos:[]
            
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
        const res = await auth.getLowStock()
        console.log(res);
        if(res.data.success)
      {
        this.productos= res.data.data
        console.log(this.productos);
      }
      
      
      }
}
}
    
</script>

<style>

</style>