import { ref, reactive } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'

// 对话框状态
export const dialogVisible = ref(false)

// 表单数据（带默认值）
export const formData = reactive({
  x: 0,
  y: 0,
  width: 320,
  height: 240,
  lr: 0.0001
})

// API 端点配置
const API_ENDPOINTS = {
  GET_CONFIG: 'http://localhost:8080/api/config/crop',
  UPDATE_CONFIG: 'http://localhost:8080/api/config/crop'
}

/**
 * 获取配置数据
 */
const fetchConfig = async () => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_CONFIG)
    return response.data
  } catch (error) {
    handleError('获取配置失败', error)
    return null
  }
}

/**
 * 更新配置数据
 */
const putConfig = async (config) => {
  try {
    await axios.put(API_ENDPOINTS.UPDATE_CONFIG, {
      x: config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      lr: config.lr
    })
    return true
  } catch (error) {
    handleError('更新配置失败', error)
    return false
  }
}

/**
 * 错误处理
 */
const handleError = (message, error) => {
  console.error(`${message}: `, error)
  ElMessage.error(`${message}: ${error.message || '未知错误'}`)
}

/**
 * 打开配置对话框
 */
export const openDialog = async () => {
  const config = await fetchConfig()
  if (config) {
    Object.assign(formData, config)
    dialogVisible.value = true
  }
}

/**
 * 更新配置
 */
export const updateConfig = async () => {
  const success = await putConfig(formData)
  if (success) {
    ElMessage.success('配置更新成功!')
    dialogVisible.value = false
  }
}