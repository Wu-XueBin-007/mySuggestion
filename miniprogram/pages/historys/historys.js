// miniprogram/pages/races/races.js
import Dialog from '../../miniprogram_npm/@vant/weapp/dialog/dialog';
import { createCode } from "../../common/tool.js"
const app = getApp()
const db = wx.cloud.database()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    openId: '',
    historys: [],
    page: 0,
    size: 10,
    templateId:''
  },
 
queryHistorys(openId,size,page) {
 //   let {size,page} =this.data
    if (!openId) {
      console.log('未登录')
      return
    }
    // 查询当前用户所有的 counters
    db.collection('boxes').aggregate().match({
      _openid: openId
    }).sort({
      createDate: -1
      }).skip(page*size).limit(size).end().then(res => {
          if (res.list && res.list.length > 0) {
            const temp = this.data.historys
            if(page>0){
              this.setData({
                historys: temp.concat(res.list)
              })
            }else{
              this.setData({
                historys: res.list
              })
            }
          
            console.log('[数据库] [查询记录] 成功: ', this.data.historys)
          }else{
            if (page == 0) {
              this.setData({
                historys:[]
              })
          }}

        }
      )
  },
  /**
   * 生命周期函数--监听页面加载
   */
onLoad: function (options) {
    let openid= wx.getStorageSync('openid')
    const {size, page} =this.data
    if (openid) {
      this.setData({
        openId: openid
      })
      this.queryHistorys(openid,size,page)
    }
  this.getSubscribeMessageTemplate()

  },
 addBox() {
    wx.navigateTo({
      url: '/pages/suggestion/suggestion',
    })
  },

  deleteHistory(event) {
    const that = this
    Dialog.confirm({
      title: '提示',
      message: '确认删除意见箱吗？',
    })
      .then(() => {
        // on confirm
        const id = event.currentTarget.dataset.id
        const {openId} =this.data
  
        db.collection("boxes").doc(id).remove({
          success: function (res) {
            that.queryHistorys(openId,10,0)
          }
        })
      })
      .catch(() => {
        // on cancel
      });

  },
  onCheckCodePage(event){
    const { id,code,codePage } = event.currentTarget.dataset
    if(codePage){
      wx.navigateTo({
        url: '/pages/historys/codePage/codePage?codePageId='+codePage,
      })
    }else{
      wx.navigateTo({
        url: `/pages/historys/codePage/codePage?boxId=${id}&boxCode=${code}` ,
      })
    }
  },
  onSubscribeMessage(e){
    const {templateId} = this.data
    const that = this
    const {boxid} = e.currentTarget.dataset
    // const templateId = this.getSubscribeMessageTemplate(boxId)
    wx.requestSubscribeMessage({
      tmplIds: [templateId],
      success: (res) => {
        if (res[templateId] === 'accept') {
          setTimeout(()=>{
            that.sendMsg(templateId,boxid)
          },2000)
          this.setData({
            requestSubscribeMessageResult: '成功',
          })
        } else {
          this.setData({
            requestSubscribeMessageResult: `失败（${res[templateId]}）`,
          })
        }
      },
      fail: (err) => {
        this.setData({
          requestSubscribeMessageResult: `失败（${JSON.stringify(err)}）`,
        })
      },
    })
  },
  sendMsg(templateId,boxId){
    wx.cloud.callFunction({
      name: 'openapi',
      data: {
        action: 'sendSubscribeMessage',
        boxId, templateId
      },
    })
  },
  async getSubscribeMessageTemplate(boxId) {
    try {
      const { result } = await wx.cloud.callFunction({
        name: 'openapi',
        data: {
          action: 'requestSubscribeMessage',
          boxId
        },
      })

      const templateId =  result

      console.warn('[云函数] [openapi] 获取订阅消息模板 调用成功：', templateId)
      this.setData({
        templateId,
      })
    } catch (err) {
      wx.showToast({
        icon: 'none',
        title: '调用失败',
      })
      console.error('[云函数] [openapi] 获取订阅消息模板 调用失败：', err)
    }
  },
  onPanelClick(event) {
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/suggestion/suggestion?id=' + id,
    })
  },
  onClickCode(event) {
    const { code } = event.currentTarget.dataset
    wx.setClipboardData({
      data: code,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })

  },
  checkSuggestions(event){
    const { id } = event.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/suggestionComment/suggestionComment?id=' + id,
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
    const { size, page, openId}= this.data
    if (openId) {
     this.setData({
       page:0
     })
      this.queryHistorys(openId,size,0)
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
     console.log('draw up')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  console.log('draw down')
  let {size,page}= this.data
   page++
   this.setData({
     page
   })
    this.queryHistorys(app.globalData.openid,size,page)
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})