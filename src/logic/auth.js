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
        return axios.post(ENDPOINT_PATH + 'login_check', user)
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
        const username= jwtDecode(localStorage.getItem('jwtToken')).username;
        return axios.get(ENDPOINT_PATH + 'admin/userByUsername/' + username)
        
      },
      getProducts(){
        return axios.get(ENDPOINT_PATH + 'product/list')
      },
      updateProdut(codigo,name,priceI,priceF,stock,id){
        const productoU={
          codigo,
          name,
          priceI,
          priceF,
          stock
        }
        return axios.put(ENDPOINT_PATH + 'product/update/' + id,productoU)
      },
      createProduct(codigo,name,priceI,priceF,stock){
        const productoC={
          codigo,
          name,
          priceI,
          priceF,
          stock
        }
        return axios.post(ENDPOINT_PATH + 'product/create',productoC)
      },
      deleteProducto(id){
        return axios.delete(ENDPOINT_PATH + 'product/delete/' + id)
      },
      getProductos()
      {
        return axios.get(ENDPOINT_PATH + 'producto/list');
      },
      getOneProduct(codigo){
        return axios.get(ENDPOINT_PATH + 'product/get/' + codigo)
      },
      vender(products,transfer){
        const ven={products,transfer}
        return axios.post(ENDPOINT_PATH + 'sold/create',ven)
      },
      listSold(){
        return axios.get(ENDPOINT_PATH + 'sold/listDay')
      },
      getSold(id)
      {
        return axios.get(ENDPOINT_PATH + 'sold/'+id)
      },
      getLowStock()
      {
        return axios.get(ENDPOINT_PATH + 'product/lowStock')
      },
      getSoldsByRange(fechaI,fechaF){
        return axios.post(ENDPOINT_PATH+'sold',{fechaI,fechaF})
      }
}