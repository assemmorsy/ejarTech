import { createRouter, createWebHistory } from 'vue-router'
import { projectAuth } from '@/firebase/config'
import Login from "@/views/Login.vue"
import TakeSurvey from "@/views/TakeSurvey.vue"
import Voters from "@/views/Voters.vue"

// path guards
const alreadyAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (user) {
    next({ name: "voters" })
  } else {

    next()
  }
}
const needAuth = (to, from, next) => {
  let user = projectAuth.currentUser
  if (!user) {
    next({ name: "login" })
  } else {

    next()
  }
}


const routes = [
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: alreadyAuth
  },
  {
    path: "/",
    name: "takeSurvey",
    component: TakeSurvey
  },
  {
    path: "/voters",
    name: "voters",
    component: Voters,
    beforeEnter: needAuth
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
