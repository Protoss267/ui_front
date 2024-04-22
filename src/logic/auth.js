import axios from 'axios'
import { jwtDecode } from "jwt-decode";

const ENDPOINT_PATH = 'https://127.0.0.1:8000/api/'

export default{
  data() {
    return {
      
    }
  },
    login(username, password) {
        const user = { username, password }
        return axios.post(ENDPOINT_PATH + 'login', user)
      },
      logout()
      {
        localStorage.removeItem('jwtToken')
      },
      getUsers(){
        return axios.get(ENDPOINT_PATH + 'admin/userList')
      },
      updateUser(username,name,password,isAdmin,id){
        const usuarioU={username,name,password,isAdmin}
        return axios.put(ENDPOINT_PATH + 'admin/userUpdate/'+ id,usuarioU)
      },
      deleteUser(id)
      {
        return axios.delete(ENDPOINT_PATH + 'admin/userDelete/' + id)
      },
      createUser(username,name,password,isAdmin){
        const usuarioC={username,name,password,isAdmin}
        return axios.post(ENDPOINT_PATH + 'admin/userCreate',usuarioC)
      },
      getUserLogged(){
        return jwtDecode(localStorage.getItem('jwtToken')).username;
      },
      getProducts(){
        return axios.get(ENDPOINT_PATH + 'producto/list')
      },
      updateProdut(codigo,nombre,precioI,precioF,total,id){
        const productoU={
          codigo,
          nombre,
          precioI,
          precioF,
          total
        }
        return axios.put(ENDPOINT_PATH + 'producto/edit/' + id,productoU)
      },
      createProduct(codigo,nombre,precioI,precioF,total){
        const productoC={
          codigo,
          nombre,
          precioI,
          precioF,
          total
        }
        return axios.post(ENDPOINT_PATH + 'producto/create',productoC)
      },
      deleteProducto(id){
        return axios.delete(ENDPOINT_PATH + 'producto/delete/' + id)
      },
      getProductos()
      {
        return axios.get(ENDPOINT_PATH + 'producto/list');
      },
}