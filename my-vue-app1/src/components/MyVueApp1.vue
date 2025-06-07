<script setup>
import { ref, onBeforeUnmount } from "vue";
import { useIframeCommunication } from "../../../utils/iframeCommunication.ts";

// iframe 的 DOM 引用
const iframeRef = ref(null);
// 存储从子应用收到的消息
const childMessage = ref("");

// iframe 加载完成后，设置通信目标窗口为子应用 iframe
const onIframeLoad = () => {
  setTargetWindow(iframeRef.value.contentWindow);
};

// 初始化通信工具，allowedOrigin 限定只接收来自子应用的消息
const { send, on, destory, setTargetWindow } = useIframeCommunication({
  allowedOrigin: "http://localhost:5174",
});

// 注册消息监听，收到子应用消息时更新 childMessage
on("FROM_CHILD", (data) => {
  childMessage.value = data;
});

// 向子应用发送消息
const sendToApp2 = () => {
  send("FROM_PARENT", "我是app1，收到请回答，收到请回答！");
};

// 组件卸载时销毁通信实例，移除事件监听
onBeforeUnmount(() => {
  destory();
});
</script>

<template>
  <div>
    <h2>我是my-vue-app1</h2>
    <!-- 按钮：点击后向子应用发送消息 -->
    <button @click="sendToApp2">app1发送消息给app2</button>
    <!-- 展示从子应用接收到的消息 -->
    <p style="color: skyblue">来自子应用的消息: {{ childMessage }}</p>
  </div>
  <!-- 嵌入子应用的 iframe，加载完成后绑定事件监听 -->
  <iframe
    ref="iframeRef"
    src="http://localhost:5174"
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
