import React from 'react'
import ReactDOM from 'react-dom'
import singleSpaReact from 'single-spa-react'
import registerServiceWorker from './registerServiceWorker'
import RootComponent from './root.component'
import { storeInstance, history } from './Store'
import './index.less'

if (process.env.NODE_ENV === 'development' && !MICRO) {
  // 开发环境这样处理
  ReactDOM.render(<RootComponent history={history} store={storeInstance} globalEventDistributor={storeInstance} />, document.getElementById('root'))
}

const reactLifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: (spa) => {
    return <RootComponent history={spa.customProps.store.history} store={spa.customProps.store.storeInstance} globalEventDistributor={spa.customProps.globalEventDistributor} />
  },
  // 可能会有加载顺序的问题
  domElementGetter
})
function domElementGetter() {
  let el = document.getElementById('sub-module-page')
  if (!el) {
    el = document.createElement('div')
    el.id = 'sub-module-page'
  }
  let timer = null
  timer = setInterval(() => {
    if (document.querySelector('.ant-layout-content #sub-module')) {
      document.querySelector('.ant-layout-content #sub-module').appendChild(el)
      clearInterval(timer)
    }
  }, 100)

  return el
}

export const bootstrap = [
  reactLifecycles.bootstrap,
]

export const mount = [
  reactLifecycles.mount,
]

export const unmount = [
  reactLifecycles.unmount,
]

registerServiceWorker()
