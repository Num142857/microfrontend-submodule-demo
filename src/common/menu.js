import { isUrl } from '../utils/utils'
let menuData = [
  {
    name: '模块1',
    icon: 'table',
    path: 'module1',
    rank: 1,
    children: [
      {
        name: 'Page1',
        path: 'page1',
      },
      {
        name: 'Page2',
        path: 'page2',
      },
      {
        name: 'Page3',
        path: 'page3',
      },
    ],
  }
]
let originParentPath = '/'
function formatter(data, parentPath = originParentPath, parentAuthority) {
  return data.map(item => {
    let { path } = item
    if (!isUrl(path)) {
      path = parentPath + item.path
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    }
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority)
    }
    return result
  })
}

export const getMenuData = () => formatter(menuData)
export default menuData
