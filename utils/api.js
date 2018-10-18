// export const URI = 'https://192.168.0.252'
const URI = 'https://saas.anglele.com'
const fetch = require('./fetch')

/**
 * 数据获取公共封装
 */
function fetchApi(path, params) {
  return fetch(URI, path, params)
}


/** =====================登录接口======================== */

/**
 * 登录
 * 
 */
export const login = (params) => {
  return fetchApi('api/login', params).then(res => res.data)
}

/**
 * 查询当前登录人信息
 * 
 */
export const findCurrentUser = () => {
  return fetchApi('auth/baseuser/findCurrentUser').then(res => res.data)
}

/**
 * 查询商户所有上架产品
 * 
 */
export const findAllProduct = (params) => {
  return fetchApi('sys/product/findAllProduct', params).then(res => res.data)
}

/**
 * 订单分页-移动端
 * 
 */
export const orderPage = (params) => {
  return fetchApi('api/order/page', params).then(res => res.data)
}


/**
 * 取消订单
 * 
 */
export const orderCancel = (params) => {
  return fetchApi('sys/order/cancel', params).then(res => res.data)
}


/**
 * 单个订单-移动端
 * 
 */
export const findOneOrder = (params) => {
  return fetchApi('api/order/findOneOrder', params).then(res => res.data)
}

/**
 * 修改密码
 * 
 */
export const changePass = (params) => {
  return fetchApi('api/changePass', params).then(res => res.data)
}


/**
 * 结算列表
 * 
 */
export const settlementPage = (params) => {
  return fetchApi('api/order/settlementPageChange', params).then(res => res.data)
}


/**
 * 结算列表
 * 
 */
export const saveOwnOrder = (params) => {
  return fetchApi('api/order/saveOwnOrder', params).then(res => res.data)
}


/**
 * 是否能够下单
 * 
 */
export const isOrder = () => {
  return fetchApi('api/order/isOrder').then(res => res.data)
}