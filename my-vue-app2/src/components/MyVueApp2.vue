<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useIframeCommunication } from "../../../utils/iframeCommunication";

// 用于存储从父应用收到的消息
const parentMessage = ref("");

// 初始化通信工具，只允许接收来自父应用的消息
const { send, on, destory } = useIframeCommunication({
  allowedOrigin: "http://localhost:5173",
});

// 注册消息监听，收到父应用消息时更新 parentMessage
on("FROM_PARENT", (data) => {
  parentMessage.value = data;
});

// 向父应用发送消息
const sendToParent = () => {
  send("FROM_CHILD", "我是app2，收到，收到！🫡");
};

// 组件卸载时销毁通信实例，移除事件监听
onBeforeUnmount(() => {
  destory();
});
</script>

<template>
  <h2>我是my-vue-app2</h2>
  <!-- 按钮：点击后向父应用发送消息 -->
  <button @click="sendToParent">app2发送消息给app1</button>
  <!-- 展示从父应用接收到的消息 -->
  <p style="color: red">来自父应用的消息: {{ parentMessage }}</p>
</template>

<style scoped></style>
