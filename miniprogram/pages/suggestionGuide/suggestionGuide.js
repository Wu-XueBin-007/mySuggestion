// miniprogram/pages/raceHome/racehome.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    race: {},
    image: '/images/suggestion.png',
    commentList: [],
    page: 0,
    size: 10,
    boxId: '',
    count: 0,
    refreshData: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (options.scene) {
      const scene = decodeURIComponent(options.scene)
      let tempcode = scene.match(/thecode=(.*)/)[1]
      this.queryRaceInfo(tempcode)
    }
    if (options.code) {
      this.setData({
        code: options.code
      })
      this.queryRaceInfo(options.code)
    }

  },
  queryRaceInfo(code) {
    const db = wx.cloud.database()
    const _ = db.command
    // 查询当前用户所有的 counters
    db.collection('boxes').where({
      suggestionCode: code

    }).get({
      success: res => {
        if (res.data.length > 0) {
          this.setData({
            race: res.data[0]
          })
          this.getComments(res.data[0]._id)
          if (res.data[0].fileList.length > 0) {
            this.setData({
              image: res.data[0].fileList[0].url
            })
          }
        }
        console.log('[数据库] [查询记录] 成功: ', res)
      },
      fail: err => {
        wx.showToast({
          icon: 'none',
          title: '查询记录失败'
        })
        console.error('[数据库] [查询记录] 失败：', err)
      }
    })
  },
  startRace() {
    const { race } = this.data
    if (race._id) {
      wx.navigateTo({
        url: '/pages/addSuggestion/addSuggestion?boxId=' + race._id,
      })
      this.setData({
        refreshData: true,
        page: 0,
        commentList: []
      })
    } else {
      wx.showToast({
        title: '该意见箱已经删除',
      })
    }

  },
  getComments(boxId) {
    let { size, page } = this.data
    const db = wx.cloud.database()
    const $ = db.command.aggregate

    db.collection('suggestions').aggregate()
      .match({
        boxId: boxId
      }).count('count').end().then(res => {
        console.log(res)
        if (res.list && res.list.length > 0) {
          this.setData({
            count: res.list[0].count,
            refreshData: false
          })
        }
      })
    db.collection('suggestions').aggregate()
      .match({
        boxId: boxId
      })
      .sort({
        createDate: -1
      }).skip(page * size).limit(size).end().then(res => {
        if (res.list && res.list.length > 0) {
          this.data.page++
          const temp = this.data.commentList
          this.setData({
            commentList: temp.concat(res.list)
          })
          console.log('[数据库] [查询记录] 成功: ', this.data.commentList)
        }

      }
      )
  },
  clickImage(e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/suggestionDetail/suggestionDetail?id=' + id,
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
     if (this.data.refreshData) {
      this.getComments(this.data.race._id)
     }
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
    console.log('draw down')
    this.getComments(this.data.race._id)
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})