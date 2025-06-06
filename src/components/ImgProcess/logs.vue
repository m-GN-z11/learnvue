<template>
  <div class="log-container">
    <!-- 连接状态显示 -->
    <div class="connection-status" :class="connectionStatusClass">
      {{ connectionStatusText }}
      <span v-if="lastLogTime">最后日志: {{ lastLogTime }}</span>
    </div>
    
    <!-- 控制按钮区域 -->
    <div class="controls">
      <button @click="toggleConnection">
        {{ isConnected ? '停止接收' : '开始接收' }}日志
      </button>
      <button @click="clearLogs">清空日志</button>
      <label>
        <input type="checkbox" v-model="autoScroll" />
        自动滚动
      </label>
    </div>
    
    <!-- 日志显示区域 - 添加横向滚动 -->
    <div class="log-display-container">
      <div ref="logDisplay" class="log-display">
        <div 
          v-for="(log, index) in logs" 
          :key="index" 
          :class="['log-entry', logLevelClass(log)]"
        >
          <span class="timestamp">{{ extractTimestamp(log) }}</span>
          <span class="thread">{{ extractThread(log) }}</span>
          <span class="level">{{ extractLevel(log) }}</span>
          <span class="logger">{{ extractLogger(log) }}</span>
          <span class="message">{{ extractMessage(log) }}</span>
        </div>
        <div v-if="logs.length === 0" class="empty-logs">
          {{ emptyMessage }}
        </div>
      </div>
    </div>
    
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue';

// 响应式数据
const logs = ref([]);
const isConnected = ref(false);
const connectionStatus = ref('disconnected');
const autoScroll = ref(true);
const logDisplay = ref(null);
const eventSource = ref(null);
const maxLogLines = 1000;
const debugInfo = ref('');
const lastEventId = ref(null);
const connectionAttempts = ref(0);
const lastLogTime = ref(null);
const logCounter = ref(0);
const rateTimer = ref(null);

// 空消息计算属性
const emptyMessage = computed(() => {
  if (logs.value.length > 0) return '';
  if (connectionStatus.value === 'connected') return '已连接 - 等待日志数据...';
  if (connectionStatus.value === 'connecting') return '正在连接到日志服务...';
  return '未连接，点击"开始接收日志"连接服务';
});

// 连接状态文本
const connectionStatusText = computed(() => {
  switch (connectionStatus.value) {
    case 'disconnected': return '未连接';
    case 'connecting': return `连接中... (尝试 ${connectionAttempts.value})`;
    case 'connected': return '已连接 - 接收日志中';
    case 'error': return '连接错误 - 尝试重连';
    default: return '未知状态';
  }
});

// 连接状态样式类
const connectionStatusClass = computed(() => ({
  'status-disconnected': connectionStatus.value === 'disconnected',
  'status-connecting': connectionStatus.value === 'connecting',
  'status-connected': connectionStatus.value === 'connected',
  'status-error': connectionStatus.value === 'error'
}));

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

// 日志级别样式类
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

// 关闭事件源
const closeEventSource = () => {
  if (eventSource.value) {
    eventSource.value.close();
    eventSource.value = null;
  }
};

// 连接到SSE
const connectToSSE = () => {
  if (isConnected.value) return;
  
  closeEventSource(); // 确保关闭旧连接
  connectionStatus.value = 'connecting';
  connectionAttempts.value++;
  
  try {
    eventSource.value = new EventSource('http://localhost:8081/sse/logs');
    
    eventSource.value.addEventListener('open', () => {
      isConnected.value = true;
      connectionStatus.value = 'connected';
      startRateCounter();
    });

    eventSource.value.addEventListener('log', (event) => {
      lastEventId.value = event.lastEventId;
      addLog(event.data);
      logCounter.value++;
    });

    eventSource.value.addEventListener('error', (err) => {
      console.error('SSE错误:', err);
      connectionStatus.value = 'error';
      stopRateCounter();
      setTimeout(reconnect, 3000);
    });
    
  } catch (error) {
    console.error('创建EventSource失败:', error);
    connectionStatus.value = 'error';
    setTimeout(reconnect, 5000);
  }
};

// 启动/停止速率计数器
const startRateCounter = () => {
  stopRateCounter();
  rateTimer.value = setInterval(() => {
    logCounter.value = 0;
  }, 1000);
};

const stopRateCounter = () => {
  if (rateTimer.value) {
    clearInterval(rateTimer.value);
    rateTimer.value = null;
  }
};

// 添加日志
const addLog = (log) => {
  logs.value.push(log);
  lastLogTime.value = new Date().toLocaleTimeString();
  
  if (logs.value.length > maxLogLines) {
    logs.value.splice(0, logs.value.length - maxLogLines);
  }
  
  if (autoScroll.value) {
    nextTick(() => {
      logDisplay.value?.scrollTo({
        top: logDisplay.value.scrollHeight,
        behavior: 'smooth'
      });
    });
  }
};

// 重新连接
const reconnect = () => {
  closeEventSource();
  connectToSSE();
};

// 断开连接
const disconnect = () => {
  closeEventSource();
  isConnected.value = false;
  connectionStatus.value = 'disconnected';
  stopRateCounter();
};

// 切换连接状态
const toggleConnection = () => {
  isConnected.value ? disconnect() : connectToSSE();
};

// 清空日志
const clearLogs = () => {
  logs.value = [];
};

// 复制调试信息
const copyDebugInfo = () => {
  debugInfo.value = `SSE连接调试信息:
连接状态: ${connectionStatus.value}
连接尝试次数: ${connectionAttempts.value}
最后事件ID: ${lastEventId.value || '无'}
当前日志条数: ${logs.value.length}
最后日志时间: ${lastLogTime.value || '无'}
用户代理: ${navigator.userAgent}
当前时间: ${new Date().toISOString()}`;

  navigator.clipboard.writeText(debugInfo.value);
};

// 生命周期钩子
onMounted(connectToSSE);
onUnmounted(disconnect);
</script>

<style scoped>
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

.connection-status {
  padding: 0.5rem;
  margin-bottom: 1rem;
  border-radius: 4px;
  text-align: center;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
}

.status-disconnected {
  background-color: #6c757d; /* 灰色 */
}

.status-connecting {
  background-color: #ffc107; /* 黄色 */
  color: #000;
}

.status-connected {
  background-color: #198754; /* 绿色 */
}

.status-error {
  background-color: #dc3545; /* 红色 */
}

.controls {
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
  padding: 0.5rem;
  background-color: #252526;
  border-radius: 4px;
}

button {
  background-color: #3a3a3a;
  color: #d4d4d4;
  border: none;
  padding: 0.3rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 13px;
}

button:hover {
  background-color: #4a4a4a;
}

.stats {
  margin-left: auto;
  font-size: 13px;
  opacity: 0.8;
}

/* 添加横向滚动容器 */
.log-display-container {
  flex: 1;
  overflow: auto; /* 垂直滚动 */
  position: relative;
}

.log-display {
  width: max-content; /* 宽度由内容决定 */
  height: 100%;
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
  grid-template-columns: 180px 160px 60px 120px 1fr;
  gap: 8px;
  line-height: 1.4;
}

.log-entry > span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.timestamp { color: #6a9955; }  /* 绿色 */
.thread { color: #569cd6; }     /* 蓝色 */
.level { font-weight: bold; }
.logger { color: #9cdcfe; }     /* 浅蓝 */
.message { white-space: normal; }

/* 日志级别颜色 */
.log-error .level { color: #f48771; }  /* 错误 - 红色 */
.log-warn .level { color: #e5c07b; }   /* 警告 - 黄色 */
.log-info .level { color: #56b6c2; }   /* 信息 - 青色 */
.log-debug .level { color: #c678dd; }  /* 调试 - 紫色 */
.log-trace .level { color: #7f848e; }  /* 跟踪 - 灰色 */

.debug-info {
  margin-top: 1rem;
  padding: 1rem;
  background-color: #252526;
  border-radius: 4px;
  font-size: 12px;
  max-height: 200px;
  overflow: auto;
}

.debug-info pre {
  margin: 0;
  white-space: pre-wrap;
  line-height: 1.4;
}

.debug-info h3 {
  margin-top: 0;
  display: flex;
  justify-content: space-between;
}
</style>
