//index.js
const app = getApp()

Page({
  data: {
    list: [],
    scrollTop: 0,
    clientHeight: 0,
    bHeiht: 0,
    scrollY: true,
    value1: 0,
    selectIndex: 0,
    userInfo: {},
    toView: 'goods0',
    typeHeight: 0,
    goodHeight: 0,
    cartHeight: 0,
    allPrice: 0,
    cartItem: [], //购物车列表
    totalNum: 0,
    showCover: false,
    canOrder: true, // 商家设置下单时间是否可以下单
    isFirst: true
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
        this.setData({
          list: lists
        })
        this.setItemNum();
        this.handleAllPrice();
      }
    })
  },
  //  滚动产品
  goodsScroll(e) {
    let that = this;
    var typeCount = that.data.list.length;
    var goodsCount = 0
    this.data.list.forEach((item) => {
      goodsCount += item.products.length;
    });
    var heightList = [0];
    var curHeight = 0;
    this.data.list.forEach((item) => {
      curHeight += (this.data.typeHeight + item.products.length * this.data.goodHeight);
      heightList.push(curHeight);
    });

    for (var i = 0; i < heightList.length; i++) {
      if (e.detail.scrollTop >= heightList[i] && e.detail.scrollTop < heightList[i + 1]) {
        this.setData({
          selectIndex: i
        });
      }
    }
    that.setData({
      scrollTop: e.detail.scrollTop + that.data.bHeiht + 50
    })
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
    const that = this;
    const types = e.detail.type;
    const val = e.detail.value;
    const pIndex = e.currentTarget.dataset.index;
    const sIndex = e.currentTarget.dataset.subindex;
    if (types === 'plus') {
      const plusNum = 'list[' + pIndex + '].products[' + sIndex + '].num';
      this.setData({
        [plusNum]: e.detail.value
      })
      const totalPrice = 'list[' + pIndex + '].products[' + sIndex + '].totalPrice';
      this.setData({
        [totalPrice]: (this.data.list[pIndex].products[sIndex].num * this.data.list[pIndex].products[sIndex].price).toFixed(2)
      })
    } else {
      const minusNum = 'list[' + pIndex + '].products[' + sIndex + '].num';
      this.setData({
        [minusNum]: e.detail.value
      })
      const totalPrice = 'list[' + pIndex + '].products[' + sIndex + '].totalPrice';
      this.setData({
        [totalPrice]: (this.data.list[pIndex].products[sIndex].num * this.data.list[pIndex].products[sIndex].price).toFixed(2)
      })
    }
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
      })
    })
    that.setData({
      list: lists,
      allPrice: 0
    })
    that.totalNum();
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
          icon: 'none'
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
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          clientHeight: res.windowHeight,
          bHeiht: res.windowWidth / 750 * 260,
          typeHeight: res.windowWidth / 750 * 100,
          goodHeight: res.windowWidth / 750 * 242,
          cartHeight: res.windowWidth / 750 * 80
        });
      }
    })
    that.getList();
    that.totalNum();
    that.handleAllPrice();
  }
})