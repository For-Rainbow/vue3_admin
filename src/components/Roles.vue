<template>
  <div>
    <a-button type="primary">添加角色</a-button>
    <a-table rowKey="id" :columns="columns" :pagination="false" :data-source="rolesList" childrenColumnName="">
      <template #expandedRowRender="{ record }">
        <a-row v-for="item1 in record.children" :key="item1.id" class="first-line">
          <a-col :span="5">
            <a-tag closable @close.prevent="deleteRightHandler(record.id, item1.id)" color="purple">{{ item1.authName }}
            </a-tag>
            <CaretRightOutlined />
          </a-col>
          <a-col :span="19">
            <a-row v-for="(item2, index) in item1.children" :key="item2.id" :class="{ 'last-line': index !== 0 }">
              <a-col :span="8">
                <a-tag closable @close.prevent="deleteRightHandler(record.id, item2.id)" color="blue">{{ item2.authName
                }}</a-tag>
                <CaretRightOutlined />
              </a-col>
              <a-col :span="16">
                <span v-for="item3 in item2.children" :key="item3.id">
                  <a-tag closable @close.prevent="deleteRightHandler(record.id, item3.id)" color="green">
                    {{ item3.authName }}
                  </a-tag>
                </span>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </template>
      <template #index="{ index }">
        {{ index }}
      </template>
      <template #handle="{ record }">
        <a-button type="primary" size="small" style="margin: 0 4px;">
          <template #icon>
            <EditOutlined />
          </template>
          编辑
        </a-button>
        <a-button type="danger" size="small" style="margin: 0 4px;">
          <template #icon>
            <CloseOutlined />
          </template>
          删除
        </a-button>
        <a-button type="primary" size="small" style="margin: 0 4px;" @click="showSetRights(record.children, record.id)">
          <template #icon>
            <ToolOutlined />
          </template>
          分配权限
        </a-button>
      </template>
    </a-table>
    <a-modal v-model:visible="visible" @cancel="exitSetRightsHandle" title="Basic Modal" @ok="setRightsHandle">
      <a-tree v-if="rightsList.length" @check="checkTreeItem" checkable :defaultExpandAll="true" :tree-data="rightsList"
        v-model:checkedKeys="checkedKeys" :replaceFields="rightsListTreeProps">
      </a-tree>
    </a-modal>
  </div>
</template>

<script>
import { ref } from '@vue/reactivity';
import { message, Modal } from 'ant-design-vue';
import { createVNode, getCurrentInstance, onMounted } from 'vue';
import { EditOutlined, CloseOutlined, ToolOutlined, CaretRightOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue';

const columns = [{
  title: '#',
  slots: {
    customRender: 'index'
  }
}, {
  title: '角色名称',
  dataIndex: 'roleName',
}, {
  title: '角色描述',
  dataIndex: 'roleDesc',
}, {
  title: '操作',
  slots: { customRender: 'handle' }
}];
const rolesList = ref([])
export default {
  components: {
    EditOutlined,
    CloseOutlined,
    ToolOutlined,
    CaretRightOutlined,
  },
  setup() {
    const { proxy } = getCurrentInstance()
    const queryRoles = async () => {
      const { meta, data } = await proxy.$http.get('roles')
      if (meta.status === 200) {
        rolesList.value = data
      }
    }
    onMounted(() => {
      queryRoles()
    })
    const deleteRightHandler = (recordID, rightID) => {
      Modal.confirm({
        title: () => '您确认要删除此权限吗?',
        icon: () => createVNode(ExclamationCircleOutlined),
        content: () =>
          createVNode(
            'div',
            {
              style: 'color:red;',
            },
            '此操作不可撤回，请谨慎选择',
          ),

        async onOk() {
          const { meta } = await proxy.$http.delete(`roles/${roleID}/rights/${rightID}`)
          if (meta.status !== 200) return message.error(meta.msg)
          message.success(meta.msg)
        },

        onCancel() {
          message.info('已取消')
        },
      })
    }
    const visible = ref(false)
    const rightsList = ref([]);
    const checkedKeys = ref([]);
    let currentSetRightsID = 0
    const getRightsHandle = (rightsArr, newArr) => {
      rightsArr.forEach(item => {
        if (!item.children) return newArr.push(item.id)
      });
      getRightsHandle(item.children, newArr)
    }
    const showSetRights = async (rights, id) => {
      currentSetRightsID = id
      visible.value = true
      const { data, meta } = await proxy.$http.get('rights/tree')
      if (meta.status !== 200) return message.error('抱歉，不存在')
      rightsList.value = data
      const rightsArr = toRaw(rights)
      getRightsHandle(rightsArr, checkedKeys.value)
    }
    let setRightsParams = []
    const checkTreeItem = (a, b) => {
      setRightsParams = [
        ...a,
        ...b.halfCheckedKeys
      ]
    }
    const setRightsHandle = async () => {
      const { meta } = await proxy.$http.post(`roles/${currentSetRightsID}/rights`, {
        rids: setRightsParams.join(',')
      })
      if (meta.status !== 200) return message.error(meta.msg)
      message.success(meta.msg)
      queryRoles()
      checkedKeys.value = []
      visible.value = false
    }
    const rightsListTreeProps = {
      children: 'children',
      title: 'authName',
      key: 'id'
    }
    const exitSetRightsHandle = () => {
      checkedKeys.value = []
    }
    return {
      columns,
      rolesList,
      deleteRightHandler,
      visible,
      showSetRights,
      setRightsHandle,
      rightsList,
      checkedKeys,
      rightsListTreeProps,
      exitSetRightsHandle,
      checkTreeItem
    }
  }
}
</script>
<style lang="less" scoped>
.first-line {
  border-bottom: 1px solid #ccc;
}

.last-line {
  border-bottom: 1px solid #ddd;
}

.ant-row {
  margin: 8px 0 !important;
  padding: 4px 0 !important;
}

.ant-table-expanded-row {
  text-align: left !important;
}
</style>
<style lang="less">
.ant-table-body table {
  text-align: center !important;
}

.ant-table-thead th {
  text-align: center !important;
}
</style>