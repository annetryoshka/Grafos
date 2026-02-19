import { createRouter, createWebHistory } from 'vue-router'
import Inicio from '../components/Inicio.vue'
import Acerca from '../components/Acerca.vue'
import Grafos from '../components/Grafos.vue'

const routes = [
  { path: '/', name: 'Inicio', component: Inicio },
  { path: '/acerca', name: 'Acerca', component: Acerca },
  { path: '/grafos', name: 'Grafos', component: Grafos },
]


const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router

