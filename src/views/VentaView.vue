<template>
  <div class="sales-container">
    <NavComponentVue></NavComponentVue>
    <router-view/>

    <div class="sales-content">
      <v-card class="sales-card" elevation="12" rounded="xl">
        <v-card-title class="sales-title">Procesar Venta</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <loading v-if="loadingVenta"></loading>

          <v-row>
            <v-col cols="6">
              <v-text-field
                  label="Codigo"
                  type="text"
                  ref="codigo"
                  v-model="codigo"
                  append-inner-icon="mdi-magnify"
                  @change="buscarProducto"
                  variant="outlined"
                  color="blue-darken-4"
                  bg-color="yellow-lighten-5"
              ></v-text-field>
            </v-col>
            <v-col cols="6">
              <v-text-field
                  label="Cantidad"
                  type="number"
                  ref="cantidad"
                  :max=item.existencia
                  v-model="cant"
                  :hint="hint"
                  @change="agregarProducto"
                  variant="outlined"
                  color="blue-darken-4"
                  bg-color="yellow-lighten-5"
              ></v-text-field>
            </v-col>

            <v-col cols="4">
              <v-checkbox
                  v-model="checkbox1"
                  label="Transferencia"
                  color="blue-darken-4"
              ></v-checkbox>
            </v-col>
            <v-col cols="8">
              <v-btn
                  rounded="xl"
                  size="large"
                  block
                  color="blue-darken-4"
                  prepend-icon="mdi-plus"
                  @click="venta"
                  :disabled="vB"
                  class="action-btn"
              >
                Agregar Venta
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-card class="sales-card mt-4" elevation="12" rounded="xl">
        <v-card-title class="sales-title">Lista de Productos</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table density="comfortable">
            <thead>
            <tr>
              <th class="text-left">No</th>
              <th class="text-left">Codigo</th>
              <th class="text-left">Nombre</th>
              <th class="text-left">Cantidad</th>
              <th class="text-left">Precio</th>
              <th class="text-left">Eliminar</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item,a) in items" :key="item.name">
              <td>{{ a+1 }}</td>
              <td>{{ item.codigo }}</td>
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
              <td>{{ item.precio }}</td>
              <td>
                <v-btn
                    @click="remove(a)"
                    icon
                    variant="text"
                    color="red-darken-2"
                    size="small"
                >
                  <v-icon>mdi-cart-remove</v-icon>
                </v-btn>
              </td>
            </tr>
            <tr>
              <td colspan="4" class="font-weight-bold">Importe Total</td>
              <td class="font-weight-bold">{{ importeTotal }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>

      <v-card class="sales-card mt-4" elevation="12" rounded="xl">
        <v-card-title class="sales-title">Lista de Ventas Diaria</v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-table density="comfortable">
            <thead>
            <tr>
              <th class="text-left">No</th>
              <th class="text-left">Transferencia</th>
              <th class="text-left">Saldo Final</th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(sold,a) in solds" :key="a">
              <td>{{ a+1 }}</td>
              <td>{{ sold.sold.transfer }}</td>
              <td>{{ sold.sold.amount }}</td>
            </tr>
            </tbody>
          </v-table>
        </v-card-text>
      </v-card>
    </div>

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
        this.total += element.cantidad * element.precio
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
          if(resp.data.success) {
            this.item=resp.data.data[0]
            this.stock=this.item.stock
            this.hint='Existencia del producto: ' + this.item.stock.toString()
            this.$nextTick(() => {
              this.$refs.cantidad.focus();
              this.cant=''
            });
          } else {
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
        } catch(e) {
          this.alert=true
          this.tex=e.toString()
          this.typ='error'
          this.titu='Algo salio mal'
          this.loadingProduct=false
        }
      }
    },
    agregarProducto(){
      if(this.cant=='' || this.cant > this.stock) {
        if(this.cant=='') {
          this.alert=true
          this.tex='Debe especificar una cantidad'
          this.typ='error'
          this.titu='Algo salio mal'
          this.$nextTick(() => {
            this.$refs.cantidad.focus();
          });
        }
        if(this.cant > this.stock) {
          this.alert=true
          this.tex='No se puede vender una cantidad mayor a la existente'
          this.typ='error'
          this.titu='Algo salio mal'
          this.$nextTick(() => {
            this.$refs.cantidad.focus();
          });
        }
      } else {
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
    remove(item) {
      this.items.splice(item,1)
      this.total=0
      this.$nextTick(() => {
        this.$refs.codigo.focus();
      });
    },
    async venta(){
      if(this.item.length==0) {
        this.alert=true
        this.tex='No hay productos para vender'
        this.typ='error'
        this.titu='Algo salio mal'
      } else {
        this.items.forEach(element => {
          this.producto={codigo:element.codigo,amount:element.cantidad}
          this.productos.push(this.producto)
        });
        try {
          this.loadingVenta=true
          const res=await auth.vender(this.productos,this.checkbox1)
          if(res.data.success){
            this.listVenta()
            this.loadingVenta=false
            this.alert=true
            this.tex='La venta se ha realizado'
            this.typ='success'
            this.titu='Venta Exitosa'
            this.producto={codigo:'',amount:''}
            this.productos=[]
            this.total=0
            this.items=[]
          } else {
            this.alert=true
            this.tex="No hay productos para vender"
            this.typ='error'
            this.titu='Algo salio mal'
            this.loadingVenta=false
          }
        } catch(e) {
          this.alert=true
          this.tex="Ha ocurrido un error"
          this.typ='error'
          this.titu='Algo salio mal'
          this.loadingVenta=false
        }
      }
    },
    async listVenta(){
      try {
        this.loading=true
        const res = await auth.listSold();
        if(res.data.success) {
          this.loading=false
          this.solds=res.data.data
          this.ventaT=res.data.total
          this.coste=res.data.coste
          this.ganancia=res.data.ganancia
        }
      } catch(error) {
        console.log('Algo salio mal');
      }
    },
  }
}
</script>

<style scoped>
.sales-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #fff47d 0%, #FFF9C4 100%);
  padding: 24px;
}

.sales-content {
  max-width: 1200px;
  margin: 0 auto;
}

.sales-card {
  width: 100%;
  padding: 24px;
  border-radius: 16px !important;
  background-color: white;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1) !important;
  margin-bottom: 24px;
}

.sales-title {
  color: #0D47A1;
  font-weight: 600;
  padding-bottom: 12px;
}

.action-btn {
  background: linear-gradient(90deg, #1565C0 0%, #0D47A1 100%) !important;
  color: white !important;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 48px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(13, 71, 161, 0.2);
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(13, 71, 161, 0.3);
}

:deep(.v-field__outline) {
  color: #BBDEFB !important;
}

:deep(.v-field--variant-outlined .v-field__outline__start) {
  border-radius: 8px 0 0 8px !important;
}

:deep(.v-field--variant-outlined .v-field__outline__end) {
  border-radius: 0 8px 8px 0 !important;
}

.v-table {
  background-color: transparent !important;
}

.v-table th {
  font-weight: 600;
  color: #0D47A1 !important;
}

.v-table tr:hover {
  background-color: #E3F2FD !important;
}
</style>