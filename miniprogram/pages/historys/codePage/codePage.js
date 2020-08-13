// miniprogram/pages/historys/codePage/codePage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    codePageId: '',
    boxId:'',
    boxCode:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      if(options.boxId && options.boxCode){
        this.createCodePage(options.boxCode)
        this.setData({
          boxId: options.boxId
        })
      }else if(options.codePageId){
          this.setData({
            codePageId: options.codePageId
          })
      }
  },
  createCodePage(suggestionCode){
    const self = this
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'getWXACode',
        code: suggestionCode
      },
      success: (res) => {
        self.updateBoxInfo(res.result)
        self.setData({
          codePageId: res.result
        })
      }
    })
  },
   previewImage(){
     const {codePageId}= this.data
     wx.previewImage({
       urls: [codePageId],
     })
  },
  updateBoxInfo(codeId){
    const db = wx.cloud.database()
    if (this.data.boxId) {//修改
      db.collection('boxes').doc(this.data.boxId).update({
        data: {
          codePageId: codeId
        },
        success: function (res) {
          console.log("修改成功" + res)
        }
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