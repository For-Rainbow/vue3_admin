<template>
  <div>
    <a-table :columns="columns" :data-source="rightsList">
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #level="{ text }">
        <a-tag color="pink" v-if="text === '0'">一级</a-tag>
        <a-tag color="blue" v-if="text === '1'">二级</a-tag>
        <a-tag color="green" v-if="text === '2'">三级</a-tag>
      </template>
    </a-table>
  </div>
</template>

<script>
const columns = [{
  title: '#',
  slots: {
    customRender: 'index'
  }
}, {
  title: '权限名称',
  dataIndex: 'authName',
}, {
  title: '路径',
  dataIndex: 'path',
}, {
  title: '权限等级',
  dataIndex: 'level',
  slots: {
    customRender: 'level'
  }
}];


import { message } from 'ant-design-vue';
import { getCurrentInstance, onMounted, ref } from 'vue';
export default {
  setup() {
    const { proxy } = getCurrentInstance()
    const rightsList = ref()
    const queryRightsList = async () => {
      const { meta, data } = await proxy.$http.get('rights/list')
      if (meta.status !== 200) return message.error(meta.msg)
      rightsList.value = data
    }
    onMounted(() => {
      queryRightsList()
    })
    return {
      rightsList,
      columns,
    }
  }
}
</script>

<style scoped>
</style>