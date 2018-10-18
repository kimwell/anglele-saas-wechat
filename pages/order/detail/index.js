// pages/order/detail/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    item:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let id = options.id;
    app.api.findOneOrder({id: id}).then(res =>{
      if(res.code === 1000){
        res.data.order.cTime = app.utils.dateformat(res.data.order.createTime);
        res.data.order.status = Number(res.data.order.status)
        that.setData({
          item: Object.assign({},res.data)
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})