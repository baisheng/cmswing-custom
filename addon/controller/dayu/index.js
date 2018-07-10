/* eslint-disable no-undef,no-undef,new-cap */
module.exports = class extends think.common.AddonIndex {
  // 获取短信验证码
  async verifycodesendAction () {
    if (!this.isPost) {
      return this.fail('请求错误！');
    }
    const data = this.post();
    const code = MathRand();
    if (data.check == 1) {
      const res = await this.model('member').where({mobile: data.mobile}).find();
      if (!think.isEmpty(res)) {
        return this.fail('该手机号已存在！');
      }
    }
    if (data.check == 2) {
      const res = await this.model('member').where({mobile: data.mobile}).find();
      if (think.isEmpty(res)) {
        return this.fail('用户不存在！');
      }
    }
    // 检查执行周期
    const map = {
      mobile: data.mobile,
      // type: 1
      type: data.type
    };
    map.create_time = ['>', new Date().valueOf() - 7 * 3600 * 1000];
    // console.log(map);
    const exec_count = await this.model('ext_smslog').where(map).count();
    // console.log(exec_count);
    if (exec_count >= 3) {
      return this.fail('发送过于频发请稍后再试。');
    }
    // const dayu = this.addonService('sms');

    const SMS = this.addonService("sms", 'dayu');

    // const qianming = this.config('ext.dayu.qianming');
    let temp_code;

    if (Number(data.type) === 1) {
      temp_code = think.config('ext.dayu.signup');
    }
    let msg = {
      PhoneNumbers: data.mobile,
      SignName: think.config('ext.dayu.qianming'),
      TemplateCode: temp_code,
      TemplateParam: `{"code":"${code}","product":"${this.config('ext.dayu.product')}"}`
    }
    const result = await SMS.send(msg);
    // 发送成功记录到数据库
    if (result.Code === 'OK') {
      await this.model('ext_smslog').add({
        mobile: data.mobile,
        type: data.type,
        code: code,
        create_time: new Date().valueOf()
      });
    } else {
      return this.fail('短信发送失败，请重试。')
    }
    return this.json(result);
  }

  // 短信注册
  async smsregAction () {
    const data = this.post();
    // 对比验证码
    const map = {
      mobile: data.mobile,
      type: data.sms_type
    };
    map.create_time = ['>', new Date().valueOf() - 1 * 3600 * 1000];
    const code = await this.model('ext_smslog').where(map).order('id DESC').getField('code', true);
    if (think.isEmpty(code) || code !== data.verifycode) {
      return this.fail('验证码不正确!');
    }
    const patrn = /^(\w){6,20}$/;
    if (!patrn.test(data.password)) {
      return this.fail('密码：只能输入6-20个字母、数字、下划线');
    }
    data.email = 0;
    data.username = data.mobile;
    data.status = 1;
    data.reg_time = new Date().valueOf();
    data.reg_ip = _ip2int(this.ip);
    data.password = encryptPassword(data.password);
    const reg = await this.model('member').add(data);
    await this.model('member').autoLogin({id: reg}, this.ip);// 更新用户登录信息，自动登陆
    const userInfo = {
      'uid': reg,
      'username': data.username,
      'last_login_time': data.reg_time
    };
    await this.session('webuser', userInfo);
    return this.success({name: '注册成功,登录中!', url: '/center/index'});
  }
};
