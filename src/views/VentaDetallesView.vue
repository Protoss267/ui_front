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
    <v-row>
      <v-col cols="4">
    <v-container
    fluid
    class="mx-5 my-5 px-0 py-0"
  >
    <v-row justify="center">
      <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
         <v-text-field v-bind="props" outlined label="Seleccione la fecha Inicial" v-model="dateI"></v-text-field>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center pb-2">
              <v-date-picker
        color="primary"
        elevation="24"
        :max="fechaActual"
        v-model="dateI"
      ></v-date-picker>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
    
    </v-row>
  </v-container>
</v-col>
<v-col cols="4">
    <v-container
    fluid
    class="mx-5 my-5 px-5 py-0"
  >
    <v-row justify="center">
      <v-menu
        min-width="200px"
        rounded
      >
        <template v-slot:activator="{ props }">
         <v-text-field v-bind="props" outlined label="Seleccione la fecha final" v-model="dateF"></v-text-field>
        </template>
        <v-card>
          <v-card-text>
            <div class="mx-auto text-center pb-2">
              <v-date-picker
        color="primary"
        elevation="24"
        :max="fechaActual"
        v-model="dateF"
      ></v-date-picker>
            </div>
          </v-card-text>
        </v-card>
      </v-menu>
      
    </v-row>
  </v-container>
</v-col>
<v-col cols="4">
<v-btn prepend-icon="mdi-magnify" class="mx-5 my-5 px-5 py-0" color="primary" @click="listVenta">
  Mostrar
</v-btn>

</v-col>
</v-row>

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
        :key="sold.id"
        
      >
        <td>{{ a+1 }}</td>
        <td>{{ sold.sold.fecha }}</td>
        <td>{{ sold.sold.transfer }}</td>
        <td>{{ sold.sold.amount }}</td>
        <td><router-link :to="{name: 'VentaDetalle', params: {id: sold.sold.id}}"><v-icon small>mdi-eye-outline</v-icon></router-link></td>
      </tr>
      
      
      <tr>
        <td colspan="2">Importe Total</td>
        <td>{{ this.ventaT }}</td>
      </tr>
      <tr>
        <td >Costo:{{ this.coste }}</td>
        <td>Ganancia: {{ this.ganancia }}</td>
      </tr>
    </tbody>
  </v-table>

    </v-card-text>
  </v-card>
  <alert v-model="alert" :tex="tex" :titu="titu" :typ="typ"></alert>
  
  </div>
</template>

<script>
import NavComponentVue from '@/components/NavComponent.vue'
import auth from '@/logic/auth';
import Alert from '@/components/AlertComponent.vue';


export default {
    data(){
        return{
         
            dateI:null,
            dateF:null,
            fechaFFormateada:'',
            fechaIFormateada:'',
            fechaActual: this.obtenerFechaActual(),
            ventaT:0,
            coste:0,
            ganancia:0,
            stock:0,
            alert:false,
            tex:'',
            typ:'',
            titu:'',
            
        }
    },
    components:{NavComponentVue,Alert},
    computed:{
     
    },

    
    
    mounted(){
        
    },
    methods:{
      Detalle(id){
        this.$router.push("/ventaDetalle/" + id)
      },

      obtenerFechaActual(){
        const hoy = new Date();
        const year = hoy.getFullYear();
        const mes = ('0'+ (hoy.getMonth()+1)).slice(-2);
        const dia = ('0'+ hoy.getDate()).slice(-2);
        return year+'-'+mes+'-'+dia;
      },
  
async listVenta(){
  if(this.dateI==null || this.dateF==null){
    this.alert=true
          this.tex='Los campos no pueden estar vacios'
          this.typ='error'
          this.titu='Algo salio mal'
          
  }
  else{
  try{
          this.loading=true
            const res = await auth.getSoldsByRange(this.dateI,this.dateF);
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
      }
      },
}
}
    
</script>

<style>

</style>