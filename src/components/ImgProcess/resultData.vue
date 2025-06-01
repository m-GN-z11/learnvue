<template>
  <div class="result-data-container">
    <h4 class="table-title" v-if="datamode">特征数据 (帧: {{ idx + 1 }})</h4>
    <h4 class="table-title" v-else>特征数据</h4>
    
    <el-table 
      :data="tableData"
      :show-header="tableData.length > 0"
      :empty-text="emptyText"
      style="width: 100%"
    >
      <el-table-column prop="name" label="特征名称" width="250" />
      <el-table-column prop="value" label="值">
        <template #default="{ row }">
          <span :class="row.valueClass">{{ row.displayValue }}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { ElTable, ElTableColumn } from 'element-plus';

const props = defineProps({
  idx: Number,
  datavalue: Object,
  datamode: Boolean,
});



// 特征定义
const defaultFeatureKeys = [
  { name: "variance", key: "variance" },
  { name: "mean_region", key: "mean_region" },
  { name: "SCR", key: "SCR" },
  { name: "contrast", key: "contrast" },
  { name: "entropy", key: "entropy" },
  { name: "smoothness", key: "smoothness" },
  { name: "skewness", key: "skewness" },
  { name: "kurtosis", key: "kurtosis" },
  { name: "xjy_area", key: "xjy_area" },
  { name: "peak_cell_intensity", key: "peak_cell_intensity" },
  { name: "xjy_background_intensity", key: "xjy_background_intensity" },
  { name: "tl_xs", key: "tl_xs" },
  { name: "tl_ys", key: "tl_ys" },
  { name: "widths", key: "widths" },
  { name: "heights", key: "heights" }
];

// 表格数据计算
const tableData = computed(() => {
  if (!props.datamode) {
    // 非数据模式：显示所有特征名称，值为N/A
    return defaultFeatureKeys.map(feature => ({
      name: feature.name,
      displayValue: 'N/A',
    }));
  }

  // 数据模式：处理实际数据
  const hasData = props.datavalue && Object.keys(props.datavalue).length > 0;
  if (!hasData) return [];

  return defaultFeatureKeys.map(feature => {
    const featureData = props.datavalue[feature.key];
    let displayValue = 'N/A';
    
    // 处理数组类型数据
    if (Array.isArray(featureData) && 
        props.idx >= 0 && 
        props.idx < featureData.length) {
      displayValue = featureData[props.idx].toFixed(4);
    } 
    // 处理单值数据
    else if (typeof featureData === 'number') {
      displayValue = featureData.toFixed(4);
    }

    return {
      name: feature.name,
      displayValue,
    };
  });
});

// 空状态文本
const emptyText = computed(() => {
  if (!props.datamode) return '无特征数据可显示';
  return '当前帧无有效特征数据';
});


</script>

// 表格换成element的表格，不要用vue原生的
// 现在是动态分布，改成显示框绝对静止
// 布局在多帧的组件里调整一下，放到最下面
// 样式颜色风格尽量和其他组件一致
<style scoped>

.table-title {
  color: #f3f7fa;
  margin-top: 0;
  margin-bottom: 10px;
  font-size: 1em;
  text-align: left;
  padding-left: 5px;
}


.el-table {
      --el-table-border-color: rgba(1, 6, 12, 0.4);
      --el-table-header-bg-color: rgba(2, 7, 78, 0.7);
      --el-table-tr-bg-color: rgba(12, 26, 45, 0.5);
      --el-table-row-hover-bg-color: rgba(24, 48, 85, 0.7);
      --el-table-header-text-color: #e6e9ee;
      --el-table-text-color: #e7ebee;
      border-radius: 0 0 10px 10px;
      overflow: hidden;
    }
</style>