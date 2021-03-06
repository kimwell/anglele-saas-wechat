/**
 * 网络请求API接口
 * @param  {String} api    api 根地址
 * @param  {String} path   请求路径
 * @param  {Objece} params 参数
 * @return {Promise}       包含抓取任务的Promise
 */
module.exports = function (api, path, params) {
  // wx.showLoading({
  //   title: "加载中"
  // });
  // console.log(`${api}/${path}`);
  // console.log(params);
  return new Promise((resolve, reject) => {
    const header = {
      "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      "authorization": wx.getStorageSync('authorization') || ''
    }
    wx.request({
      url: `${api}/${path}`,
      data: Object.assign({}, params), //如果这里需要合并签名时间戳参数时候可以这么写
      method: 'POST',
      header: header,
      success: function (res) {
        // wx.hideLoading();
        if (res.data.code === 403) {
          wx.removeStorageSync('authorization');
          wx.removeStorageSync('user');
          wx.showModal({
            title: '提示',
            content: '登录过期，请重新登录。',
            showCancel: false,
            success: (res) => {
              if (res.confirm) {
                wx.removeStorageSync('authorization');
                // 当前页面
                let pages = getCurrentPages();
                let nowPage = pages[pages.length - 1];
                wx.reLaunch({
                  url: '/pages/login/index?redirect=' + nowPage.route
                })
              }
            }
          })
        }
        resolve(res);
      },
      fail: function (err) {
        // wx.hideLoading();
        reject(err);
      }
    });
  });
};