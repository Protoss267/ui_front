<template>
    <div class="bg-yellow-lighten-3 h-screen my-0">
      <v-card
        class="mx-auto pa-12 pb-8 my-0 center justify-center"
        elevation="8"
        max-width="448"
        rounded="lg"
      >
      <v-img
        class="mx-auto"
        max-width="150"
        src="../assets/logotipo.png"
      ></v-img>
        <div class="text-subtitle-1 text-medium-emphasis text-blue-darken-4">Usuario</div>
  
        <v-text-field
          density="compact"
          placeholder="Usuario"
          prepend-inner-icon="mdi-account-outline"
          variant="outlined"
          class="text-blue-darken-4"
          v-model="user"
        ></v-text-field>
  
        <div class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between text-blue-darken-4">
          Contraseña
        </div>
  
        <v-text-field
          :append-inner-icon="visible ? 'mdi-eye-off' : 'mdi-eye'"
          :type="visible ? 'text' : 'password'"
          density="compact"
          placeholder="Ingrese la contraseña"
          prepend-inner-icon="mdi-lock-outline"
          variant="outlined"
          @click:append-inner="visible = !visible"
          class="text-blue-darken-4"
          v-model="pass"
        ></v-text-field>  
        <v-btn
          class="mb-8 bg-blue-darken-4"
          color="white"
          size="large"
          variant="tonal"
          block
          @click="validar"
        >
          Iniciar
        </v-btn>
        <div class="text-center"> <carga v-if="Loading"></carga></div>
        <alert v-model="changes" :tex="tex" :titu="titu" :typ="typ"></alert>
      </v-card>
    </div>
  </template>

<script>
import carga from '@/components/LoadingComponent.vue';
import auth from '../logic/auth'
import alert from '@/components/AlertComponent.vue'

export default {
  components:{carga,alert},
    data(){
        return{
            visible:false,
            pass:'',
            user:'',
            resul:[],
            changes:false,
            titu:'',
            typ:'',
            tex:'',
            Loading:false,
            timeoutDuration:5000,
            timerId:null,       
        }
    },
    methods:{
       async autenticar()
        {
            this.changes=false
            this.Loading=true
          
            try{
                const respuesta = await auth.login(this.user,this.pass);
                    if(respuesta.status)
                    this.Loading=false
                    localStorage.setItem('jwtToken',respuesta.data.token)
                    console.log(respuesta.data.token);
                    this.showAlert()
                   
                    this.titu='Hecho'
                    this.typ='success'
                    this.tex='Inicio de sesion correcto!!'
                    this.$router.push('/')

            }catch(e){console.log(e);
              this.showAlert()
                
                        this.titu='Algo salio mal'
                        this.typ='error'
                        this.tex='Inicio de sesion incorrecto!!'
                        this.Loading=false
                    }
                   },
                   validar()
        {
            this.changes=false
            if(this.user=='' || this.pass=='')
            {
              this.showAlert()
                this.tex='No pueden haber campos vacios'
                this.typ='error'
                this.titu='Algo salio mal'
                this.Loading=false
                
            }else
            {this.autenticar()}
            
        },  
        showAlert()
      {
        this.changes=true;
        this.timerId=setTimeout(()=>{
          this.closeAlert();
        },this.timeoutDuration)
      },
      closeAlert(){
        this.alert=false
        clearTimeout(this.timerId)
      },      
       
    },
    
    
}
</script>

<style scoped>


</style>