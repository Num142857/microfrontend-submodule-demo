import React, { Component } from 'react'
import { Route, Redirect, Switch } from 'react-router-dom'
import { getRoutes } from '../../utils/utils'
import Demo from 'Components/Demo'
export default class Notice extends Component {
    state={}
    render() {
      let { match, routerData } = this.props
      // let routerData = getRouterData()
      return (
        <Demo type='2' />
      )
    }
}
