var Promise = require('../plugins/es6-promise.min.js')
var uploaduri = 'https://ielts-listen-training.oss-cn-qingdao.aliyuncs.com'
let url = {
  // develop: 'https://local.lylo.top/api/listen',
  develop: 'https://free.jingying.vip/api/listen',
  trial: 'https://free.jingying.vip/api/listen',
  release: 'https://free.jingying.vip/api/listen',
}

const version = wx.getAccountInfoSync().miniProgram.envVersion
var uri = url[version]
var profiles = 'ielts'

function wxPromisify(fn) {
  return function (obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function (res) {
        resolve(res) //成功
      }
      obj.fail = function (res) {
        reject(res) //失败
      }
      fn(obj)
    })
  }
}

//无论promise对象最后状态如何都会执行
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => {
      throw reason
    })
  );
};

/**
 * 微信请求方法
 * that 当前页面this
 * url 请求地址
 * data 以对象的格式传入
 * hasToast 是否需要显示toast(下拉刷新不需要toast)
 * hasUser 是否包含User信息
 * method GET或POST请求
 */
function request(that, url, data, hasToast, method) {
  let timer
  if (!hasToast) {
    timer = setTimeout(function () {
      wx.showLoading({
        title: '努力加载中...',
      })
    }, 1000)
  }
  return new Promise((resolve, reject) => {
    wx.request({
      url: uri + url,
      method: method || 'GET',
      data: data,
      header: {
        'Content-Type': 'application/json',
        'Token': wx.getStorageSync("token")
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == '200') {
          console.log(res.data)
          if (isNotEmpty(that) && !isEmpty(that.route) && !isEmpty(res.data.data)) {
            that.setData(res.data.data)
          }
          resolve(res.data.data)
        } else {
          toast(res.data.msg || res.data.message)
        }
      },
      fail: function (res) {
        wx.hideLoading()
        toast('请求失败，请稍候再试')
      },
      complete: function (res) {
        clearTimeout(timer)
        wx.stopPullDownRefresh()
      }
    })
  })
}


//上传文件方法 
function uploadFileToOSS(filePath) {
  // 发送请求获取签名信息 
  toast('上传中...', 'loading', 50000)
  request(this, "/system/generate/signature", {}, false).then(res => {
    //此示例上传参数只列举必填字段，如有其他需求可参考：
    //PostObject文档：https://help.aliyun.com/zh/oss/developer-reference/postobject 
    //签名版本4文档：https://help.aliyun.com/zh/oss/developer-reference/signature-version-4-recommend
    var imageName = filePath.toString();
    let fileName = imageName.substring(imageName.lastIndexOf('/') + 1);
    var realpath = '/user/head/' + fileName
    const formData = {
      key: realpath,  //上传文件名称
      policy: res.data.policy,   //表单域
      'x-oss-signature-version': res.data.x_oss_signature_version,    //指定签名的版本和算法
      'x-oss-credential': res.data.x_oss_credential,   //指明派生密钥的参数集
      'x-oss-date': res.data.x_oss_date,   //请求的时间
      'x-oss-signature': res.data.signature,   //签名认证描述信息
      'x-oss-security-token': res.data.security_token,  //安全令牌
      success_action_status: "200"  //上传成功后响应状态码
    };
    return new Promise((resolve, reject) => {
      // 发送请求上传文件 
      wx.uploadFile({
        url: uploaduri,  // 此域名仅作示例，实际Bucket域名，请替换为您的目标Bucket域名。
        filePath: filePath,
        name: 'file',   //固定值为file
        formData: formData,
        success: function (res) {
          wx.hideToast()
          toast("上传成功", 'success', 1000)
          resolve(uploaduri + realpath)
        },
        fail: function (res) {
          wx.hideToast()
          toast('上传失败', 'none', 1000)
          reject(res)
        },
      });
    })
  })
}

/**
 * 上传附件
 */
function upload(src, path, that) {
  var imageName = src.toString();
  let fileName = imageName.substring(imageName.lastIndexOf('/') + 1);
  toast('上传中...', 'loading', 50000)
  return new Promise((resolve, reject) => {
    var realpath = 'ielts' + path + fileName
    wx.uploadFile({
      url: uploaduri,
      filePath: src,
      name: 'file',
      formData: {
        name: src,
        key: realpath,
        policy: "eyJleHBpcmF0aW9uIjoiMjAzMC0wMS0wMVQxMjowMDowMC4wMDBaIiwiY29uZGl0aW9ucyI6W1siY29udGVudC1sZW5ndGgtcmFuZ2UiLDAsMTA0ODU3NjAwMF1dfQ==",
        OSSAccessKeyId: "LTAI5tPdARJaN1EKUcQMxcDo",
        success_action_status: "200",
        signature: "cwQtszjZEpqW1ir6v4py2Cb9NlY=",
      },
      success: function (res) {
        wx.hideToast()
        toast("上传成功", 'success', 1000)
        resolve(uploaduri + realpath)
      },
      fail: function (res) {
        wx.hideToast()
        toast('上传失败', 'none', 1000)
        reject(res)
      },
    })
  })
}

/**
 * 用于判断空，Undefined String Array Object
 */
function isEmpty(str) {
  if (Object.prototype.toString.call(str) === '[object Undefined]') { //空
    return true
  } else if (
    Object.prototype.toString.call(str) === '[object String]' ||
    Object.prototype.toString.call(str) === '[object Array]') { //字条串或数组
    return str.length == 0 ? true : false
  } else if (Object.prototype.toString.call(str) === '[object Object]') {
    return Object.getOwnPropertyNames(str).length === 0;
  } else if (Object.prototype.toString.call(str) === '[object Number]') {
    return false
  } else if (Object.prototype.toString.call(str) === '[object Boolean]') {
    return str
  } else {
    return true
  }
}

/**
 * 非空判断
 */
function isNotEmpty(str) {
  return !isEmpty(str)
}
/**
 * 弹窗(无需点击)
 */
function toast(title, icon, duration) {
  wx.showToast({
    title: title,
    icon: isEmpty(icon) ? 'none' : icon,
    duration: isEmpty(duration) ? 2000 : duration,
    mask: true
  })
}

/**
 * 弹窗(需要点击)
 */
function modal(title, content, cancel) {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: title,
      content: content,
      showCancel: isEmpty(cancel) ? true : cancel,
      success(res) {
        if (res.confirm) {
          resolve(true)
        } else if (res.cancel) {
          reject(false)
        }
      }
    })
  })
}

/**
 * json转get请求参数
 */
function parseParams(json) {
  try {
    var tempArr = []
    for (var key in json) {
      tempArr.push(key + '=' + json[key])
    }
    var urlParamsStr = tempArr.join('&')
    return '?' + urlParamsStr
  } catch (err) {
    return ''
  }
}

module.exports = {
  wxPromisify: wxPromisify,
  request: request,
  upload: upload,
  uploadFileToOSS: uploadFileToOSS,
  isEmpty: isEmpty,
  isNotEmpty: isNotEmpty,
  toast: toast,
  modal: modal,
  parseParams: parseParams
}