import { notification } from 'antd'

function getErrMsg(err) {
  let type = typeof err
  let errmsg
  if (err) {
    if (type === 'string') {
      errmsg = err
    } else {
      errmsg = err.toString()
    }
  }
  return errmsg
}

export function reqErrNotify(err) {
  notification.error({
    message: '请求错误：',
    description: getErrMsg(err)
  })
}

export function uploadErrNotify(err) {
  notification.error({
    message: '上传文件错误：',
    description: getErrMsg(err)
  })
}
