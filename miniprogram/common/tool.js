//将时间戳转换成正常时间格式
export const timestampToTime = function(timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes();
  return Y + M + D + h + m;
}
export const timestampToDay = function (timestamp) {
  var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate();
  return Y + M + D;
}
export const createCode = function () {
  let code = "";
  var codeLength = 6; //验证码的长度
  var codeChars = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
    'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'm', 'n', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'); //所有候选组成验证码的字符，当然也可以用中文的
  for (var i = 0; i < codeLength; i++) {
    var charNum = Math.floor(Math.random() * 52);
    code += codeChars[charNum];
  }
  return code;
}
export const uuid =function () {
  var s = [];
  var hexDigits = "0123456789abcdef";
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  var uuid = s.join("");
  return uuid;
}

// 空对象
export function isEmptyObject (obj) {
  if (!obj) {
      return true
  }
  for (const prop in obj) {
      if (obj.hasOwnProperty(prop)) {
          return false
      }
  }
  return true
}

//防抖函数
export function debounce (fn, delay) {
  let timer = null
  return function (...args) {
      clearTimeout(timer)
      timer = setTimeout(() => {
          fn.apply(this, args)
      }, delay)
  }
}