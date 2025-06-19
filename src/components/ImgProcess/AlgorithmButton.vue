<template>
  <div>
    <!-- 触发按钮 -->
    <el-button class="inference-button" type="primary" @click="openDialog">ALGORITHM</el-button>

    <!-- 配置对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      title="ALGORITHM" 
      width="30%"
    >
      <!-- 配置表单 -->
      <el-form :model="formData" label-width="80px">
        <el-form-item label="lr">
          <el-input v-model="formData.lr"/>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="updateConfig">确认修改</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 对话框状态
const dialogVisible = ref(false)

// 表单数据（带默认值）
const formData = reactive({
  lr: 0.0001
})

// 打开对话框并获取配置
const openDialog = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/config/crop')
    Object.assign(formData, response.data)
    dialogVisible.value = true
  } catch (error) {
    ElMessage.error('获取配置失败: ' + error.message)
  }
}

// 更新配置
const updateConfig = async () => {
  try {
    await axios.put('http://localhost:8080/api/config/crop', {
      x: formData.x,
      y: formData.y,
      width: formData.width,
      height: formData.height,
      lr: formData.lr
    })
    ElMessage.success('配置更新成功!')
    dialogVisible.value = false
  } catch (error) {
    ElMessage.error('更新失败: ' + error.message)
  }
}

</script>

<style scoped>
.inference-button {
  background-color: rgb(40, 108, 153);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 8px 15px;
  margin-left: 10px;
  cursor: pointer;
  transition: background-color 0.3s;
}
</style>
