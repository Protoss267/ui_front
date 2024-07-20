import { createRouter, createWebHistory } from 'vue-router'
import guard from './guard'
import HomeView from '../views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import ProductosView from '../views/ProductosView.vue'
import VentaView from '@/views/VentaView.vue'
import VentaDetallesView from '@/views/VentaDetallesView.vue'
import VentaDetalle from '@/views/VentaDetalle.vue'
import BajoStockView from '@/views/BajoStockView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: {requiresAuth : true}
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  },
  {
    path: '/usuarios',
    name: 'Usuarios',
    component: UsuariosView,
    meta: {requiresAuth : true}
  },
  {
    path: '/producto',
    name: 'Productos',
    component: ProductosView,
    meta: {requiresAuth : true}
  },
  {
    path: '/venta',
    name: 'Venta',
    component: VentaView,
    meta: {requiresAuth : true}
  },
  {
    path: '/ventaList',
    name: 'VentaList',
    component: VentaDetallesView,
    meta: {requiresAuth : true}
  },
  {
    path: '/ventaDetalle/:id',
    name: 'VentaDetalle',
    component: VentaDetalle,
    meta: {requiresAuth : true}
  },
  {
    path: '/bajoStock',
    name: 'bajoStock',
    component: BajoStockView,
    meta: {requiresAuth : true}
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
});

router.beforeEach(guard);

export default router
