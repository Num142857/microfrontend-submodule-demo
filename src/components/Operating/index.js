import React, { Component, createElement } from 'react'
import PropTypes from 'prop-types'
import { Button, Icon } from 'antd'
import classNames from 'classnames'
import './index.less'

export default class Operating extends Component {
  static contextTypes = {};
  state = {
    buttonData: this.props.buttonData,
    buttonShow: false
  };
  componentDidMount() {}
  componentWillReceiveProps() {}
  handleBtnHover(item, index) {
    let state = this.state.buttonData
    state[index].active = true
    this.setState({ buttonData: state })
  }
  handleBtnOut(item, index) {
    let state = this.state.buttonData
    state[index].active = false
    this.setState({ buttonData: state })
  }
  operatingHover() {
    this.setState({ buttonShow: true })
  }
  operatingOut() {
    this.setState({ buttonShow: false })
  }
  render() {
    let buttons = <Button.Group size='small'>
      {this.state.buttonData.map((item, index) => (
        <Button key={index} onClick={item.callback} onMouseOut={() => this.handleBtnOut(item, index)} onMouseOver={() => this.handleBtnHover(item, index)} type={item.active ? 'primary' : null}>
          {item.active ? <span>{item.name}</span> : <Icon type={item.icon} />}
        </Button>
      ))}
    </Button.Group>
    return (
      <div className='operating' onMouseEnter={() => this.operatingHover()} onMouseLeave={() => this.operatingOut()}>
        <span>...</span>
        <div className='ant-btn-group-box' style={{ minWidth: this.state.buttonData.length * 40, marginTop: 14 }}>
          {this.state.buttonShow ? buttons : null}
        </div>
      </div>
    )
  }
}
