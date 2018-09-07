import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import { Layout, Icon, message, Menu } from 'antd'
import { BrowserRouter, Route, hashHistory, Switch, Redirect, Link } from 'react-router-dom'
import { ContainerQuery } from 'react-container-query'
import DocumentTitle from 'react-document-title'
import classNames from 'classnames'
import NotFound from '../routes/Exception/404'
import { getRoutes, getRoutesExtension } from '../utils/utils'
import { getMenuData } from '../common/menu'
import SiderMenu from 'Components/SiderMenu/'
import GlobalHeader from 'Components/GlobalHeader'
import { enquireScreen, unenquireScreen } from 'enquire-js'
import './BasicLayout.less'
import logo from '../assets/logo.svg'
// import Authorized from '../utils/Authorized'
const { Header, Sider, Content } = Layout
// const { AuthorizedRoute, check } = Authorized
const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
  },
}

/**
 * 根据菜单取得重定向地址.
 */
const redirectData = []
const getRedirect = item => {
  if (item && item.children) {
    if (item.children[0] && item.children[0].path) {
      redirectData.push({
        from: `${item.path}`,
        to: `${item.children[0].path}`,
      })
      item.children.forEach(children => {
        getRedirect(children)
      })
    }
  }
}
getMenuData().forEach(getRedirect)

/**
 * 获取面包屑映射
 * @param {Object} menuData 菜单配置
 * @param {Object} routerData 路由配置
 */
const getBreadcrumbNameMap = (menuData, routerData) => {
  const result = {}
  const childResult = {}
  for (const i of menuData) {
    if (!routerData[i.path]) {
      result[i.path] = i
    }
    if (i.children) {
      Object.assign(childResult, getBreadcrumbNameMap(i.children, routerData))
    }
  }
  return Object.assign({}, routerData, result, childResult)
}

export default class BasicLayout extends React.PureComponent {
  state = {
    collapsed: false,
    isMobile: false
  };
  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object,
  };
  getChildContext() {
    const { location, routerData } = this.props
    return {
      location,
      breadcrumbNameMap: getBreadcrumbNameMap(getMenuData(), routerData),
    }
  }

  componentDidMount() {
    this.enquireHandler = enquireScreen(mobile => {
      this.setState({
        isMobile: mobile,
      })
    })
  }
  componentWillUnmount() {
    // 判断是否为手机
    unenquireScreen(this.enquireHandler)
  }
  getPageTitle() {
    const { routerData, location } = this.props
    const { pathname } = location
    let title = '招采管理系统'
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - 招采管理系统`
    }
    return title
  }
  getBashRedirect = () => {
    // According to the url parameter to redirect
    // 这里是重定向的,重定向到 url 的 redirect 参数所示地址
    const urlParams = new URL(window.location.href)

    const redirect = urlParams.searchParams.get('redirect')
    // Remove the parameters in the url
    if (redirect) {
      urlParams.searchParams.delete('redirect')
      window.history.replaceState(null, 'redirect', urlParams.href)
    } else {
      const { routerData } = this.props
      // get the first authorized route path in routerData
      // const authorizedPath = Object.keys(routerData).find(
      //   item => check(routerData[item].authority, item) && item !== '/'
      // )
      // return authorizedPath
      return '/project/notice/list'
    }
    return redirect
  };
  handleMenuCollapse = collapsed => {
    this.setState({
      collapsed: !this.state.collapsed,
    })
  };

  render() {
    const {
      fetchingNotices,
      notices,
      routerData,
      match,
      location,
    } = this.props

    const currentUser = {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    }
    const { collapsed } = this.state
    const menus = getMenuData()
    const bashRedirect = this.getBashRedirect()
    function getExtensionRoute() {
      let routeArr = getRoutesExtension(match.path, routerData).map(item => {
        const a = (
          <Route key={item.key}
            path={item.path}
            component={item.component}
            exact
          />

        )
        
        return a
      })
      // let routeClip
      // routeArr.forEach(v => {
      //   routeClip += v
      // })
      // return routeClip
      return routeArr
    }
    let layout = (
      <Layout>
        <SiderMenu
          menuData={getMenuData()}
          collapsed={collapsed}
          location={location}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout >
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              currentUser={currentUser}
              fetchingNotices={fetchingNotices}
              notices={notices}
              collapsed={collapsed}
              isMobile={this.state.isMobile}
              onNoticeClear={this.handleNoticeClear}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
              onNoticeVisibleChange={this.handleNoticeVisibleChange}
            />
          </Header>
          <Content style={{ margin: '24px 16px', padding: 24, background: '#fff', minHeight: '100vh' }}>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from='/' to={bashRedirect} />
              <Route render={NotFound} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    )

    return (
      <DocumentTitle title={this.getPageTitle()}>
        <ContainerQuery query={query}>
          {params => {
            return <div className={classNames(params)}>{layout}</div>
          }}
        </ContainerQuery>
      </DocumentTitle>
    )
  }
}
