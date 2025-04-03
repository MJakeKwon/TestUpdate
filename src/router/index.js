import { createRouter, createWebHistory } from 'vue-router'
import MachineUpload from '@/components/MachineUploader.vue'
import QRLogin from '@/components/QRLogin.vue'
import QRgeneratePage from '@/components/QRgeneratePage.vue'

const routes = [
  { path: '/',        name: 'MachineUpload',             component: MachineUpload},
  { path: '/qr_login',        name: 'QRLogin',             component: QRLogin},
  { path: '/qr_generate',        name: 'QRgeneratePage',             component: QRgeneratePage},
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
