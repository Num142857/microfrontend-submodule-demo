/* eslint-disable */
export function isObjectKeysNoValue(obj) {
  let result = true
  Object.keys(obj).forEach(v => {
    if (obj[v] != undefined) result = false
  })
  return result
}
