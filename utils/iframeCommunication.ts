/**
 * 消息处理函数类型定义
 * @template T - 消息数据类型
 * @param data - 消息数据
 * @param event - 原始 MessageEvent 事件对象
 */
type MessageHandler<T = any> = (data: T, event: MessageEvent) => void;

/**
 * useIframeCommunication 的配置项接口
 * @property allowedOrigin - 允许通信的目标源（origin），用于安全校验
 */
interface IframeCommunicationOptions {
  allowedOrigin?: string;
}

/**
 * useIframeCommunication 返回值接口
 * @property send - 发送消息方法
 * @property on - 注册消息处理器方法
 * @property destroy - 销毁通信实例方法
 * @property setTargetWindow - 设置目标窗口方法
 */
interface IframeCommunication {
  send: (type: string, data: any) => void;
  on: (type: string, handler: MessageHandler) => void;
  destroy: () => void;
  setTargetWindow: (window: Window) => void;
}

/**
 * 用于 iframe 通信的工具函数，支持发送消息、注册消息处理器、销毁监听等功能。
 * @param options - 配置项，包含目标窗口和允许的 origin
 * @returns IframeCommunication 实例
 */
export const useIframeCommunication = (
  options: IframeCommunicationOptions = {}
): IframeCommunication => {
  const { allowedOrigin } = options;
  // 存储消息类型与对应处理函数的映射
  const messageHandlers = new Map<string, MessageHandler>();

  let targetWindow: Window = window.parent;

  /**
   * 设置目标窗口（在iframe加载完成后调用）
   * @param window - 目标窗口对象
   */
  const setTargetWindow = (window: Window) => {
    targetWindow = window;
  };

  /**
   * 发送消息到目标窗口
   * @param type - 消息类型
   * @param data - 消息数据
   */
  const send = (type: string, data: any) => {
    targetWindow?.postMessage({ type, data }, allowedOrigin || "*");
  };

  /**
   * 注册消息处理函数
   * @param type - 消息类型
   * @param handler - 处理函数
   */
  const on = (type: string, handler: MessageHandler) => {
    messageHandlers.set(type, handler);
  };

  /**
   * 内部消息事件处理器
   * @param event - MessageEvent 事件对象
   */
  const messageHandler = (event: MessageEvent) => {
    // 若指定了 allowedOrigin，则只处理来自该源的消息
    if (allowedOrigin && event.origin !== allowedOrigin) return;

    const { type, data } = (event.data || {}) as { type?: string; data?: any };
    const handler = type && messageHandlers.get(type);
    // 调用对应类型的处理函数
    if (typeof handler === "function") {
      handler(data, event);
    }
  };

  // 注册全局 message 事件监听
  window.addEventListener("message", messageHandler);

  /**
   * 销毁通信实例，移除事件监听并清空处理器
   */
  const destroy = () => {
    window.removeEventListener("message", messageHandler);
    messageHandlers.clear();
  };

  return { setTargetWindow, send, on, destroy };
};
