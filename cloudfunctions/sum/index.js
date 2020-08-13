const cloud = require('wx-server-sdk')
// 初始化 cloud
cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})
exports.main = (event, context) => {
  debugger
  let { userInfo, a, b } = event
  let { OPENID, APPID } = cloud.getWXContext() // 这里获取到的 openId 和 appId 是可信的
  let sums = a + b
  console.log(sums)
  return {
    OPENID,
    APPID,
    sums
  }
}