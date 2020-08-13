// miniprogram/pages/scores/commentsPage/commentsPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    commentList: [],
    page: 0,
    size: 10,
    boxId:'',
    count:0
  },
  getComments(boxId) {
    let { size, page } = this.data
    const db = wx.cloud.database()
    const $ = db.command.aggregate

    db.collection('suggestions').aggregate()
      .match({
        boxId: boxId
      }).count('count').end().then(res=>{
        console.log(res)
        this.setData({
          count: res.list[0].count
        })
      })
    db.collection('suggestions').aggregate()
      .match({
        boxId:boxId
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
  clickImage(event){
    const { index, imageindex}= event.currentTarget.dataset
    const { commentList} =this.data
    let tempFile = commentList[index].fileList
    let urls = tempFile.map((item)=>{
      return item.url
    })
    wx.previewImage({
      current: urls[imageindex],
      urls
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    if(options.id){
      this.setData({
        boxId: options.id
      })
      this.getComments(options.id)
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
    console.log('draw down')
    this.getComments(this.data.boxId)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})