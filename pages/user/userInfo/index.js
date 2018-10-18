// pages/user/userInfo/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const that = this;
    const getUser = wx.getStorageSync('user');
    that.setData({
      userInfo: Object.assign({}, getUser)
    })
  }
})