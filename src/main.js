import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/css/base.css'
import {
  Button,
  Form,
  FormItem,
  Input,
  Select,
  Menu,
  Layout,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  Switch,
  Pagination,
  ConfigProvider,
  Drawer,
  Row,
  Col
} from 'ant-design-vue'
import 'ant-design-vue/dist/antd.css';
import axios from 'axios';

const app = createApp(App)
axios.defaults.baseURL = 'http://106.52.84.103:8888/api/private/v1/'
axios.interceptors.response.use(res => {
  return res.data
})
axios.interceptors.request.use(config => {
  config.headers.Authorization = window.sessionStorage.token
  return config
})

app.config.globalProperties.$http = axios
app.use(store)
  .use(router)
  .use(Button)
  .use(Form)
  .use(FormItem)
  .use(Input)
  .use(Select)
  .use(Menu)
  .use(Layout)
  .use(Breadcrumb)
  .use(BreadcrumbItem)
  .use(Table)
  .use(Switch)
  .use(Pagination)
  .use(ConfigProvider)
  .use(Drawer)
  .use(Row)
  .use(Col)
  .mount('#app')
