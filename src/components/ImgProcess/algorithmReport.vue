/*algorithmReport*/
<template>
    <div class="log-container">
        <div class="head">
          <span></span>
          <span>算法运行情况</span>
        </div>
        <div class="log-display-container">
          <el-scrollbar wrap-class="scrollbar-wrapper">
            <div class="log-display">
              <div 
                v-for="(report, index) in reports" 
                :key="index" 
                :class="['log-entry', logLevelClass(report)]"
              >
                <span>{{ report }}</span>
              </div>
            </div>
          </el-scrollbar>
        </div>  
    </div>
    
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed, watch } from 'vue';
import { ElScrollbar } from 'element-plus';


const props = defineProps({
  logs: {
    type: Array,
    default: [],
  },
});



const reports = ref([]);

// 日志解析函数
const extractTimestamp = (log) => 
  (log.match(/^(\d{2}:\d{2}:\d{2}\.\d{3})/) || [])[1] || '';

const extractThread = (log) => 
  (log.match(/\[([^\]]+)\]/) || [])[1] || '';

const extractLevel = (log) => 
  (log.match(/\]\s+(\w+)(?:\s+|-\s+)/) || [])[1] || '';

const extractLogger = (log) => 
  (log.match(/\]\s+\w+\s+([^\s-]+)/) || [])[1] || '';

const extractMessage = (log) => 
  (log.match(/-\s+(.*)$/) || [])[1] || log;

const logLevelClass = (log) => {
  const level = extractLevel(log);
  return {
    'log-error': level === 'ERROR',
    'log-warn': level === 'WARN',
    'log-info': level === 'INFO',
    'log-debug': level === 'DEBUG',
    'log-trace': level === 'TRACE'
  };
};

watch(() => [...props.logs], (newLogs) => {
  reports.value = []; // 清空原有报告
  newLogs.forEach(log => {
    const message =extractMessage(log)
    if (message.includes("调用C++ DLL进行单帧处理，算法:")) {
      const timestamp = extractTimestamp(log);
      reports.value.push(`[${timestamp}] 单帧处理算法启动 `);
    }
    else if(message.includes("单帧识别请求处理完成:")) {
      const timestamp = extractTimestamp(log);
      reports.value.push(`[${timestamp}] 单帧处理算法结束 `);
    }
    else if(message.includes("调用C++ processImageWrapper (多帧模式)")) {
      const timestamp = extractTimestamp(log);
      reports.value.push(`[${timestamp}] 多帧处理算法启动 `);
    }
    else if(message.includes("C++ (多帧) 处理成功。")) {
      const timestamp = extractTimestamp(log);
      reports.value.push(`[${timestamp}] 多帧处理算法结束 `);
    }
  });
}, { immediate: true }); // 立即执行一次


</script>

<style scoped>
.head {
  background-color: rgb(27, 40, 56);
  width: 100%;
  height: 5vh;
}

.log-container {
  font-family: 'Courier New', monospace;
  display: flex;
  flex-direction: column;
  height: 50vh;
  padding: 1rem;
  background-color: #1e1e1e;
  color: #d4d4d4;
  font-size: 14px;
}

.log-display-container {
  flex: 1;
  position: relative;
}

.scrollbar-wrapper {
  height: 100vh;
  overflow: auto; /* 垂直滚动 */
}

.log-display {
  width: 100%; /* 宽度由内容决定 */
  height: 40vh;
  overflow-y: auto; /* 保持垂直滚动 */
  overflow-x: auto; /* 添加横向滚动 */
  background-color: #1e1e1e;
  border: 1px solid #3c3c3c;
  border-radius: 4px;
  padding: 0.5rem;
}

.empty-logs {
  color: #888;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

/* 日志条目样式 */
.log-entry {
  padding: 0.3rem 0;
  border-bottom: 1px solid #2d2d2d;
  display: grid;
  gap: 8px;
  line-height: 1.4;
}

.log-entry > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timestamp { color: #6a9955; }  /* 绿色 */
.message { white-space: normal; }

</style>