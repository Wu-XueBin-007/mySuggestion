// miniprogram/pages/raceHome/racehome.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: "",
    race: {},
    image:'/images/suggestion.png'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugger
    if (options.scene){
      const scene = decodeURIComponent(options.scene)
      let tempcode = scene.match(/thecode=(.*)/)[1]
      this.queryRaceInfo(tempcode)
    }
    if(options.code){
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
          if (res.data[0].fileList.length>0){
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
    const { race} = this.data
    if(race._id){
      wx.navigateTo({
        url: '/pages/addSuggestion/addSuggestion?boxId=' + race._id,
      })
    }else{
      wx.showToast({
        title: '该意见箱已经删除',
      })
    }
 
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