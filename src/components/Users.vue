<template>
  <div>
    <a-input-search v-model:value="value" placeholder="input search text" style="width: 200px;" @search="onSearch" />
    <a-button type="primary" @click="showDrawer(false)" style="margin-left: 20px;">添加用户</a-button>
    <a-table rowKey="id" :columns="columns" :data-source="userList" bordered :pagination="false"
      style="margin-top: 15px;">
      <template #state="{ record, text }">
        <a-switch @click="stateChangeHandler(record.id, !text)" :checked="text"></a-switch>
      </template>
      <template #handler="{ record }">
        <a-button @click="showDrawer(record.id)" type="primary" shape="circle">
          <template #icon>
            <EditOutlined />
          </template>
        </a-button>
        <a-button @click="removeUserHandler(record.id)" type="danger" shape="circle">
          <template #icon>
            <CloseOutlined />
          </template>
        </a-button>
        <a-button type="primary" shape="circle">
          <template #icon>
            <ToolOutlined />
          </template>
        </a-button>
      </template>
    </a-table>
    <a-config-provider :locale="locale">
      <a-pagination :pageSizeOptions="['1', '2', '5', '8', '10']" :defaultPageSize="5" @change="pageChangeHandler"
        @showSizeChange="showSizeChangeHandler" style="margin-top: 30px;" :total="total" show-size-changer
        show-quick-jumper />
    </a-config-provider>

    <a-drawer title="创建新用户" :width="720" :visible="visible" :body-style="{ paddingBottom: '80px' }" @close="onClose">
      <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
        <a-row :gutter="16">
          <a-col :span="18">
            <a-form-item label="用户名" name="username">
              <a-input :disabled="isEditUser" v-model:value="form.username" placeholder="请输入用户名" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="18">
            <a-form-item label="密码" v-if="!isEditUser" name="password">
              <a-input-password v-model:value="form.password" placeholder="请输入密码" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="18">
            <a-form-item label="邮箱" name="email">
              <a-input v-model:value="form.email" placeholder="请输入邮箱" />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="16">
          <a-col :span="18">
            <a-form-item label="手机号" name="mobile">
              <a-input v-model:value="form.mobile" placeholder="请输入手机号" />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <div :style="{
        position: 'absolute',
        right: 0,
        bottom: 0,
        width: '100%',
        borderTop: '1px solid #e9e9e9',
        padding: '10px 16px',
        background: '#fff',
        textAlign: 'right',
        zIndex: 1,
      }">
        <a-button style="margin-right: 8px" @click="onClose">取消</a-button>
        <a-button type="primary" @click="onSubmit">提交</a-button>
      </div>
    </a-drawer>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, ref, reactive, toRaw } from 'vue';
import { EditOutlined, ToolOutlined, CloseOutlined } from '@ant-design/icons-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { message } from 'ant-design-vue';
export default {
  components: {
    EditOutlined,
    ToolOutlined,
    CloseOutlined
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const columns = [
      {
        title: 'ID',
        dataIndex: 'id',
      },
      {
        title: '用户名',
        dataIndex: 'username',
      },
      {
        title: '邮箱',
        dataIndex: 'email',
      },
      {
        title: '电话',
        dataIndex: 'mobile',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
      },
      {
        title: '状态',
        dataIndex: 'mg_state',
        slots: {
          customRender: 'state',
        },
      },
      {
        title: '操作',
        slots: {
          customRender: 'handler'
        }
      },
    ];
    let queryParams = {
      query: '',
      pagenum: 1,
      pagesize: 5
    }
    const onSearch = (val) => {
      queryParams.query = val
      queryData()
    }
    const userList = ref()
    const total = ref()
    const queryData = async () => {
      const { data } = await proxy.$http.get('users', {
        params: queryParams
      })
      total.value = data.total
      userList.value = data.users
    }
    onMounted(() => {
      queryData()
    })

    const pageChangeHandler = (page, pageSize) => {
      queryParams.pagenum = page
      queryParams.pagesize = pageSize
      queryData()
    }


    const showSizeChangeHandler = (current, size) => {
      queryParams.pagenum = current
      queryParams.pagesize = size
      queryData()
    }

    const form = reactive({
      username: '',
      password: '',
      email: '',
      mobile: ''
    });
    const formRef = ref()
    const rules = {
      username: [
        {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 12,
          message: '长度在3--12位之间'
        }
      ],
      password: [
        {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        },
        {
          min: 6,
          max: 16,
          message: '长度在6--16位之间'
        }
      ],
      email: [
        {
          required: true,
          message: '请输入邮箱',
          trigger: 'blur'
        },
      ],
      mobile: [
        {
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        },
      ]
    };
    const visible = ref(false)
    const isEditUser = ref(false)
    let editUserID = ''
    const showDrawer = async userID => {
      visible.value = true
      if (userID) {
        editUserID = userID
        isEditUser.value = true
        const { meta, data } = await proxy.$http.get('users/' + userID)
        if (meta.status !== 200) return message.error(meta.msg)
        form.username = data.username
        form.email = data.email
        form.mobile = data.mobile
      } else {
        // visible.value = true
        isEditUser.value = false
      }
    }
    const onClose = () => {
      visible.value = false
      message.info('已取消')
      formRef.value.resetFields()
    }
    const onSubmit = async () => {

      if (isEditUser.value) {
        const params = {
          email: form.email,
          mobile: form.mobile
        }
        const { meta } = await proxy.$http.put('users/' + editUserID, params)
        if (meta.status !== 200) return message.error(meta.msg)
        message.success(meta.msg)
        queryData()
      } else {
        const params = toRaw(form)
        const { meta } = await proxy.$http.post('users', params)
        if (meta.status !== 201) return message.error(meta.msg)
        message.success(meta.msg)
        queryData()
      }
      visible.value = false
      form.username = ''
      form.email = ''
      form.mobile = ''
      formRef.value.resetFields()
    }

    const stateChangeHandler = async (userID, state) => {
      const { meta } = await proxy.$http.put(`users/${userID}/state/${state}`)
      if (meta.status !== 200) return message.error(meta.msg)
      message.success(meta.msg)
      queryData()
    }

    const removeUserHandler = async (userID) => {
      const { meta } = await proxy.$http.delete('users/' + userID)
      if (meta.status !== 200) return message.error(meta.msg)
      message.success(meta.msg)
      queryData()
    }



    return {
      columns,
      onSearch,
      userList,
      locale: zhCN,
      pageChangeHandler,
      total,
      showSizeChangeHandler,
      visible,
      showDrawer,
      onClose,
      form,
      rules,
      onSubmit,
      stateChangeHandler,
      removeUserHandler,
      isEditUser,
      formRef
    }
  }
}
</script>

<style scoped>
</style>