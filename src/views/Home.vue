<template>
  <a-layout style="min-height: 100vh">
    <a-layout-sider @collapse="collapseChange" theme="dark" v-model:collapsed="collapsed" collapsible>
      <div class="logo">
        {{ logoTitle }}
      </div>
      <a-menu @openChange="openChangeHandler" @select="selectChangeHandler" theme="dark" mode="inline"
        v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys">
        <a-sub-menu :key="item.id" v-for="item in menusList">
          <template #title>
            <span>
              <UserOutlined v-if="item.id === 125" />
              <KeyOutlined v-if="item.id === 103" />
              <SkinOutlined v-if="item.id === 101" />
              <SolutionOutlined v-if="item.id === 102" />
              <AreaChartOutlined v-if="item.id === 145" />
              <span>{{ item.authName }}</span>
            </span>
          </template>
          <a-menu-item :key="value.id" v-for="value in item.children">
            <router-link :to="'/home/' + value.path">{{ value.authName }}</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header class="header">
        <span>{{ usernameLogining }}</span>
        <a-button @click="loginOut">退出</a-button>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <a-breadcrumb style="margin: 16px 0">
          <a-breadcrumb-item v-for="(item, index) in breadcrumbPath" :key="index">
            <router-link :to="index === 'pathOne' ? '/home' : ''">{{ item }}</router-link>
          </a-breadcrumb-item>
        </a-breadcrumb>
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' }">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import {
  PieChartOutlined,
  DesktopOutlined,
  UserOutlined,
  TeamOutlined,
  FileOutlined,
  KeyOutlined,
  SkinOutlined,
  SolutionOutlined,
  AreaChartOutlined
} from '@ant-design/icons-vue';
import {
  defineComponent,
  getCurrentInstance,
  onBeforeMount,
  ref,
  toRaw,
  reactive
} from 'vue';
import { message } from 'ant-design-vue';
export default defineComponent({
  components: {
    PieChartOutlined,
    DesktopOutlined,
    UserOutlined,
    TeamOutlined,
    FileOutlined,
    KeyOutlined,
    SkinOutlined,
    SolutionOutlined,
    AreaChartOutlined
  },
  setup() {
    const logoTitle = ref('电商后台管理系统')
    const collapseChange = collapsed => {
      if (collapsed) {
        logoTitle.value = '电商'
      } else {
        setTimeout(() => {
          logoTitle.value = '电商后台管理系统'
        }, 100)
      }
    }
    const { proxy } = getCurrentInstance()
    const usernameLogining = window.sessionStorage.username
    const loginOut = () => {
      window.sessionStorage.clear()
      message.success('退出成功')
      proxy.$router.push('/login')
    }
    const selectedKeys = ref([window.sessionStorage.selectedKey - 0])
    const openKeys = ref([window.sessionStorage.openKeys - 0])
    const selectChangeHandler = ({ keyPath }) => {
      window.sessionStorage.openKey = keyPath[0]
      window.sessionStorage.selectedKey = keyPath[1]
    }
    const openChangeHandler = (arr) => {
      openKeys.value = [arr[arr.length - 1]]
    }
    const breadcrumbPath = reactive({
      pathOne: 'home',
      pathTwo: ''
    })
    const menusList = ref()
    onBeforeMount(async () => {
      const { data } = await proxy.$http.get('menus')
      menusList.value = data
    })
    proxy.$router.beforeEach((to, from, next) => {
      next()
    })
    proxy.$router.afterEach((to, from) => {
      if (to.path === '/home') breadcrumbPath.pathTwo = ''
      const pathArr = to.path.split('/')
      const pathObj = {}
      if (pathArr.length === 2) {
        pathObj.fatherPath = pathArr[1]
      } else {
        pathObj.fatherPath = pathArr[1]
        pathObj.sonPath = pathArr[2]
        breadcrumbPath = pathArr[2]
      }
      const data = toRaw(menusList.value)
      if (pathObj.sonPath) {
        data.forEach(item => {
          item.children.some(val => {
            if (val.path === pathObj.sonPath) {
              selectedKeys.value = [val.id]
              openKeys.value = [item.id]
            } else {
              openKeys.value = []
              selectedKeys.value = []
              window.sessionStorage.openKey = ''
              window.sessionStorage.selectedKey = ''
            }
          })
        });

      }
    })
    return {
      collapseChange,
      collapsed: ref(false),
      selectedKeys: ref([window.sessionStorage.selectedKey - 0]),
      openKeys: ref([window.sessionStorage.openKey - 0]),
      logoTitle,
      loginOut,
      usernameLogining,
      menusList,
      selectChangeHandler,
      openChangeHandler,
      breadcrumbPath
    }
  }

});
</script>
<style>
.logo {
  height: 32px;
  line-height: 32px;
  margin: 16px;
  background: rgba(255, 255, 255, 0.3);
  text-align: center;
  color: #fff;
}

.header {
  text-align: right;
  background: #fff;
  padding: 0;
  padding-right: 30px;
}

.site-layout .site-layout-background {
  background: #fff;
}

[data-theme='dark'] .site-layout .site-layout-background {
  background: #141414;
}
</style>