import { Message, Notification } from "element-ui";


export function successMsg(msg) {
  return Message({
    message: msg || 'Error',
    type: 'success',
    duration: 5 * 1000
  })
}

export function showNotify(title, msg, type) {
  return Notification({
    title: title || '提示信息',
    message: msg || 'Error',
    type: type || 'success',
  })
}