// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  switch (event.action) {
    case 'sendComment': {//新增评论
      return sendComment(event)
    }
    case 'queryComment': {//查询评论
      return queryComment(event)
    }
    default: {
      return
    }
  }
}

async function sendComment(event){
  const { OPENID } = cloud.getWXContext()
  return await db.collection('comments').add({
    data: event.param
  })
}
async function queryComment(event){
  return await db.collection('comments').where({
    suggestionId: event.suggestionId
  }).get()
}