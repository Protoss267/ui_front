<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-card class="my-5 mx-5">
    <v-card-title>Lista de Ventas Diaria</v-card-title>
    <v-divider></v-divider>
    <v-card-text >
      <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          No
        </th>
        <th class="text-left">
          Fecha
        </th>
      
        <th class="text-left">
          Transferencia
        </th>
        <th class="text-left">
          Saldo Final
        </th>
        <th class="text-left">
          Detalles
        </th>
        
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(sold,a) in solds"
        :key="a"

      >
        <td>{{ a+1 }}</td>
        <td>{{ sold.sold.fecha }}</td>
        <td>{{ sold.sold.transfer }}</td>
        <td>{{ sold.sold.amount }}</td>
        <td>acciones</td>
      </tr>
      
      
      <tr>
        <td colspan="2">Importe Total</td>
        <td>{{ this.ventaT }}</td>
      </tr>
      <tr>
        <td >C:{{ this.coste }}</td>
        <td>G: {{ this.ganancia }}</td>
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
         
            
            ventaT:0,
            coste:0,
            ganancia:0,
            stock:0,
            
        }
    },
    components:{NavComponentVue},
    computed:{
      
    },

    
    
    mounted(){
        this.listVenta();
    },
    methods:{
async listVenta(){
  try{
          this.loading=true
            const res = await auth.listSold();
            if(res.data)
            {console.log(res.data.data);
            this.loading=false
            this.solds=res.data.data
            this.ventaT=res.data.total
            this.coste=res.data.coste
            this.ganancia=res.data.ganancia
            }
            else
            console.log('Algo salio mal en el if');
            
        }catch(error)
        {
            console.log('Algo salio mal');
        }
      },
}
}
    
</script>

<style>

</style>