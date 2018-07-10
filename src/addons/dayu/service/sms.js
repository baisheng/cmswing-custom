const SMSClient = require('aliyun-dysms-sdk')

module.exports = class extends think.Service {
  /**
   * init
   */
  // constructor () {
  //   super()
  // let option = think.config('options.sms')
  // const accessKeyId = 'yourAccessKeyId'
  // const secretAccessKey = 'yourAccessKeySecret'
  // let option = think.config('options.sms');
  // this.config = config
  // }

  async send (msg) {
    // console.log('send sms ...---------')
    // let option = think.config('ext.dayu.appkey');
    // let key;
    //
    //
    // if (!think.isEmpty(option.key.value)) {
    //   key = option.key.value.split("|");
    //   // console.log(key);
    //   if (think.isEmpty(key[0]) || think.isEmpty(key[1])) {
    //     return {result: {errno: '1000', errmsg: '请确认短信服务配置'}}
    //   }
    //
    // } else {
    //   return {result: {errno: '1000', errmsg: '请确认短信服务配置'}}
    // }
    const accessKeyId = think.config('ext.dayu.appkey');
    const secretAccessKey = think.config('ext.dayu.appsecre');
    // const accessKeyId = key[0]
    // const secretAccessKey = key[1]
    // 初始化sms_client
    let smsClient = new SMSClient({accessKeyId, secretAccessKey})
    // 发送短信
    let res = {}
    res = await smsClient.sendSMS(msg).then(function (res) {
      let {Code} = res
      if (Code === 'OK') {
        // 处理返回参数
        // deferred.resolve(res);
        // console.log(res)
        return res
      }
    }, function (err) {
      console.log(err.data)
      res.Code = 'ERR'
      return res
      // console.log(err)
      // deferred.resolve(err);
      // "Message": "OK",
      //   "RequestId": "5FE99812-AACB-4242-8E30-B0ACC563D758",
      //   "BizId": "488210903744145481^0",
      //   "Code": "OK"
      // return err.data
    })
    let data = await res
    return data
  }

}

