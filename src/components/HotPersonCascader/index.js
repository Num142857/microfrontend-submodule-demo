import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Input } from 'antd'
import style from './style.less'
import { post } from 'Util/request'
import cs from 'classnames'
import Highlight from 'react-highlighter'
let timer = null
const loop = function () { }
class HotPersonCascader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      value: this.props.value || this.defaultValue || '',
      inputResult: [],
      // currentSelect: null,
      showMenu: false,
      currentPage: 1,
      totalPage: 0
    }
  }
  static propTypes = {
    /**
     * 默认值：组件的初始值，非受控时设置初值使用
     */
    defaultValue: PropTypes.string,
    /**
     * 组件的值
     */
    value: PropTypes.string,
    /**
     * onChange事件,透出两个参数: Func [value: string, empDetail: obj] (value为empName, empDetail包含empName,empNumber,empId)
     */
    onChange: PropTypes.func
  }
  static defaultProps = {
    onChange: loop
  }
  componentWillReceiveProps(nextProps) {
    const { value } = nextProps
    if (value !== undefined && value !== this.state.value) {
      this.setState({
        value
      })
    }
  }

  // componentWillMount() {
  //   document.addEventListener('click', this.InputBlur)
  // }
  // componentWillUnmount() {
  //   document.removeEventListener('click', this.InputBlur)
  // }
  // eventInputBlur = this.InputBlur.bind(this, event)
  prev = async () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    let currentPage = this.state.currentPage
    currentPage--
    if (currentPage < 1) {
      currentPage = 1
      return
    }
    let dataRes = await this.fetchData(this.state.value, currentPage)
  }
  next = async () => {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId)
    }
    let currentPage = this.state.currentPage
    currentPage++
    if (currentPage > this.state.totalPage) {
      currentPage = this.state.totalPage
      return
    }
    let dataRes = await this.fetchData(this.state.value, currentPage)
    if (dataRes) {
      this.setState({ currentPage })
    }
  }
  async fetchData(value = this.state.value, currentPage = this.state.currentPage, showMenu = true) {
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = setTimeout(async () => {
      let res = await post('/bidding/data/empList', {
        'empNameLike': value,
        'pageSize': 5,
        'pageNo': currentPage,
        // loadOrgUnitPath: true,
        loadPosition: true
      })
      if (res.code === 0) {
        this.setState({
          showMenu: showMenu,
          inputResult: res.data.data,
          currentPage,
          totalPage: res.data.pages
        })
      }
    }, 500)
  }

  inputChange = (e) => {
    let empName = e.target.value
    if (!empName) {
      this.setState({
        showMenu: false,
        inputResult: []
      })
    } else {
      this.fetchData(empName, 1)
    }
    const { value, onChange } = this.props
    if (value !== undefined) { // 受控下
      onChange(empName, {
        empName
      })
      return
    } else { // 非受控
      this.setState({
        value
      })
      onChange(empName, {
        empName
      })
    }
  }
  async optionSelect(item, e) {
    const { value, onChange } = this.props
    let detail = {
      empName: item.empName,
      empNumber: item.empNumber,
      empId: item.empId
    }
    await this.fetchData(item.empName, 1, false)
    if (value !== undefined) { // 受控
      this.setState({
        showMenu: false
      })
      onChange(item.empName, detail)
    } else {
      this.setState({
        value: item.empName,
        // currentSelect: item,
        inputResult: [],
        showMenu: false
      })
      onChange(item.empName, detail)
    }
  }
  inputBlur = () => {
    this.timeoutId = setTimeout((params) => {
      this.setState({
        showMenu: false
      })
    }, 300)
  }
  onFocus = () => {
    if (this.state.inputResult.length) {
      this.setState({
        showMenu: true
      })
    }
  }
  render() {
    const { value, currentSelect } = this.state

    return <span onClick={event => event.nativeEvent.stopImmediatePropagation()}>
      <Input value={value}
        onBlur={this.inputBlur}
        onFocus={this.onFocus}
        onChange={this.inputChange} ref={(ref) => { this.input = ref }} disabled={this.props.disabled}
      />
      {this.state.showMenu ? <div className={cs('hot-cascader-menus')}>
        <ul>
          {this.state.inputResult.map((item, i) => {
            return this.props.id === 'managerId' ? <li key={i} onClick={this.optionSelect.bind(this, item)}> <Highlight key={i} search={this.state.value}>{` ${item.empName} / ${item.positionName} / ${item.deptName} / ${item.companyName}`}</Highlight></li> : <li key={i} onClick={this.optionSelect.bind(this, item)}> <Highlight key={i} search={this.state.value}>{` ${item.empName} / ${item.positionName} `}</Highlight></li>
          })}
          {this.state.inputResult.length === 0
            ? <li>没有搜索到相关内容</li> : null}
          {this.state.inputResult.length !== 0
            ? <li className={style['menu-footer']}>
              <a onClick={this.prev}>上一页</a>
              <span> {this.state.currentPage} / {this.state.totalPage} </span>
              <a onClick={this.next}>下一页</a>
            </li> : null}
        </ul>
      </div> : null}
    </span>
  }
}
export default HotPersonCascader
