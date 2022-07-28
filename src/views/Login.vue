<template>
  <div class="login">
    <div class="login-box">
      <div class="form-box">
        <div class="title">
          欢迎使用电商管理系统
        </div>
        <a-form :model="formState" :rules="rules" ref="formRef">
          <a-form-item name="username" style="margin-top: 10px;">
            <a-input v-model:value="formState.username">
              <template #prefix>
                <user-outlined type="user" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password v-model:value="formState.password">
              <template #prefix>
                <LockOutlined />
              </template>
            </a-input-password>
          </a-form-item>
          <a-form-item class="button-box">
            <a-button type="primary" @click="onSubmit">登录</a-button>
            <a-button style="margin-left: 10px" @click="resetForm">重置</a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from '@vue/reactivity';
import { UserOutlined, LockOutlined } from "@ant-design/icons-vue";
import { getCurrentInstance } from 'vue';
import { message } from 'ant-design-vue'
export default {
  name: 'Login',
  components: {
    UserOutlined,
    LockOutlined
  },
  setup() {
    const formRef = ref()
    const formState = reactive({
      username: '',
      password: ''
    })
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 12, message: '您的用户名长度须在3--12位的范围内', trigger: 'blur' },
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        { min: 6, max: 16, message: '您的密码长度须在6--16为的范围内', trigger: 'blur' },
      ]
    }
    const resetForm = () => formRef.value.resetFields();
    const { proxy } = getCurrentInstance()
    const onSubmit = () => {
      formRef.value.validate()
        .then(async value => {
          const { data, meta } = await proxy.$http.post('login', value)
          if (meta.status !== 200) return message.error(meta.msg)
          message.success(meta.msg)
          window.sessionStorage.token = data.token
          proxy.$router.push('/home')
        })
        .catch(() => false);
    }
    return {
      formState,
      rules,
      formRef,
      resetForm,
      onSubmit
    }
  }
};
</script>
<style lang="less" scoped>
.login {
  height: 100vh;
  background-image: url(../assets/images/login_bg1.jpg);
  background-size: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .login-box {
    position: relative;
    width: 500px;
    height: 300px;
    background-color: rgba(70, 70, 70, .8);
    border-radius: 20px;
    padding: 0 15px;
    padding-top: 80px;

    .button-box {
      float: right;
    }

    .title {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #777;
      color: #fff;
      width: 200px;
      height: 40px;
      line-height: 40px;
      text-align: center;
      border-radius: 10px;
    }


  }
}
</style>
