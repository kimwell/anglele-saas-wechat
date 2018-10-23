const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    cartItem: [],
    totalPrice: 0,
    orderApi: {
      remark: '',
      items: []
    },
    canOrder: false,
    isAgain: false // 是否再次购买进来的
  },
  //  计算订单总价
  allPrice() {
    let price = 0;
    this.data.cartItem.forEach(item => {
      price += Number(item.totalPrice);
    })
    this.setData({
      totalPrice: price.toFixed(2)
    })
  },
  remarkArea(e) {
    this.setData({
      'orderApi.remark': e.detail.value
    })
  },
  submitOrder() {
    if (this.data.canOrder) {
      let orderArr = [];
      this.data.cartItem.map(el => {
        let order = {
          productId: '',
          num: null
        }
        order.productId = el.id;
        if (this.data.isAgain) {
          order.productId = el.productId
        }
        order.num = el.num;
        orderArr.push(order)
      })
      this.setData({
        'orderApi.items': orderArr
      })
      let params = JSON.parse(JSON.stringify(this.data.orderApi))
      params.items = JSON.stringify(params.items)
      app.api.saveOwnOrder(params).then(res => {
        if (res.code === 1000) {
          if (!this.data.isAgain) {
            wx.removeStorageSync('cartItem')
          }
          wx.navigateTo({
            url: '/pages/order/orderSuccess/index',
          })
        } else {
          wx.showModal({
            content: res.message,
            icon: 'none',
            showCancel: false
          })
        }
      })
    } else {
      wx.showModal({
        content: '商家暂停接单,如需下单请联系商家',
        icon: 'none',
        showCancel: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    const that = this;
    const getUser = wx.getStorageSync('user');
    that.setData({
      userInfo: Object.assign({}, getUser),
    })
    app.api.isOrder().then(res => {
      if (res.code === 1000) {
        this.setData({
          canOrder: res.data
        })
        if (!res.data) {
          wx.showModal({
            content: '商家暂停接单,如需下单请联系商家',
            icon: 'none',
            showCancel: false
          })
        }
      }
    })
    if (options.id) {
      this.setData({
        isAgain: options.id ? true : false
      })
      app.api.copyOrder({
        id: options.id
      }).then(res => {
        if (res.code == 1000) {
          that.setData({
            cartItem: res.data.orderItems,
            totalPrice: res.data.amount
          })
        }
      })
    } else {
      const cartItem = wx.getStorageSync('cartItem')
      that.setData({
        cartItem: cartItem
      })
      this.allPrice();
    }
  }
})