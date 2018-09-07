
import React from 'react'
import { Provider } from 'react-redux'
import BasicLayout from './layouts/BasicLayout'
import { BrowserRouter, Route, Router, Switch } from 'react-router-dom'
import { getRouterData } from './common/router'
import { LocaleProvider } from 'antd'
import zh_CN from 'antd/lib/locale-provider/zh_CN' // eslint-disable-line
import 'moment/locale/zh-cn'
const zhCN = zh_CN // eslint-disable-line
export default class RootComponent extends React.Component {
  state = { store: this.props.store, globalEventDistributor: this.props.globalEventDistributor };

  async componentWillMount() {
    let previousPath = ''
    this.props.history.listen((location, action) => {
      if (previousPath === location.pathname) return

      // 记录一下
      previousPath = location.pathname
      // 当本项目发生push的时候,才开始通知其他项目页面需要跳转
      if (action === 'PUSH') { this.props.globalEventDistributor.dispatch({ type: 'to', path: location.pathname }) }
    })
  }

  setStore(store) {
    this.setState({ ...this.state, store: store })
  }

  setGlobalEventDistributor(globalEventDistributor) {
    this.setState({ ...this.state, globalEventDistributor: globalEventDistributor })
  }

  render() {
    let ret = <div></div>
    const routerData = getRouterData()
    let customProps = { routerData: routerData, globalEventDistributor: this.state.globalEventDistributor }
    if (this.state.store && this.state.globalEventDistributor) {
      ret = <Provider store={this.state.store}>
        <LocaleProvider locale={zhCN}>
          <Router history={this.props.history}>
            <Switch>
              <Route render={props => <BasicLayout {...customProps} {...props} />} />
            </Switch>
          </Router>
        </LocaleProvider>
      </Provider>
    }
    return ret
  }
}
