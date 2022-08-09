import { createRouter, createWebHashHistory } from 'vue-router'
import nProgress from 'nprogress';
const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'Login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
  },
  {
    path: '/home',
    name: 'Home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "login" */ '../views/Home.vue'),
    children: [
      { path: '/', component: () => import('../components/Welcome.vue') },
      { path: 'users', component: () => import('../components/Users.vue') },
      { path: 'roles', component: () => import('../components/Roles.vue') },
      { path: 'rights', component: () => import('../components/Rights.vue') },
      { path: 'reports', component: () => import('../components/Reports.vue') },
      { path: 'params', component: () => import('../components/Params.vue') },
      { path: 'orders', component: () => import('../components/Orders.vue') },
      { path: 'goods', component: () => import('../components/Goods.vue') },
      { path: 'categories', component: () => import('../components/Categories.vue') }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  nProgress.start()
  if (to.path === '/login') return next()
  if (window.sessionStorage.token) return next()
  next('/login')
})
router.afterEach((to) => {
  nProgress.done()
})
export default router
