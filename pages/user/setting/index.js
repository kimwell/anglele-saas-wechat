// pages/user/setting/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  loginOut() {
    wx.showModal({
      title: '退出登录',
      content: '确认退出登录？',
      success: function (res) {
        if (res.confirm) {
          wx.removeStorageSync('authorization');
          wx.removeStorageSync('user');
          wx.removeStorageSync('cartItem');
          wx.reLaunch({
            url: '/pages/login/index',
          })
        }
      }
    })
  },
})