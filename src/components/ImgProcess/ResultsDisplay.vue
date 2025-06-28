/*ResultsDisplay.vue*/
<template>
  <!-- 主容器，包含图像显示区域和文本结果区域 -->
  <div class="cropped-result-container">
    <!-- 第一个图像盒子，用于显示感兴趣区域图像 -->
    <div class="image-box">
      <!-- 使用el-image组件显示裁剪后的图像 -->
      <el-image
        v-if="croppedImageUrl"
        :src="croppedImageUrl"
        fit="contain"
        class="cropped-image"
        alt="感兴趣区域图像"
      >
        <!-- 错误状态插槽，当图像加载失败时显示 -->
        <template #error>
          <div class="image-error-slot">
            <span>无感兴趣区域图像</span>
          </div>
        </template>
        <!-- 占位符插槽，当图像正在加载时显示 -->
        <template #placeholder>
          <div class="image-placeholder-slot">
            <span>加载中...</span>
          </div>
        </template>
      </el-image>
      <!-- 当没有裁剪图像时显示的占位符 -->
      <div v-else class="image-placeholder-small">无感兴趣区域图像</div>
      <!-- 图像标签，说明这是感兴趣区域图像 -->
      <div class="image-label">感兴趣区域图像</div>
    </div>
    <!-- 第二个图像盒子，用于显示处理后的结果图像 -->
    <div class="image-box">
      <!-- 使用el-image组件显示结果图像 -->
      <el-image
        v-if="resultImageUrl"
        :src="resultImageUrl"
        fit="contain"
        class="result-image"
        alt="结果图像"
      >
        <!-- 错误状态插槽，当图像加载失败时显示 -->
        <template #error>
          <div class="image-error-slot">
            <span>无结果图像</span>
          </div>
        </template>
        <!-- 占位符插槽，当图像正在加载时显示 -->
        <template #placeholder>
          <div class="image-placeholder-slot">
            <span>加载中...</span>
          </div>
        </template>
      </el-image>
      <!-- 当没有结果图像时显示的占位符 -->
      <div v-else class="image-placeholder-small">无结果图像</div>
      <!-- 图像标签，说明这是结果图像 -->
      <div class="image-label">结果图像</div>
    </div>
  </div>
  <!-- 文本结果容器，仅在存在文本结果时显示 -->
  <div v-if="textResults && textResults.length > 0" class="text-results-container">
    <!-- 文本结果标题 -->
    <h4>识别结果文本:</h4>
    <!-- 无序列表，用于显示识别结果 -->
    <ul>
      <!-- 遍历文本结果数组，为每个结果创建一个列表项 -->
      <li v-for="(item, index) in textResults" :key="index">
        <!-- 如果结果有标签，显示标签和冒号 -->
        <span v-if="item.label">{{ item.label }}: </span>
        <!-- 显示结果值，如果没有值则显示整个项 -->
        {{ item.value || item }}
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ElImage } from 'element-plus';

defineProps({
  croppedImageUrl: String,
  resultImageUrl: String,
  textResults: Array,
});
</script>

<style scoped>
.cropped-result-container {
  width: 100%;
  margin-top: 5px;
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
  border: 1px solid rgb(56, 56, 56);
  background-color: rgb(27, 40, 56);
}

.image-box {
  width: 48%;
  height: 30vh;
  position: relative;
  background-color: rgb(56, 56, 56);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
}

.cropped-image, .result-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-label {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  box-sizing: border-box;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  padding: 5px;
  text-align: center;
  overflow: hidden;
  font-size: 0.8em;
}

.image-placeholder-small {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  color: #aaa;
  font-size: 0.9rem;
  text-align: center;
  background-color: rgb(56, 56, 56);
}

.image-error-slot, .image-placeholder-slot {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: rgb(56, 56, 56);
  color: #888;
  font-size: 0.9rem;
  text-align: center;
}

.text-results-container {
  margin-top: 10px;
  margin-bottom: 20px;
  background-color: rgb(56, 56, 56);
  color: white;
  border-radius: 4px;
  padding: 10px;
}

.text-results-container h4 {
  margin-top: 0;
  margin-bottom: 8px;
}

.text-results-container ul {
  list-style-type: none;
  padding-left: 0;
  margin-bottom: 0;
}

.text-results-container li {
  margin-bottom: 4px;
}
</style>