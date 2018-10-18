// pages/order/index/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageApi: {
      pageIndex: 0,
      pageSize: 8,
      id: '',
      orderStatus: 1
    },
    cancelApi: {
      id: '',
      cancelReason: ''
    },
    cancelShow: false,
    list: [],
    loading: true,
    tabIndex: 1,
    tabNav: [{
      id: 1,
      name: '待发货',
      icon: '../../../static/images/order-icon-status1.png'
    }, {
      id: 2,
      name: '待收货',
      icon: '../../../static/images/order-icon-status2.png'
    }, {
      id: 3,
      name: '已完成',
      icon: '../../../static/images/order-icon-status3.png'
    }, {
      id: 4,
      name: '已取消',
      icon: '../../../static/images/order-icon-status4.png'
    }]
  },
  getList() {
    let that = this;
    if (!that.data.loading) return;
    that.setData({
      'pageApi.pageIndex': that.data.pageApi.pageIndex + 1
    })
    app.api.orderPage(this.data.pageApi).then(res => {
      if (res.code === 1000) {
        res.data.data.forEach(el => {
          el.ctime = app.utils.dateformat(el.createTime);
          el.status = Number(el.status)
        })
        if (res.data.data.length < that.data.pageApi.pageSize) {
          that.setData({
            loading: false,
          })
        }
        that.setData({
          list: that.data.list.concat(res.data.data)
        })
      }
    })
  },
  switchNav(e) {
    const tab = e.currentTarget.dataset.index;
    if (tab != this.data.tabIndex) {
      this.setData({
        tabIndex: tab,
        list: [],
        loading: true,
        'pageApi.orderStatus': tab,
        'pageApi.pageIndex': 0
      })
      this.getList();
    }
  },
  cancelOrder(e) {
    let that = this;
    let id = e.currentTarget.dataset.orderId;
    that.setData({
      cancelShow: !that.data.cancelShow,
      'cancelApi.id': id
    })
  },
  cancelOk(id) {
    let that = this;
    let params = JSON.parse(JSON.stringify(this.data.cancelApi));
    if (params.cancelReason != ''){
      app.api.orderCancel(params).then(res => {
        if (res.code === 1000) {
          this.setData({
            loading: true,
            list: [],
            cancelShow: !that.data.cancelShow,
            'cancelApi.cancelReason': '',
            'pageApi.pageIndex': 0
          })
          this.getList();
        } else {
          wx.showToast({
            title: res.message,
            icon: 'none'
          })
        }
      })
    }else{
      wx.showToast({
        title: '请填写取消原因',
        icon: 'none'
      })
    }
  },
  cancelClose(id) {
    let that = this;
    that.setData({
      cancelShow: !that.data.cancelShow,
      'cancelApi.cancelReason': ''
    })
  },
  reasonIpu(e){
    this.setData({
      'cancelApi.cancelReason':e.detail.value
    })
  },
  goDetail(e){
    let id = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '/pages/order/detail/index?id=' + id,
    })
  },
  orderAgain(e){
    let id = e.currentTarget.dataset.orderId;
    wx.navigateTo({
      url: '/pages/order/submitOrder/index?id=' + id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getList();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    if (this.data.loading) this.getList();
  }
})