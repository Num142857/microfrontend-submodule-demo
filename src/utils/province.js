const getProvince = (data, id) => {
  let province
  data.forEach(element => {
    if (element.children) {
      element.children.forEach(city => {
        if (city.value === id) {
          province = city.parentValue
        }
      })
    }
  })
  return province
}
export { getProvince }
