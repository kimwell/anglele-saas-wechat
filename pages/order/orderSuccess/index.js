// pages/order/orderSuccess/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  goRouter(e) {
    let route = e.currentTarget.dataset.router;
    if (route === 'index') {
      wx.reLaunch({
        url: '/pages/index/index',
      })
    } else {
      wx.reLaunch({
        url: '/pages/order/index/index',
      })
    }
  }
})