
// xss 及 entities 处理
import xss from 'xss'
import { AllHtmlEntities as Entities } from 'html-entities'
const entities = new Entities()

export function xssAnddecodeEntity(str) {
  return xss(entities.decode(str))
}

/**
 * 递归遍历，对 `string` 类型的值进行 decode entities 及 xss 处理
 * @param {Object | Array} entitiesData
 */
export default function xssAndDecodeEntities(entitiesData) {
  let dataType = Object.prototype.toString.call(entitiesData)
  if (dataType === '[object Object]') {
    let keys = Object.keys(entitiesData)
    keys.forEach(key => {
      let data = entitiesData[key]
      if (typeof data === 'string') {
        entitiesData[key] = xssAnddecodeEntity(data)
      } else {
        xssAndDecodeEntities(data)
      }
    })
  } else if (dataType === '[object Array]') {
    entitiesData.forEach((data, index) => {
      if (typeof data === 'string') {
        entitiesData[index] = xssAnddecodeEntity(data)
      } else {
        xssAndDecodeEntities(data)
      }
    })
  }
  return entitiesData
}
