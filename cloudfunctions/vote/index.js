const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
exports.main = (event, context) => {
  switch (event.action) {
    case 'sendVote': {//新增投票
      return sendVote(event)
    }
    case 'removeVote':{//删除投票
      return removeVote(event)
    }
    case 'countVotes': {//查询投票数量
      return countVotes(event)
    }
    case 'getVoteStatus': {//查询是否投票
      return getVoteStatus(event)
    }
    default: {
      return
    }
  }
}

async function sendVote(event){
  const { OPENID } = cloud.getWXContext()
  return await db.collection('votes').add({
    data: event.param
  })
}

async function removeVote(event){
  const {OPENID} = cloud.getWXContext()
  return await db.collection('votes').where({
    _openid: OPENID,
    suggestionId:event.suggestionId
  }).remove()
}
async function getVoteStatus(event){
  const {OPENID} = cloud.getWXContext()
  return await db.collection('votes').where({
    _openid: OPENID,
    suggestionId:event.suggestionId
  })
}

async function countVotes(event){
  return await db.collection('votes').where({
    suggestionId:event.suggestionId
  }).count()
}