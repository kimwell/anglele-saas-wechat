//index.js
const app = getApp()

Page({
  data: {
    list: [],
    scrollTop: 0,
    clientHeight: 0,
    bHeiht: 0,
    searchHeight: 0,
    scrollY: true,
    value1: 0,
    selectIndex: 0,
    userInfo: {},
    toView: 'goods0',
    typeHeight: 0,
    goodHeight: 0,
    cartHeight: 0,
    goodsTitleHeight: 0,
    allPrice: 0,
    cartItem: [], //购物车列表
    totalNum: 0,
    showCover: false,
    canOrder: true, // 商家设置下单时间是否可以下单
    isFirst: true,
    searchList: [],
    searchVal: '',
    searchResult: [],
  },
  //  搜索
  searchInpt(e) {
    const val = e.detail.value;
    this.setData({
      searchVal: val
    })
    this.fuzzyQuery(this.data.searchList, val)
  },
  // 搜索产品
  bindconfirm(e) {
    const val = e.detail.value || '';
    this.setData({
      searchVal: val
    })
    this.fuzzyQuery(this.data.searchList, val)
  },
  bindSearch(){
    this.fuzzyQuery(this.data.searchList, this.data.searchVal)
  },
  //  模糊搜索产品
  fuzzyQuery(list, keyWord) {
    if (keyWord){
      var arr = [];
      for (var i = 0; i < list.length; i++) {
        if (list[i].name.indexOf(keyWord) >= 0) {
          arr.push(list[i]);
        }
      }
      this.setData({
        searchResult: arr
      })
    }else{
      this.setData({
        searchResult: []
      })
    }
  },
  //  清除搜索
  clearSearch(){
    this.setData({
      searchVal: '',
      searchResult: []
    })
  },
  //  获取商品列表
  getList() {
    const businessId = this.data.userInfo.extraInfo.business.id;
    if (businessId == '') return
    app.api.findAllProduct({
      businessId: businessId
    }).then(res => {
      if (res.code === 1000) {
        const lists = res.data.map((el, index) => {
          el.viewId = 'goods' + index
          el.products.map(sub => {
            sub.num = 0;
            sub.totalPrice = 0;
            sub.productId = sub.id;
            return sub;
          })
          return el;
        });
        const searchArr = [];
        res.data.map(el => {
          el.products.map(sub => {
            searchArr.push(sub)
          })
        })
        this.setData({
          searchList: searchArr,
          list: lists
        })
        this.setItemNum();
      }
    })
  },
  //  滚动产品
  goodsScroll(e) {
    let that = this;
    let typeCount = that.data.list.length;
    let heightList = [0];
    let curHeight = 0;
    this.data.list.forEach((item) => {
      curHeight += this.data.goodsTitleHeight + (item.products.length * this.data.goodHeight);
      heightList.push(curHeight);
    });
    for (let i = 0; i < heightList.length; i++) {
      if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
        this.setData({
          selectIndex: i
        });
      }
    }
    // that.setData({
    //   scrollTop: e.detail.scrollTop + that.data.bHeiht
    // })
  },
  //  分类切换
  switchNav(e) {
    const index = e.currentTarget.dataset.index;
    this.setData({
      selectIndex: index,
      toView: 'goods' + index
    })
  },
  showCoverCart() {
    if (this.data.cartItem.length) {
      this.setData({
        showCover: !this.data.showCover
      })
    }
  },
  //  隐藏浮动购物车
  hideCover() {
    this.setData({
      showCover: !this.data.showCover
    })
  },
  // 商品数量加减
  handleChange(e) {
    var that = this;
    var types = e.detail.type;
    var val = e.detail.value != '' ? e.detail.value : 0;
    var froms = e.currentTarget.dataset.froms;
    var item = e.currentTarget.dataset.item;
    var pIndex = 0;
    var sIndex = 0;
    if (froms === 'search'){
      var searchIndex = e.currentTarget.dataset.subindex;
      that.data.list.map((el,index) =>{
        el.products.map((sub,sIdx) =>{
          if(sub.id === item.id){
            pIndex = index;
            sIndex = sIdx
          }
        })
      })
      var plusNum = 'searchResult[' + searchIndex + '].num';
      this.setData({
        [plusNum]: e.detail.value
      })
      var totalPrice = 'searchResult[' + searchIndex + '].totalPrice';
      this.setData({
        [totalPrice]: (this.data.searchResult[searchIndex].num * this.data.searchResult[searchIndex].price).toFixed(2)
      })
    }else{
      pIndex = e.currentTarget.dataset.index;
      sIndex = e.currentTarget.dataset.subindex;
    }
    var plusNum = 'list[' + pIndex + '].products[' + sIndex + '].num';
    this.setData({
      [plusNum]: e.detail.value
    })
    var totalPrice = 'list[' + pIndex + '].products[' + sIndex + '].totalPrice';
    this.setData({
      [totalPrice]: (this.data.list[pIndex].products[sIndex].num * this.data.list[pIndex].products[sIndex].price).toFixed(2)
    })
    this.handleAllPrice();
    this.addCart(e, val);
  },
  //  清空购物车
  clearCart() {
    const that = this;
    wx.showModal({
      title: '清除购物车',
      content: '确定清除购物车？',
      success: function (res) {
        if (res.confirm) {
          that.setData({
            cartItem: [],
            showCover: !that.data.showCover
          })
          that.clearNum();
          wx.removeStorageSync('cartItem')
        }
      }
    })
  },
  // 重置所有勾选数量为0
  clearNum() {
    let that = this;
    const lists = that.data.list;
    lists.forEach(item => {
      item.products.forEach(el => {
        el.num = 0;
        el.totalPrice = 0;
      })
    })
    that.setData({
      list: lists,
      allPrice: 0
    })
    that.totalNum();
    this.handleAllPrice();
  },
  //  添加、移除购物车
  addCart(e, num) {
    let item = e.currentTarget.dataset.item;
    let cartItem = this.data.cartItem;
    let res = [];
    if (cartItem.length) {
      res = cartItem.filter(el => {
        return el.id !== item.id;
      })
    }
    if (num !== 0) {
      res.push(item);
    }
    this.setData({
      cartItem: res
    })
    this.totalNum();
    this.setStorage();
    //  弹框列表为空时隐藏
    if (cartItem.length === 1 && num === 0) {
      if (this.data.showCover) {
        this.setData({
          showCover: false
        })
      }
    }
  },
  //  已选中商品总数量
  totalNum() {
    this.setData({
      totalNum: this.data.cartItem.length
    })
  },
  //  已选中存在localStorange
  setStorage() {
    wx.setStorageSync('cartItem', this.data.cartItem);
  },
  //  已加入购物车的数量回显
  setItemNum() {
    const cartItem = wx.getStorageSync('cartItem') || [];
    let lists = this.data.list;
    if (cartItem.length) {
      cartItem.forEach(item => {
        lists.forEach(subItem => {
          subItem.products.forEach(el => {
            if (item.id === el.id) {
              el.num = item.num;
              el.totalPrice = item.totalPrice
            }
          })
        })
      })
      this.setData({
        list: lists
      })
      this.handleAllPrice();
    }
  },
  //  总价
  handleAllPrice() {
    let price = 0;
    this.data.list.forEach(item => {
      item.products.forEach(el => {
        price += Number(el.totalPrice);
      })
    })
    this.setData({
      allPrice: price.toFixed(2)
    })
  },
  //  提交订单
  confirmOrder() {
    if (this.data.canOrder) {
      if (this.data.cartItem.length) {
        wx.navigateTo({
          url: '/pages/order/submitOrder/index',
        })
      } else {
        wx.showModal({
          content: '请选择商品',
          icon: 'none',
          showCancel: false
        })
      }
    } else {
      wx.showModal({
        content: '商家暂停接单,如需下单请联系商家',
        icon: 'none',
        showCancel: false
      })
    }
  },
  canOrder() {
    app.api.isOrder().then(res => {
      if (res.code === 1000) {
        if (!res.data) {
          if (this.data.isFirst) {
            this.setData({
              isFirst: false
            })
            wx.showModal({
              content: '商家暂停接单,如需下单请联系商家',
              icon: 'none',
              showCancel: false
            })
          }
        }
        this.setData({
          canOrder: res.data
        })
      }
    })
  },
  onShow: function () {
    this.canOrder();
  },
  onLoad: function () {
    const that = this;
    const getUser = wx.getStorageSync('user');
    if (!getUser) {
      wx.reLaunch({
        url: '/pages/login/index',
      })
      return false;
    }
    const cart = wx.getStorageSync('cartItem') || [];
    that.setData({
      userInfo: Object.assign({}, getUser),
      cartItem: cart
    })
    that.getList();
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight,
          bHeiht: res.windowWidth / 750 * 260,
          typeHeight: res.windowWidth / 750 * 100,
          goodHeight: res.windowWidth / 750 * 210,
          cartHeight: res.windowWidth / 750 * 80,
          goodsTitleHeight: res.windowWidth / 750 * 50,
          searchHeight: res.windowWidth / 750 * 100
        });
      }
    })
    that.totalNum();
    that.handleAllPrice();
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.stopPullDownRefresh()
    this.setData({
      selectIndex: 0,
      toView: 'goods0',
      list: []
    })
    this.getList();
  }
})