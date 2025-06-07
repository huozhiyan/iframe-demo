<script setup lang="ts">
import { ref, onBeforeUnmount } from "vue";

defineProps<{ msg: string }>();

// 用于存储从父应用接收到的消息
const parentMessage = ref("");

// 向父应用发送消息的方法
const sendToParent = () => {
  window.parent.postMessage(
    {
      type: "FROM_CHILD", // 消息类型标识
      data: "我是app2，收到，收到！🫡", // 发送的内容
    },
    "http://localhost:5173" // 指定允许接收消息的目标源（安全性考虑）
  ); // 生产环境应指定具体域名
};

// 处理从父应用接收到的消息
const handleMessageFromParent = (event) => {
  // 安全验证，只处理来自指定源的消息
  if (event.origin !== "http://localhost:5173") return;

  // 判断消息类型，若为 FROM_PARENT，则更新 parentMessage
  if (event.data.type === "FROM_PARENT") {
    parentMessage.value = event.data.data;
  }
};

// 监听 window 的 message 事件，接收父应用的消息
window.addEventListener("message", handleMessageFromParent);

// 组件卸载前移除事件监听，防止内存泄漏（已注释，可根据需要启用）
onBeforeUnmount(() => {
  window.removeEventListener("message", handleMessageFromParent);
});
</script>

<template>
  <h2>{{ msg }}</h2>
  <!-- 按钮：点击后向父应用发送消息 -->
  <button @click="sendToParent">app2发送消息给app1</button>
  <!-- 展示从父应用接收到的消息 -->
  <p style="color: red">来自父应用的消息: {{ parentMessage }}</p>
</template>

<style scoped></style>
