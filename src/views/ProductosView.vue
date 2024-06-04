<template >
    <div class="bg-yellow-lighten-4 h-screen mx-0">
  <v-row>
    <v-col>
      <NavComponentVue></NavComponentVue>
    </v-col>
  </v-row>
  <router-view/>
  
  <div class="text-center">
    <carga v-if="loading" ></carga>
  </div>
  
  <v-card class="mx-3 my-3" border>
        
  
  
  <v-table class="text-center">
    
      <thead class="bg-primary">
      <tr><th colspan="9" class="text-center text-h6 mb-1">Listado de Productos</th></tr>
      <tr>
          <th class="text-center">
            No.
          </th>
          <th class="text-center">
            Codigo
          </th>
           <th class="text-center">
            Nombre
          </th>
          <th class="text-center">
            Precio de Compra
          </th>
          <th class="text-center">
            Precio de venta
          </th>
          <th class="text-center">
            Existencias
          </th>
          <th class="text-center">
            Fecha de Entrada
          </th>
          <th class="text-center">
            Fecha de actualizacion
          </th>
          <th class="text-center">
            Acciones
          </th>
        </tr>  
      </thead>
    
      <tbody class="bg-indigo-lighten-5">
        <tr
          v-for="(item,a) in list"
          :key="a"
        >
          <td class="text-center">{{ a+1 }}</td>
          <td class="text-center">{{ item.codigo }}</td>
          <td class="text-center">{{ item.name }}</td>
          <td class="text-center">{{ item.priceI }}</td>
          <td class="text-center">{{ item.priceF }}</td>
          <td class="text-center">{{ item.stock }}</td>
          <td class="text-center">{{ item.dateIn }}</td>
          <td class="text-center">{{ item.dateUp }}</td>
          <td class="text-center">
            <button @click="openEditModal(item)" class="mr-3"><v-icon small>mdi-pencil</v-icon></button>
          
              <button @click="openDialog(item)"><v-icon small>mdi-delete</v-icon></button>
          </td>
        </tr>
      </tbody>
      
    </v-table>
    <v-btn
            class="mb-8 bg-blue-darken-4"
            color="white"
            variant="tonal"
            block
            @click="openCreateModal"
            prepend-icon="mdi-plus"
          >
         
            Crear Producto
          </v-btn>
  </v-card>
  
  
  
  <!--Aqui Empieza el modal-->
  <div class="pa-4 text-center">
  
      <v-dialog
        v-model="dialog"
        max-width="600"
        transition="dialog-top-transition"
       >
      
  <div class="container ">
        <v-card
          prepend-icon="mdi-food-fork-drink"
          title="Editar Producto"
          class="bg-yellow-lighten-5"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                md="12"
                sm="6"
                
              >
                <v-text-field
                 color="primary"
                  label="Codigo*"
                  required
                  hint="El Codigo del producto es unico"
                  v-model="productEdit.codigo"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
                
              >
                <v-text-field
                  color="primary"
                  label="Nombre*"
                  v-model="productEdit.nombre"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
  
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary" 
                  label="Precio de Coste*"
                  type="number"
                  required
                  v-model="productEdit.coste"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary"
                  label="Precio de venta*"
                  type="number"
                  required
                  v-model="productEdit.precio"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary"
                  label="Existencia*"
                  type="number"
                  required
                  v-model="productEdit.existencia"
                ></v-text-field>
              </v-col>
            </v-row>
           
  
            <small class="text-caption text-medium-emphasis " ><span class="text-red">*Indica que los campos son requeridos</span></small>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              text="Cerrar"
              variant="plain"
              color="danger"
              @click="closeEditModal()"
            ></v-btn>
  
            <v-btn
              color="primary"
              text="Guardar"
              variant="tonal"
              @click="submitEditForm"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </div>
      </v-dialog><!--Aqui termina el modal-->
  
      <!--Aqui Empieza el modal-->
  <div class="pa-4 text-center">
      <v-dialog
        v-model="create"
        max-width="600"
        transition="dialog-top-transition"
       >
      
  <div class="container ">
        <v-card
          prepend-icon="mdi-ice-pop"
          title="Crear Producto"
          class="bg-yellow-lighten-5"
        >
          <v-card-text>
            <v-row dense>
              <v-col
                cols="12"
                md="12"
                sm="6"
                
              >
                <v-text-field
                 color="primary"
                  label="Codigo*"
                  required
                  hint="El codigo es unico"
                  v-model="productCreate.codigo"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
                
              >
                <v-text-field
                  color="primary"
                  label="Nombre del producto*"
                  v-model="productCreate.name"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
  
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary" 
                  label="Precio de coste*"
                  type="number"
                  required
                  v-model="productCreate.priceI"
                ></v-text-field>
              </v-col>
              </v-row>
              <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary"
                  label="Precio de venta*"
                  type="number"
                  required
                  v-model="productCreate.priceF"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col
                cols="12"
                md="12"
                sm="6"
              >
                <v-text-field
                  color="primary"
                  label="Existencia*"
                  type="number"
                  required
                  v-model="productCreate.stock"
                ></v-text-field>
              </v-col>
            </v-row>
           
  
            <small class="text-caption text-medium-emphasis " ><span class="text-red">*Indica que los campos son requeridos</span></small>
          </v-card-text>
  
          <v-divider></v-divider>
  
          <v-card-actions>
            <v-spacer></v-spacer>
  
            <v-btn
              text="Cerrar"
              variant="plain"
              color="danger"
              @click="closeCreatedModal()"
            ></v-btn>
  
            <v-btn
              color="primary"
              text="Crear"
              variant="tonal"
              @click="submitCreateForm()"
            ></v-btn>
          </v-card-actions>
        </v-card>
      </div>
      </v-dialog><!--Aqui termina el modal--> 
  <modal @delete="deleteUser" :user="usuarioDele" ref="Modal"></modal>
  <alert v-model="changes" :tex="tex" :titu="titu" :typ="typ"></alert>
  
    </div>  
  </div>
  </div>
  </template>
  
  <script>
  import NavComponentVue from '@/components/NavComponent.vue'
  import auth from '@/logic/auth'
  import carga from '@/components/LoadingComponent.vue'
  import modal from '@/components/ModalDeleteComponent.vue'
  import alert from '@/components/AlertComponent.vue'
  
  
  export default {
      data(){
      return{
      list:[],
      dialog: false,
      showDelete:false,
      productEdit:{
        id:'',
        codigo:'',
        nombre:'',
        coste:'',
        precio:'',
        existencia: '',
        
      },
      productCreate:{
        id:'',
        codigo:'',
        name:'',
        priceI:'',
        priceF:'',
        stock: '',
        
      },
      changes:false,
      tex:'',
      titu:'',
      typ:'',
      timeoutDuration:5000,
      timerId:null,
      loading:false,
      usuarioDele:null,
      create:false
      }
     } ,
      components:{ NavComponentVue,carga,modal,alert},
      mounted()
      {
          this.getProducts()
      },
      methods: {
         async getProducts(){
          try{
            this.loading=true
              const res = await auth.getProducts();
              
              console.log(res.data.data);
              this.loading=false
              this.list=res.data.data
              
              
              //console.log('Algo salio mal en el if');
              
          }catch(error)
          {
            this.loading=false;
            this.showAlert()
          this.tex='Ha ocurrido un error obteniendo los datos'
          this.titu='Algo salio mal'
          this.typ='error'
              console.log('Algo salio mal');
          }
        },
  
        openEditModal(user)
        {
        this.productEdit={
        id:user.id,
        codigo: user.codigo,
        nombre: user.nombre,
        coste: user.coste,
        precio: user.precio,
        existencia: user.existencia,
        
      },
         this.dialog=true;
        },
        openCreateModal()
        {
         this.create=true;
        },
        async submitEditForm(){
          const res= await auth.updateProdut(this.productEdit.codigo,
          this.productEdit.nombre,this.productEdit.coste,this.productEdit.precio,
          this.productEdit.existencia,this.productEdit.id);
          console.log(res);
          this.closeEditModal()
          this.showAlert()
          this.tex='Producto ha sido actualizado satisfactoriamente'
          this.titu='Producto modificado'
          this.typ='success'
          this.getProducts()
          
        },
        async submitCreateForm(){
          const res= await auth.createProduct(
            this.productCreate.codigo,
            this.productCreate.name,
            this.productCreate.priceI,
            this.productCreate.priceF,
            this.productCreate.stock
          )
          console.log(res);
          this.closeCreatedModal()
          this.showAlert()
          this.tex='El Producto ha sido Creado satisfactoriamente'
          this.titu='Producto añadido'
          this.typ='success'
          this.getProducts()
          
        },
        closeEditModal()
        {
          this.dialog=false
          this.productEdit={
        id:'',
        codigo:'',
        nombre:'',
        coste:'',
        precio:'',
        existencia: '',
        
      }
        },
        closeCreatedModal()
        {
          this.create=false
         this.productCreate={
        id:'',
        codigo:'',
        nombre:'',
        coste:'',
        precio:'',
        existencia: '',
        
      }
        },
  
        showAlert()
        {
          this.changes=true;
          this.timerId=setTimeout(()=>{
            this.closeAlert();
          },this.timeoutDuration)
        },
        closeAlert(){
          this.changes=false
          clearTimeout(this.timerId)
        },
        openDialog(user){
          this.usuarioDele=user
          this.$refs.Modal.dialog=true
        },
        async deleteUser(user){
          const respuesta = await auth.deleteProducto(user.id)
          if(respuesta.status)
          console.log(respuesta);
        this.showAlert()
        this.tex='El Producto ha sido Eliminado satisfactoriamente'
          this.titu='Producto eliminado'
          this.typ='success'
          this.getProducts()
        
         
        }
      },
  }
  </script>
  
  <style>
  
  </style>