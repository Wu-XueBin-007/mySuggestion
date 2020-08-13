// miniprogram/pages/race/index.js.js
import { timestampToDay, createCode } from "../../common/tool.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boxName: "",
    boxComment: "",
    _id: "",
    showRaceDes: false,
    fileList:[],
    cloudPath:'',
    boxActionName:'创建意见箱',
    suggestionCode:'',
    isCoverPageChange: false,
    isSave:true
  },
  afterRead(event) {
    const { file } = event.detail;
    const { fileList } = this.data;
   
   
   wx.cloud.callFunction({
     name:'openapi',
     data:{
       action: 'checkImage',
       buffer: wx.getFileSystemManager().readFileSync(file.path)
     },
     success:(res)=>{
       console.log(res)
       if (res.result.errCode == 87014){
         wx.showToast({
           title: '内容包含违规内容',
         })
        }else{
         fileList.push({ ...file });
         this.setData({ fileList, isCoverPageChange: true });
        }
     },
     fail:(error)=>{
       console.log('faill'+error)
     }
   })

  },

  addSuggestionToCloud() {
    this.setData({
      isSave: false
    })

    const self = this
    const { fileList, suggestionCode, isCoverPageChange } = this.data;
    if (!fileList.length || !isCoverPageChange) {
      self.onSubmitSuggestion(fileList)
    } else {
      let random = Math.floor(Math.random() * 100); 
      wx.cloud.uploadFile({
        cloudPath: `${random}my-photo${suggestionCode}.png`,
        filePath:fileList[0].path,
        success: res => {
          wx.showToast({
            icon: 'none',
            title: '上传成功',
          })
          const newFileList = [{ url: res.fileID }] 
         // this.setData({fileList: newFileList });
          self.onSubmitSuggestion(newFileList)
        },
        fail: e => {
          console.error('[上传文件] 失败：', e)
          wx.showToast({
            icon: 'none',
            title: '上传失败',
          })
        },
        complete: () => {

        }
      })
    }
  },
  deleteImage(){
    this.setData({
      fileList:[]
    })
  },
  onBoxInput: function (value) {
    this.setData({
      boxName: value.detail
    })
  },
  onBoxCommentInput(value) {
    this.setData({
      boxComment: value.detail
    })
  },
  onSubmitSuggestion(fileList) {
    const self = this
    const {
      boxName,
      boxComment,
      suggestionCode,
      codePageId
    } = this.data
    let parm = {
      boxName,
      fileList,
      boxComment, suggestionCode,
      createDate: timestampToDay(new Date().getTime()),
       
    }
    const db = wx.cloud.database()
    if (this.data._id) {//修改
      db.collection('boxes').doc(this.data._id).update({
        data: parm,
        success: function (res) {
          console.log("修改成功" + res)
          wx.navigateBack()
        }
      })
    } else {//新增
     // parm.suggestionCode= createCode()
      db.collection('boxes').add({
        data: parm,
        success: function (res) {
          console.log("新增成功" + res)
          wx.navigateBack()
        }
      })
    }

  },


  onLoad(options) {
    if (options.id) {
      const db = wx.cloud.database()
      db.collection('boxes').where({
        _id: options.id
      }).get({
        success: (res) => {
          if (res.data.length > 0) {
            let item = res.data[0]
            this.setData({
              boxName: item.boxName,
              boxComment: item.boxComment,
              _id: item._id,
              boxActionName: '修改意见箱',
              fileList: item.fileList,
              suggestionCode:item.suggestionCode
            })
          }

        }
      })

    }else{
      this.setData({
        suggestionCode: createCode()
      })
    }
  }
})