const app = getApp();
var util = require('../../utils/md5.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    errorMsg: false,
    msg: ''
  },
  formSubmit(e) {
    let user = e.detail.value.user;
    let password = e.detail.value.password;
    if (user != '' && password != '') {
      let params = {
        userName: user,
        password: util.hexMD5(password),
        roleCode: 'CUSTOMER'
      }
      app.api.login(params).then(res => {
        if (res.code === 1000) {
          // 同步方式存储表单数据
          wx.setStorageSync('authorization', res.data.token);
          wx.setStorageSync('user', res.data.user);
          //跳转到成功页面
          wx.reLaunch({
            url: '/pages/index/index'
          })
        } else {
          wx.showModal({
            content: res.message,
            icon:'none'
          })
        }
      })
    } else {
      wx.showModal({
        content: '手机号码或密码不能为空',
        icon: 'none'
      })
    }
  }
})