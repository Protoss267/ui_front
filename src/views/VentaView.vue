<template>
<div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>

  <v-row >
  <v-col cols="12">
  <v-card class="my-5 mx-5">
    <v-card-title>Procesar Venta</v-card-title>
    <v-divider></v-divider>
    <v-card-text >
      <loading v-if="loadingVenta"></loading>
      
        <v-row>
          <v-col cols="6">
        <v-text-field label="Codigo" type="text" ref="codigo" v-model="codigo"
append-inner-icon="mdi-magnify"
@change="buscarProducto"
    ></v-text-field>
    </v-col>
  <v-col cols="6">
  <v-text-field label="Cantidad" type="number" ref="cantidad" :max=item.existencia v-model="cant"
    :hint="hint"
    @change="agregarProducto"
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
<v-btn rounded="xl" size="x-large" block color="indigo-darken-3" prepend-icon="mdi-plus" @click="venta" :disable="vB">Agregar Venta</v-btn>
</v-col>
      </v-row>
     </v-card-text>
  </v-card>
</v-col>
</v-row>
  <v-card class="my-5 mx-5">
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


  <v-card>
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
          Transferencia
        </th>
        <th class="text-left">
          Saldo Final
        </th>
        
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="(sold,a) in solds"
        :key="a"

      >
        <td>{{ a+1 }}</td>
        <td>{{ sold.sold.transfer }}</td>
        <td>{{ sold.sold.amount }}</td>
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
import Loading from '@/components/LoadingComponent.vue';
import Alert from '@/components/AlertComponent.vue';

export default {
    data(){
        return{
          productos:[],
          producto:{codigo:'',amount:0},
            items:[],
            solds:[],
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
            ventaT:0,
            coste:0,
            ganancia:0,
            stock:0,
            
        }
    },
    components:{NavComponentVue,Loading,Alert},
    computed:{
      importeTotal(){
        this.items.forEach(element => {
    this.total+=element.cantidad*element.precio
 });
      return this.total;
      },

      vB(){
        if(this.items.length>0)
        return false
      return true
      }
      
    },

    
    
    mounted(){
        this.listVenta();
    },
    methods:{
    async buscarProducto(){
      this.item=[]
      this.hint=''
    if(this.codigo==''){
      this.alert=true
          this.tex='Debe especificar un codigo'
          this.typ='error'
          this.titu='Algo salio mal'
          this.$nextTick(() => {
          this.$refs.codigo.focus();
          });
    }
    else{
      try{
      this.loadingProduct=true
        const resp = await auth.getOneProduct(this.codigo)
        this.loadingProduct=false
        if(resp.data.success)
        {
          this.item=resp.data.data[0]
        this.stock=this.item.stock
        this.hint='Existencia del producto: ' + this.item.stock.toString()
        this.$nextTick(() => {
        this.$refs.cantidad.focus();
        this.cant=''
        console.log(this.items);
      });
        }else
        {
          this.loadingProduct=false
          this.alert=true
          this.tex="El producto no se encuentra en el sistema"
          this.typ='error'
          this.titu='Algo salio mal'
          this.codigo=''
          this.$nextTick(() => {
          this.$refs.codigo.focus();
          });
        }
        

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
    if(this.cant=='' || this.cant > this.stock)
    {
      
      if(this.cant==''){
        this.alert=true
          this.tex='Debe especificar una cantidad'
          this.typ='error'
          this.titu='Algo salio mal'
          this.$nextTick(() => {
        this.$refs.cantidad.focus();
      });
      }
     if(this.cant > this.stock){
        this.alert=true
          this.tex='No se puede vender una cantidad mayor a la existente'
          this.typ='error'
          this.titu='Algo salio mal'
          this.$nextTick(() => {
        this.$refs.cantidad.focus();
      });
      }
     
      
    }else
    {
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
    this.hint=''
    this.$nextTick(() => {
    this.$refs.codigo.focus();
  });
}
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
  if(this.item.length==0)
  {
    this.alert=true
          this.tex='No hay productos para vender'
          this.typ='error'
          this.titu='Algo salio mal'
  }
  else{
  this.items.forEach(element => {
    this.producto={codigo:element.codigo,amount:element.cantidad}
    this.productos.push(this.producto)
 });
 try{
  this.loadingVenta=true
  const res=await auth.vender(this.productos,this.checkbox1)
  if(res.data.success){
    this.loadingVenta=false
  this.alert=true
          this.tex='La venta se ha realizado'
          this.typ='success'
          this.titu='Venta Exitosa'
          this.producto={codigo:'',amount:''}
          this.productos=[]
          this.total=0
          this.items=[]
  }else
  {
    this.alert=true
          this.tex="No hay productos para vender"
          this.typ='error'
          this.titu='Algo salio mal'
          this.loadingVenta=false
  }
  console.log(res.data.success);
  
  
        }catch(e){
          this.alert=true
          this.tex="Ha ocurrido un error"
          this.typ='error'
          this.titu='Algo salio mal'
          this.loadingVenta=false
        }
      }
},

async listVenta(){
  try{
          this.loading=true
            const res = await auth.listSold();
            if(res.data.success)
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