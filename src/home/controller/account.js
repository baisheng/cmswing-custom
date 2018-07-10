/* eslint-disable no-undef */
const Base = require('./base.js');

module.exports = class extends Base {
  /**
   * 用户注册手机信息验证页
   *
   * @returns {Promise<*>}
   */
  async createAction () {
    this.meta_title = '验证账户';
    // 短信注册视图钩子
    await this.hook('smsRegistration');
    // 第三方登录钩子
    await this.hook('logins');
    return this.display()
  }

  /**
   * 找回密码页
   * @returns {Promise<*>}
   */
  async passwordrecoverAction () {
    if (this.isGet) {
      return this.displayView('account_passwordrecover')
    }
    if (this.isPost) {
      const data = this.post();
      // 对比验证码
      const map = {
        mobile: data.mobile,
        type: 1
      };
      map.create_time = ['>', new Date().valueOf() - 1 * 3600 * 1000];
      const code = await this.model('ext_smslog').where(map).order('id DESC').getField('code', true);
      if (think.isEmpty(code) || code !== data.verifycode) {
        return this.fail('验证码不正确!');
      } else {
        await this.session('pwdreset', {mobile: data.mobile, code: data.verifycode})
        return this.success({name: '验证成功', url: '/account/passwordreset'})
      }
    }
  }

  /**
   * 密码重置
   * @returns {Promise<*>}
   */
  async passwordresetAction () {
    const pwdreset = await this.session('pwdreset')
    if (think.isEmpty(pwdreset)) {
      return this.redirect('/center/public/login');
    }
    if (this.isGet) {
      return this.display()
    }
    if (this.isPost) {
      const data = this.post();
      // 对比验证码
      const map = {
        mobile: pwdreset.mobile,
        type: 1
      };
      map.create_time = ['>', new Date().valueOf() - 1 * 3600 * 1000];
      const code = await this.model('ext_smslog').where(map).order('id DESC').getField('code', true);
      if (think.isEmpty(code) || code !== pwdreset.code) {
        return this.fail('验证码不正确或已失效!');
      } else {
        if (think.isEmpty(data.password)) {
          return this.fail('请填写新密码！');
        }
        const res = await this.model('member').where({mobile: pwdreset.mobile}).update({password: encryptPassword(data.password)});
        if (res > 0) {
          await this.session('pwdreset', '')
          return this.success({name: '密码修改成功，请用新密码重新登陆！', url: '/'});
        } else {
          return this.fail({name: '密码修改失败, 请重试！'});
        }
      }
    }
  }

  /**
   * 注册页面
   */
  async registerAction () {
    if (this.isAjax('post')) {
      const data = this.post();
      // 验证
      let res;
      // 对比验证码
      const map = {
        mobile: data.mobile,
        type: 1
      };
      map.create_time = ['>', new Date().valueOf() - 1 * 3600 * 1000];
      const code = await this.model('ext_smslog').where(map).order('id DESC').getField('code', true);
      if (think.isEmpty(code) || code !== data.verifycode) {
        return this.fail('验证码不正确或已失效!');
      }

      if (think.isEmpty(data.mobile)) {
        return this.fail('手机号码不能为空！');
      } else {
        res = await this.model('member').where({mobile: data.mobile}).find();
        if (!think.isEmpty(res)) {
          return this.fail('手机号码已存在，请重新填写！');
        }
        data.username = data.mobile
      }
      if (think.isEmpty(data.password) && think.isEmpty(data.confirm_password)) {
        return this.fail('密码不能为空！');
      } else {
        if (data.password != data.confirm_password) {
          return this.fail('两次输入的密码不一致，请重新填写！');
        }
      }
      /*
      if (data.clause != 'on') {
        return this.fail('必须要同意,网站服务条款');
      }
      */
      data.status = 1;
      data.reg_time = new Date().valueOf();
      data.reg_ip = _ip2int(this.ip);
      data.password = encryptPassword(data.password);
      const reg = await this.model('member').add(data);
      await this.model('member').autoLogin({id: reg}, this.ip);// 更新用户登录信息，自动登陆
      const userInfo = {
        'uid': reg,
        'real_name': data.real_name,
        'mobile': data.mobile,
        'last_login_time': data.reg_time
        // 'group_id': data.group_id
      };
      await this.session('webuser', userInfo);
      return this.success({name: '注册成功,登录中!', url: '/center/index'});
    }
    if (this.isGet) {
      this.meta_title = '用户注册';
      const usergroup = await this.model('member_group').select();
      this.assign('usergroup', usergroup);

      // 短信注册视图钩子
      await this.hook('smsRegistration');
      // 第三方登录钩子
      await this.hook('logins');
      return this.displayView('account_register')
      // return this.display()
    }
  }

  //   登陆页面
  async loginAction () {
    if (this.isAjax('post')) {
      // 用户账号密码验证
      const username = this.post('username');
      let password = this.post('password');
      password = encryptPassword(password);
      console.log(password)
      const res = await this.model('member').signin(username, password, this.ip, 5, 0);
      // 钩子
      if (res.uid > 0) {
        // 记录用户登录行为
        await this.session('webuser', res);
        return this.success({url: '/index'});
      } else { // 登录失败
        let fail;
        switch (res) {
          case 401:
            fail = '用户不存在或被禁用';
            break; // 系统级别禁用
          case 403:
            fail = '密码错误';
            break;
          default:
            fail = '登录失败，请重试。';
            break; // 0-接口参数错误（调试阶段使用）
        }
        return this.fail(res, fail);
      }
    } else {
      // 如果已经登陆直接跳转到用户中心
      if (this.is_login) {
        return this.redirect('/index');
      }
      this.meta_title = '用户登录';
      // return this.display();
      return this.displayView('account_login')
    }
  }

  // 退出登录
  async logoutAction () {
    // 退出登录

    if (this.is_login) {
      await this.session('webuser', null);
      return this.redirect('/index');
    } else {
      return this.redirect('/index');
    }
  }
}
