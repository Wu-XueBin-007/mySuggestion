//index.js
const app = getApp()

Page({
  data: {
    invitedCode: '',
    animal:''
   
  },

  onLoad: function () {
  

  },
  onShow(){
    const self = this
    let an = wx.createAnimation({
      duration: 2000,
      delay: 0, timingFunction: 'cubic-bezier(.8,.2,.1,0.8)' 
      })
      let next = true
      setInterval(()=>{
        if(next){
         an.rotateX(90).step()
         next= !next
        }else{
          an.rotateX(0).step()
          next = !next
        }
    self.setData({
      animal: an.export()
    })
    },2000)
  },

  onCodeChange(value) {
    this.setData({
      invitedCode: value.detail
    })
  },
  beginToScore() {

    const { invitedCode } = this.data
    if (invitedCode ) {
      wx.navigateTo({
        url: '/pages/suggestionGuide/suggestionGuide?code=' + invitedCode,
      })
    } else {
      wx.showToast({
        title: '请输入意见箱编码',
        icon: 'none'
      })
    }

  },
  onShareAppMessage: function () {

  }
})
