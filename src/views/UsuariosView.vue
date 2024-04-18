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
    <tr><th colspan="7" class="text-center text-h6 mb-1">Listado de Usuarios</th></tr>
    <tr>
        <th class="text-center">
          No.
        </th>
        <th class="text-center">
          Nombre
        </th>
         <th class="text-center">
          Usuario
        </th>
        <th class="text-center">
          Administrador
        </th>
        <th class="text-center">
          Creado
        </th>
        <th class="text-center">
          Modificado
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
        <td class="text-center">{{ item.name }}</td>
        <td class="text-center">{{ item.username }}</td>
        <td class="text-center">{{ item.isAdmin }}</td>
        <td class="text-center">{{ item.created }}</td>
        <td class="text-center">{{ item.updated }}</td>
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
       
          Crear Usuario
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
        prepend-icon="mdi-account"
        title="Perfil de Usuario"
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
                label="Nombre*"
                required
                v-model="userEdit.name"
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
                hint="El nombre de usuario es unico"
                label="Usuario*"
                v-model="userEdit.usuario"
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
                label="Contraseña*"
                type="password"
                required
                v-model="userEdit.pass"
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
                label="Confirmar Contraseña*"
                type="password"
                required
                v-model="userEdit.pass1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
            cols="12"
            md="12"
            sm="6"
            >
            <v-checkbox
      v-model="userEdit.admin"
      label="Administrador?"
      color="primary"
    ></v-checkbox>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis " ><span class="text-red">*indica que los campos son requeridos</span></small>
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
        prepend-icon="mdi-account"
        title="Crear Usuario"
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
                label="Nombre*"
                required
                v-model="userCreate.name"
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
                hint="El nombre de usuario es unico"
                label="Usuario*"
                v-model="userCreate.usuario"
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
                label="Contraseña*"
                type="password"
                required
                v-model="userCreate.pass"
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
                label="Confirmar Contraseña*"
                type="password"
                required
                v-model="userCreate.pass1"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row>
            <v-col
            cols="12"
            md="12"
            sm="6"
            >
            <v-checkbox
      v-model="userCreate.admin"
      label="Administrador?"
      color="primary"
    ></v-checkbox>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis " ><span class="text-red">*indica que los campos son requeridos</span></small>
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
    userEdit:{
      id:'',
      name:'',
      usuario:'',
      pass:'',
      pass1:'',
      admin: false,
      
    },
    userCreate:{
      id:'',
      name:'',
      usuario:'',
      pass:'',
      pass1:'',
      admin: false,
      
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
        this.getUsers()
    },
    methods: {
       async getUsers(){
        try{
          this.loading=true
            const res = await auth.getUsers();
            if(res.data.success)
            {console.log(res.data.data);
            this.loading=false
            this.list=res.data.data
            }
            else
            console.log('Algo salio mal en el if');
            
        }catch(error)
        {
            console.log('Algo salio mal');
        }
      },

      openEditModal(user)
      {
       this.userEdit={
            id:user.id,
            name:user.name,
            usuario:user.username,
            admin:user.isAdmin,
            pass:'',
            pass1:''
       }
       this.dialog=true;
      },
      openCreateModal()
      {
       this.create=true;
      },
      async submitEditForm(){
        const res= await auth.updateUser(this.userEdit.usuario,
        this.userEdit.name,this.userEdit.pass,this.userEdit.admin,this.userEdit.id);
        console.log(res);
        this.closeEditModal()
        this.showAlert()
        this.tex='Usuario ha sido actualizado satisfactoriamente'
        this.titu='Usuario modificado'
        this.typ='success'
        this.getUsers()
        
      },
      async submitCreateForm(){
        const res= await auth.createUser(this.userCreate.usuario,
        this.userCreate.name,this.userCreate.pass,this.userCreate.admin);
        console.log(res);
        this.closeCreatedModal()
        this.showAlert()
        this.tex='Usuario ha sido Creado satisfactoriamente'
        this.titu='Usuario Creado'
        this.typ='success'
        this.getUsers()
        
      },
      closeEditModal()
      {
        this.dialog=false
        this.userEdit={
          id:'',
            name:'',
            usuario:'',
            admin:'',
            pass:'',
            pass1:''
        }    
      },
      closeCreatedModal()
      {
        this.create=false
        this.userEdit={
          id:'',
            name:'',
            usuario:'',
            admin:'',
            pass:'',
            pass1:''
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
        const respuesta = await auth.deleteUser(user.id)
        if(respuesta.status)
        console.log(respuesta);
      this.showAlert()
      this.tex='Usuario ha sido Eliminado satisfactoriamente'
        this.titu='Usuario eliminado'
        this.typ='success'
        this.getUsers()
      
        console.log('Eliminando usuario', user);
      }
    },
}
</script>

<style>

</style>