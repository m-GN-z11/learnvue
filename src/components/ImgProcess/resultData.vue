<template>
  <div class="result-data-container">
    <h4 class="table-title" v-if="datamode">特征数据 (帧: {{ idx + 1 }})</h4>
    <table class="data-table">
      <thead>
      <tr>
        <th>特征名称</th>
        <th>值</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="feature in displayedFeatureKeys" :key="feature.name">
        <td>{{ feature.name }}</td>
        <td v-if="!datamode" class="data-value-placeholder">N/A</td>
        <td v-else class="data-value">
          {{ (Array.isArray(feature.value) && idx >= 0 && idx < feature.value.length) ? feature.value[idx].toFixed(4) : (feature.value && !Array.isArray(feature.value) && typeof feature.value === 'number' ? feature.value.toFixed(4) : 'N/A') }}
        </td>
      </tr>
      <tr v-if="datamode && displayedFeatureKeys.every(f => !hasValidData(f.value, idx))">
        <td colspan="2" class="no-data-row">当前帧无有效特征数据</td>
      </tr>
      <tr v-if="!datamode && displayedFeatureKeys.length === 0">
        <td colspan="2" class="no-data-row">无特征数据可显示</td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>

import { computed } from 'vue';
const props = defineProps({
  idx: Number,
  datavalue: Object,
  datamode: Boolean,
});

// 把所有的特征都加进去
const defaultFeatureKeys = [
  { name: "variance", key: "variance" },
  { name: "mean_region", key: "mean_region" },
  { name: "SCR", key: "SCR" },
  { name: "contrast", key: "contrast" },
  { name: "entropy", key: "entropy" },
  { name: "homogeneity", key: "homogeneity" },
];

const displayedFeatureKeys = computed(() => {
  if (!props.datavalue && !props.datamode) {
    // 如果没有数据且不是数据模式，可以返回一个空数组或带占位符的默认键
    return defaultFeatureKeys.map(f => ({ name: f.name, value: '' }));
  }
  if (!props.datavalue && props.datamode) {
    // 数据模式但 datavalue 为空
    return defaultFeatureKeys.map(f => ({ name: f.name, value: [] }));
  }

  return defaultFeatureKeys.map(f => ({
    name: f.name,
    // 确保 props.datavalue[f.key] 存在
    value: props.datavalue && props.datavalue[f.key] !== undefined ?
        (Array.isArray(props.datavalue[f.key]) ? props.datavalue[f.key] : [props.datavalue[f.key]]) // 如果不是数组，但有值，包装成数组
        : []
  }));
});

// 辅助函数，检查是否有有效数据用于当前行
function hasValidData(valueArray, index) {
  return Array.isArray(valueArray) && index >= 0 && index < valueArray.length && (valueArray[index] !== null && valueArray[index] !== undefined);
}

</script>

// 表格换成element的表格，不要用vue原生的
// 现在是动态分布，改成显示框绝对静止
// 布局在多帧的组件里调整一下，放到最下面
// 样式颜色风格尽量和其他组件一致
<style scoped>
.result-data-container {
  width: 100%;
  padding: 10px;
  background-color: rgb(40, 56, 76);
  border-radius: 6px;
  color: aliceblue;
  margin-top: 10px;
  box-sizing: border-box;
}

.table-title {
  color: #b0dfff;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
  text-align: left;
  padding-left: 5px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9em;
}

.data-table th,
.data-table td {
  border: 1px solid rgb(60, 80, 100);
  padding: 8px 10px;
  text-align: left;
  color: aliceblue;
}

.data-table th {
  background-color: rgb(50, 70, 90);
  font-weight: bold;
  color: #cce7ff;
}

.data-table tr:nth-child(even) {
  background-color: rgb(45, 63, 83);
}

.data-table tr:hover {
  background-color: rgb(55, 75, 95);
}

.data-value {
  font-weight: 500;
  color: #a6d7ff;
}

.data-value-placeholder,
.no-data-row {
  color: #8a9eb3;
  font-style: italic;
  text-align: center;
}
</style>