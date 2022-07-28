import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import { Button, Form, FormItem, Input, Select } from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';

const app = createApp(App)
axios.defaults.baseURL = 'http://106.52.84.103:8888/api/private/v1/'
axios.interceptors.response.use(config => {
  return config.data
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  if (window.sessionStorage.token) return next()
  next('/login')
})
app.config.globalProperties.$http = axios
app.use(store)
  .use(router)
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Select)
  .mount('#app')
