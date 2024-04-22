import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ProductosView from '../views/ProductosView.vue'
import VentaView from '@/views/VentaView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView
  },
  {
    path: '/producto',
    name: 'Productos',
    component: ProductosView
  },
  {
    path: '/venta',
    name: 'Venta',
    component: VentaView
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: function () {
      return import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
    }
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
