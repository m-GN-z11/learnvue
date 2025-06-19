<template>
  <div>
    <!-- 触发按钮 -->
    <el-button class="inference-button" type="primary" @click="openDialog">Config</el-button>

    <!-- 配置对话框 -->
    <el-dialog 
      v-model="dialogVisible" 
      width="30%"
    >
      <div class="dialog-header">
        <span class="dialog-title">Region</span>
      </div>
      <el-form :model="formData" label-width="80px">
        <el-form-item label="x">
          <el-input v-model="formData.x" :min="0"/>
        </el-form-item>
        <el-form-item label="y">
          <el-input v-model="formData.y" :min="0"/>
        </el-form-item>
        <el-form-item label="width">
          <el-input v-model="formData.width" :min="1"/>
        </el-form-item>
        <el-form-item label="height">
          <el-input v-model="formData.height" :min="1"/>
        </el-form-item>
      </el-form>

      <div class="dialog-header">
        <span class="dialog-title">ALGORITHM</span>
      </div>

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
import { ref } from 'vue'
import { 
  formData, 
  dialogVisible, 
  openDialog, 
  updateConfig 
} from '../../composables/useConfig'

// 暴露给模板的响应式变量和方法
defineExpose({
  formData,
  dialogVisible,
  openDialog,
  updateConfig
})
</script>

<style scoped>
.dialog-header {
  text-align: left;
  margin-bottom: 20px;
  padding-left: 30px;
}
.dialog-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 5px;
}
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