import React from 'react'
import { Link } from 'react-router-dom'
import PageHeader from '../components/PageHeader'
import './PageHeaderLayout.less'
var wrapperStyle = {}
// if (process.env.NODE_ENV === 'production') {
//   wrapperStyle = { 'margin': '-24px -24px 0px' }
// }
export default ({ children, wrapperClassName, top, ...restProps }) => (
  <div style={wrapperStyle} className={wrapperClassName}>
    {top}
    <PageHeader key='pageheader' {...restProps} linkElement={Link} />
    {children ? <div className='page-content'>{children}</div> : null}
  </div>
)
