<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

defineProps<{ msg: string }>();

// iframe 的引用，用于后续向子应用发送消息
const iframeRef = ref(null);
// 用于存储从子应用 app2 接收到的消息
const childMessage = ref("");

// 向子应用 app2 发送消息的方法
const sendToApp2 = () => {
  iframeRef.value.contentWindow.postMessage(
    {
      type: "FROM_PARENT", // 消息类型标识
      data: "我是app1，收到请回答，收到请回答！", // 发送的内容
    },
    // 指定允许接收消息的目标源（安全性考虑）
    "http://localhost:5174"
  );
};

// 处理从子应用 app2 接收到的消息
const handleMessageFromChild = (event) => {
  // 安全校验，只处理来自指定源的消息
  if (event.origin !== "http://localhost:5174") return;

  // 判断消息类型，若为 FROM_CHILD，则更新 childMessage
  if (event.data.type === "FROM_CHILD") {
    childMessage.value = event.data.data;
  }
};

// iframe 加载完成时，监听 window 的 message 事件
const onIframeLoad = () => {
  window.addEventListener("message", handleMessageFromChild);
};

// 组件卸载前移除事件监听，防止内存泄漏（已注释，可根据需要启用）
onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessageFromChild);
});
</script>

<template>
  <div>
    <h2>{{ msg }}</h2>
    <!-- 按钮：点击后向子应用发送消息 -->
    <button @click="sendToApp2">app1发送消息给app2</button>
    <!-- 展示从子应用接收到的消息 -->
    <p style="color: skyblue">来自子应用的消息: {{ childMessage }}</p>
  </div>
  <!-- 嵌入子应用的 iframe，加载完成后绑定事件监听 -->
  <iframe
    ref="iframeRef"
    src="http://localhost:5174/"
    @load="onIframeLoad"
    frameborder="0"
  ></iframe>
</template>

<style scoped>
iframe {
  width: 1000px;
  height: 400px;
  border: 1px solid #ccc;
  margin: 10px;
}
</style>
