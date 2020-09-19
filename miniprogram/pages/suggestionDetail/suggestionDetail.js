// miniprogram/pages/raceHome/racehome.js
import { timestampToTime, debounce } from "../../common/tool.js"
const app = getApp()
let context

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    suggest: {},
    fileList: [],
    vote: 0,
    isVote: false,
    suggestId: '',
    show: false,
    showOrHidden: false,
    keyValue: '',
    createDatetime: '',
    comment: '',
    comments: []
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    context = this
    let id = options.id
    context.setData({
      suggestId: id
    })
    context.getVoteStatus(id)
    context.getVoteCount(id)
    context.querySuggestDetail(id)
    context.getComments()
  },
  /**
   * 查询问答详情
   */
  querySuggestDetail(id) {
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前suggest
    db.collection('suggestions').aggregate()
      .match({
        _id: id
      }).end().then(res => {
        if (res.list && res.list.length > 0) {
          this.setData({
            suggest: res.list[0],
            fileList: res.list[0].fileList
          })
        }
      })
  },
  /**
   * 图片预览
   */
  previewImage(event) {
    const { imageindex } = event.currentTarget.dataset
    const { fileList } = this.data
    let urls = fileList.map((item) => {
      return item.url
    })
    wx.previewImage({
      current: urls[imageindex],
      urls
    })
  },
  /**
  * 投票状态
  */
  getVoteStatus(suggestionId) {
    this.onGetOpenid()
    wx.cloud.callFunction({
      name: 'vote',
      data: {
        action: 'getVoteStatus',
        suggestionId: suggestionId
      },
      success: res => {
        if (res.result.data.length === 0) {
          this.setData({
            isVote: false
          })
        } else {
          this.setData({
            isVote: true
          })
        }
      },
      fail: err => {
        console.error('[云函数] [getVoteStatus] 调用失败', err)
      }
    })
  },
  /**
  * 查询投票数
  */
  getVoteCount(suggestionId) {
    wx.cloud.callFunction({
      name: 'vote',
      data: {
        action: 'countVotes',
        suggestionId: suggestionId
      },
      success: res => {
        this.setData({
          vote: res.result.total
        })
      },
      fail: err => {
        console.error('[云函数] [countVotes] 调用失败', err)
      }
    })
  },
  /**
  * 添加投票
  */
  addVote: debounce(() => {
    const { suggestId, openId, vote } = context.data
    wx.cloud.callFunction({
      name: 'vote',
      data: {
        action: 'sendVote',
        param: { suggestionId: suggestId, _openid: openId }
      },
      success: res => {
        context.setData({
          isVote: true,
          vote: vote + 1
        })
      },
      fail: err => {
        console.error('[云函数] [sendVote] 调用失败', err)
      }
    })
  }, 200),
  /**
   * 移除投票
   */
  removeVote: debounce(() => {
    const { suggestId, vote } = context.data
    wx.cloud.callFunction({
      name: 'vote',
      data: {
        action: 'removeVote',
        suggestionId: suggestId
      },
      success: res => {
        context.setData({
          isVote: false,
          vote: vote - 1
        })
      },
      fail: err => {
        console.error('[云函数] [removeVote] 调用失败', err)
      }
    })
  }, 200),
  /**
   * 获取openid
   */
  onGetOpenid: function () {
    let openid = wx.getStorageSync("openid")
    if (openid) {
      this.setData({
        openId: openid
      })
      return
    }
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
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
      }
    })
  },
  /**
   * 查询投票数
   */
  getComments() {
    const { suggestId } = context.data
    wx.cloud.callFunction({
      name: 'comments',
      data: {
        action: 'queryComment',
        suggestionId: suggestId
      },
      success: res => {
        if (res.result.data) {
          this.setData({
            comments: res.result.data
          })
        }
      },
      fail: err => {
        console.error('[云函数] [queryComment] 调用失败', err)
      }
    })
  },
  formSubmit: function (e) {
    const { suggestId, openId } = context.data
    let comment = e.detail.value.liuyantext
    if (!comment) {
      wx.showModal({
        title: '提示',
        content: '请输入评论',
        success: function () {
        }
      })
      return
    }
    let timestamp = timestampToTime(new Date().getTime())
    wx.showToast({
      title: '评论成功',
      icon: 'success',
      duration: 3000
    })
    // 调用云函数
    wx.cloud.callFunction({
      name: 'comments',
      data: {
        action: 'sendComment',
        param: { suggestionId: suggestId, _openid: openId, comment: comment, createDatetime: timestamp }
      },
      success: res => {
        context.setData({
          show: false,
          showOrHidden: true,
          keyValue: '',
          comment: comment,
          createDatetime: timestamp
        })
        wx.hideToast()
        // context.getComments()
      },
      fail: err => {
        console.error('[云函数] [sendComment] 调用失败', err)
      }
    })
  },
  /**
   * 显示评价输入栏
   */
  onClickShow() {
    this.setData({ show: true })
  },
  /**
   * 隐藏评价输入栏
   */
  onClickHide() {
    this.setData({ show: false })
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