const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageApi: {
      pageIndex: 0,
      pageSize: 8,
      id: '',
      settlementStatus: ''
    },
    list: [],
    loading: true,
    navIndex: '',
    navData: [{
      id: '',
      name: '全部'
    }, {
      id: '1',
      name: '未结算'
    }, {
      id: '2',
      name: '已结算'
    }]
  },
  //  切换状态
  switchNav(e){
    let id = e.currentTarget.dataset.item.id;
    this.setData({
      navIndex: id,
      'pageApi.settlementStatus': id,
      list: [],
      loading: true,
      'pageApi.pageIndex': 0
    })
    this.getList();
  },
  searchIput(e){
    this.setData({
      'pageApi.id': e.detail.value,
      list: [],
      loading: true,
      'pageApi.pageIndex': 0
    })
    this.getList();
  },
  getList() {
    let that = this;
    if (!that.data.loading) return;
      that.setData({
        'pageApi.pageIndex': that.data.pageApi.pageIndex + 1
      })
      app.api.settlementPage(this.data.pageApi).then(res => {
        if (res.code === 1000) {
          res.data.data.forEach(el => {
            el.cTime = app.utils.dateformat(el.updateTime, 'yyyy-MM-dd');
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
  goDetail(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/order/detail/index?id=' + item.id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList();
  },
    /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.loading) this.getList();
  }
})