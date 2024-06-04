<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-row >
    <v-col cols="6">
      <v-card
  class="mx-2 my-2"
  title="Productos"
  >
  <v-divider></v-divider>
 
 <loading v-if="loadingProduct"></loading>
 <v-row>
  <v-col cols="6">
<v-card class="my-3 mx-3 py-3 px-3" elevation="3">
  
<v-text-field label="Codigo" type="text" ref="codigo" v-model="codigo"
append-inner-icon="mdi-magnify"
@change="buscarProducto"
    ></v-text-field>

  <v-text-field label="Cantidad" type="number" ref="cantidad" :max=item.existencia v-model="cant"
    :hint="hint"
    ></v-text-field>
    
  </v-card>
</v-col>
  
  
  <v-col cols="5">
<v-btn
  class=" my-5 mx-5"
  rounded="xl" 
  size="x-large"
  block color="indigo-darken-3"
  prepend-icon="mdi-cart-plus" 
  @click="agregarProducto">
  Agregar Productos</v-btn>
</v-col>
</v-row>
  </v-card>
    </v-col>





  <v-col cols="6">
  <v-card class="my-5 mx-5">
    <v-card-title>Procesar Venta</v-card-title>
    <v-divider></v-divider>
    <v-card-text >
      <loading v-if="loadingVenta"></loading>
      <v-row>
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
     </v-card-text>
  </v-card>
</v-col>
</v-row>
  <v-card>
    <v-card-title>Lista de Productos</v-card-title>
    <v-divider></v-divider>
    <v-card-text >
      <v-table density="compact">
    <thead>
      <tr>
        <th class="text-left">
          No
        </th>
        <th class="text-left">
          Codigo
        </th>
        <th class="text-left">
          Nombre
        </th>
        <th class="text-left">
          Cantidad
        </th>
        <th class="text-left">
          Precio
        </th>
        <th class="text-left">
          Eliminar
        </th>
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(item,a) in items"
        :key="item.name"

      >
        <td>{{ a+1 }}</td>
        <td>{{ item.codigo }}</td>
        <td>{{ item.nombre }}</td>
        <td>{{ item.cantidad }}</td>
        <td>{{ item.precio }}</td>
        <td><button @click="remove(a)" class="mr-3"><v-icon small>mdi-cart-remove</v-icon></button></td>
      </tr>
      <tr>
        <td colspan="4">Importe Total</td>
        <td>{{ importeTotal }}</td>
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
import Loading from '@/components/LoadingComponent.vue';
import Alert from '@/components/AlertComponent.vue';

export default {
    data(){
        return{
          productos:[],
          producto:{codigo:'',amount:0},
            items:[],
            carrito:{
              codigo:'',
              cantidad:0,
              nombre:'',
              precio:''
            },
            checkbox1:false,
            item:[],
            codigo:'',
            hint:'',
            cant:'',
            loadingProduct:false,
            alert:false,
            tex:'',
            typ:'',
            titu:'',
            total:0,
            loadingVenta:false,
            
        }
    },
    components:{NavComponentVue,Loading,Alert},
    computed:{
      importeTotal(){
        this.items.forEach(element => {
    this.total+=element.cantidad*element.precio
 });
      return this.total;
      }
    },
    
    mounted(){
        
    },
    methods:{
    async buscarProducto(){
    if(this.codigo==''){
      this.alert=true
          this.tex='Debe especificar un codigo'
          this.typ='error'
          this.titu='Algo salio mal'
    }
    else{
      try{
      this.loadingProduct=true
        const resp = await auth.getOneProduct(this.codigo)
        console.log(resp.data.data);
        this.loadingProduct=false
        this.item=resp.data.data[0]
        this.hint='Existencia del producto: ' + this.item.stock.toString()
        this.$nextTick(() => {
    this.$refs.cantidad.focus();
  });
       }catch(e){
          this.alert=true
          this.tex=e.toString()
          this.typ='error'
          this.titu='Algo salio mal'
          this.loadingProduct=false
        }
    }
  },
  agregarProducto(){
    if(this.cant==''){
      this.alert=true
          this.tex='Debe especificar una cantidad'
          this.typ='error'
          this.titu='Algo salio mal'
    }else
    this.carrito={
      codigo:this.codigo,
      cantidad:this.cant,
      nombre:this.item.name,
      precio:this.item.priceF
    }
    this.total=0
    this.items.push(this.carrito)
    this.carrito={
      codigo:'',
      cantidad:'',
      nombre:'',
      precio:''
    }
    this.codigo=''
    this.cant=''
    this.$nextTick(() => {
    this.$refs.codigo.focus();
  });
    
  },
  remove(item)
  {
    this.items.splice(item,1)
    this.total=0
    this.$nextTick(() => {
    this.$refs.codigo.focus();
  });
},
async venta(){
  this.items.forEach(element => {
    this.producto={codigo:element.codigo,amount:element.cantidad}
    this.productos.push(this.producto)
 });
 try{
  this.loadingVenta=true
  const res=await auth.vender(this.productos,this.checkbox1)
  console.log(res);
  this.loadingVenta=false
  this.alert=true
          this.tex='La venta se ha realizado'
          this.typ='success'
          this.titu='Venta Exitosa'
          this.producto={codigo:'',amount:''}
          this.productos=[]
          this.total=0
          this.items=[]
        }catch(e){
          this.alert=true
          this.tex=e.toString()
          this.typ='success'
          this.titu='Algo salio mal'
          this.loadingVenta=false
        }
}
},
    }
</script>

<style>

</style>