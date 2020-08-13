// miniprogram/pages/race/index.js.js
import { timestampToDay, createCode } from "../../common/tool.js"
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    boxComment: "",
    boxId: "",
    fileList: [],
    isSave:true
  },
  afterRead(event) {
    const { file } = event.detail;
    const { fileList } = this.data;
    fileList.push({ ...file});
       this.setData({ fileList });
   // this.uploadToCloud(fileList)
  },
  onSubmitSuggestion() {
    this.setData({
      isSave: false
    })
    const { boxId, fileList, boxComment} = this.data;
    let timestamp = new Date().getTime()
    const self = this
    if (!fileList.length) {
      let parm = {
        fileList: [],
        boxComment,boxId,
        createDate: timestampToDay(new Date().getTime())
      }
      this.addToDatabase(parm)
    } else {
      const uploadTasks = fileList.map((file, index) => this.uploadFilePromise(boxId+`/${timestamp}-${index}.png`, file));
      Promise.all(uploadTasks)
        .then(data => {
          wx.showToast({ title: '上传成功', icon: 'none' });
          const newFileList = data.map(item => {
            return { url: item.fileID }
          });
       //   this.setData({fileList: newFileList });
          let parm = {
            fileList:newFileList,
            boxComment,
            boxId,
            createDate: timestampToDay(new Date().getTime()),
          }
          self.addToDatabase(parm)
        })
        .catch(e => {
          wx.showToast({ title: '上传失败', icon: 'none' });
          console.log(e);
        });
    }
  },
  addToDatabase(parm){
    const db = wx.cloud.database()
    db.collection('suggestions').add({
      data: parm,
      success: function (res) {
        console.log("新增成功" + res)
        wx.navigateBack()
      }
    })
  },
  uploadFilePromise(fileName, chooseResult) {
    return wx.cloud.uploadFile({
      cloudPath: fileName,
      filePath: chooseResult.path
    });
  },
  deleteImage(event) {
    const {index} = event.detail
    const {fileList}= this.data
    fileList.splice(index,1)
    this.setData({
      fileList
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



  onLoad(options) {
    if (options.boxId) {
      this.setData({
        boxId:options.boxId
      })

    }
  }
})