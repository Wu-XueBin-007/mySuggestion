// miniprogram/pages/personal/personal.js
const app = getApp()
const tool = require('../../common/tool.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: '',
    userName: '登录',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: '',
    loading: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let self = this
    let userInfo = wx.getStorageSync("userInfo")
    if (tool.isEmptyObject(userInfo)) {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo']) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
            wx.getUserInfo({
              success: res => {
                self.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  userInfo: res.userInfo,
                  userName: res.userInfo.nickName,
                  loading: false,
                  logged: true
                })
                // 缓存用户信息
                wx.setStorageSync("userInfo", res.userInfo)
                self.onGetOpenid()
              }
            })
          } else {
            self.setData({
              avatarUrl: '/images/default-image.png',
              loading: false,
              logged: false
            })
          }
        }
      })
    } else {
      self.setData({
        avatarUrl: userInfo.avatarUrl,
        userInfo: userInfo,
        userName: userInfo.nickName,
        loading: false,
        logged: true
      })
    }
  },
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo,
        userName: e.detail.userInfo.nickName
      })
    }
    // 缓存用户信息
    wx.setStorageSync("userInfo", e.detail.userInfo)
    this.onGetOpenid()
  },
  onGetOpenid: function () {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        wx.setStorage({
          key: 'openid',
          data: res.result.openid,
        })
        app.globalData.openid = res.result.openid
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  createHistory() {
    if (this.data.logged) {
      wx.navigateTo({
        url: '/pages/suggestion/suggestion',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请先登录小程序',
      })
    }
  },
  getHistory() {
    if (this.data.logged) {
      wx.navigateTo({
        url: '/pages/historys/historys',
      })
    } else {
      wx.showToast({
        icon: "none",
        title: '请先登录小程序',
      })
    }

  },
  /**
  * 退出登录
  */
  loginOut() {
    let self = this
    wx.showModal({
      title: '提示',
      content: '您确定要退出登录吗',
      success: function (res) {
        if (res.confirm) {
          // 缓存用户信息清空
          self.setData({
            avatarUrl: '/images/default-image.png',
            userInfo: {},
            userName: '登录',
            logged: false
          })
          wx.setStorageSync('userInfo', {})
        }
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