/**
 * WeChat API 模块
 * @type {Object}
 * 用于将微信官方`API`封装为`Promise`方式
 * > 小程序支持以`CommonJS`规范组织代码结构
 */
const wechat = require('./utils/wechat.js')

/**

 *  API 模块
 * @type {Object}
 */

const api = require('./utils/api.js')
const utils = require('./utils/util.js')


//app.js
App({
  wechat: wechat,
  api: api,
  utils: utils,
  formIds: [],
  userInfo: {},
  buserInfo: {},
})

const app = getApp();

