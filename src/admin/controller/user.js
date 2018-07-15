/* eslint-disable no-undef */
const Base = require('./base')
const fs = require('fs');

/**
 * 用户管理
 *
 * @type {module.exports}
 */
module.exports = class extends Base {
  /**
   * index actiologout
   * @return {Promise} []
   */
  constructor (ctx) {
    super(ctx)
    this.dao = this.model('member')
  }

  async loginAction () {
    this.meta_title = '系统登录'
    // 用户登录
    const isLogin = await this.islogin()
    if (this.isAjax()) {
      // 验证码 钩子
      const signinBefore = await this.hook('signinBefore')
      if (!signinBefore) {
        return this.noAction('验证码不正确')
      }

      const username = this.post('username')
      let password = this.post('password')
      password = encryptPassword(password)
      const res = await this.dao.signin(username, password, this.ip, 5, 1)
      if (res.uid > 0) {
        await this.session('userInfo', res);
        return this.success({name: '登陆成功!', url: '/admin/index'})
      } else { // 登录失败
        let fail;
        switch (res) {
          case 401:
            fail = '用户不存在或被禁用'
            break; // 系统级别禁用
          case 402:
            fail = '密码错误'
            break;
          case 403:
            fail = '您无权登陆后台！'
            break;
          case 404:
            fail = '用户不存在!'
            break;
          default:
            fail = '未知错误'
        }
        return this.noAction(fail)
      }
    } else {
      if (isLogin) {
        return this.redirect('/admin/index')
      } else {
        await this.hook('signinView')
        return this.display()
      }
    }
  }



  /**
   * 用户首页
   * @returns {*}
   */

  async indexAction () {
    this.meta_title = '用户列表';
    this.active = `${this.ctx.module}/user/index`

    const map = {'status': ['>', -1]}
    if (!think.isEmpty(this.get('username'))) {
      map.username = ['like', '%' + this.get('username') + '%']
    }
    // 按用户组过滤
    if (!think.isEmpty(this.get('groupid'))) {
      map.groupid = this.get('groupid')
    }
    const data = await this.dao.where(map).page(this.get('page') || 1, 20).order('id DESC').countSelect()
    const html = this.pagination(data);
    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', data.data);

    const memberGroup = await this.model('member_group').order('sort ASC').select();
    this.assign('memberGroup', memberGroup)

    // 获取管理组
    const role = this.model('auth_role').where({status: 1}).select();
    this.assign('role', role);

    const extadminleftlist = await this.model('ext').where({
      status: 1,
      isadm: 1
    }).order('sort DESC, installtime DESC').select();
    this.assign('extadminleftlist', extadminleftlist);

    return this.display();
  }

  async userlistAction () {
    // 用户列表
    const gets = this.get();
    const start = parseInt(gets.start, 10);
    const length = parseInt(gets.length, 10);
    const draw = gets.draw;
    const key = gets['search[value]'];
    const userList = await this.dao.join({
      table: 'customer',
      join: 'left',
      as: 'u',
      on: ['id', 'user_id']
    }).field('id,username,score,login,last_login_ip,last_login_time,status,u.real_name,u.group_id,u.balance').limit(start, length).where({
      username: ['like', '%' + key + '%'],
      status: ['>', -1]
    }).order('id DESC').countSelect();
    userList.data.forEach(v => {
      v.last_login_time = times(v.last_login_time);
      v.last_login_ip = _int2iP(v.last_login_ip);
    });
    // console.log(userList)
    const data = {
      'draw': draw,
      'recordsTotal': userList.count,
      'recordsFiltered': userList.count,
      'data': userList.data
    };
    return this.json(data);
  }

  /**
   * adduser
   * 添加用户
   * @returns {Promise|*}
   */
  async adduserAction () {
    this.meta_title = '添加用户';
    this.active = `${this.ctx.module}/user/index`

    if (this.isPost) {
      const data = this.post();
      if (data.password !== data.repassword) {
        return this.fail('两次填入的密码不一致');
      }
      data.password = encryptPassword(data.password);
      data.reg_time = new Date().getTime();
      if (data.vip === 1) {
        data.overduedate = new Date(data.overduedate).getTime();
      } else {
        data.overduedate = think.isEmpty(data.overduedate) ? 0 : data.overduedate;
      }
      // console.log(data);
      // return this.fail("ddd")
      data.status = 1;
      const self = this;
      let res;
      if (data.is_admin == 1) {
        res = await this.dao.transaction(async () => {
          // - const userId = await self.db.add(data);
          // + const userId = await self.dao.add(data);
          const userId = await self.dao.add(data);
          // - return await self.model('auth_user_role').db(self.db.db()).add({
          // + return await self.model('auth_user_role').db(self.dao.db()).add({
          return await self.model('auth_user_role').db(self.dao.db()).add({
            user_id: userId,
            role_id: data.role_id
          });
        });
      } else {
        res = await this.dao.add(data);
      }

      if (res) {
        return this.success({name: '添加成功！'});
      } else {
        return this.fail('添加失败!');
      }
    } else {
      // 会员组
      const usergroup = await this.model('member_group').select();
      this.assign('usergroup', usergroup);
      // 获取管理组
      const role = await this.model('auth_role').where({status: 1}).select();
      this.assign('role', role);
      return this.display();
    }
  }

  /**
   * 编辑头像
   * @returns {PreventPromise}
   */
  async edituserAction () {
    this.meta_title = '编辑用户';
    this.active = `${this.ctx.module}/user/index`

    if (this.isPost) {
      const data = this.post();
      // 删除头像
      if (data.delavatar == 1) {
        const uploadPath = think.resource + '/upload/avatar/' + data.id;
        const path = think.isFile(uploadPath + '/avatar.png');
        if (path) {
          think.rmdir(uploadPath, false);
        }
      }

      if (think.isEmpty(data.password) && think.isEmpty(data.repassword)) {
        delete data.password;
      } else {
        if (data.password !== data.repassword) {
          return this.fail('两次填入的密码不一致');
        }
        data.password = encryptPassword(data.password);
      }
      if (data.vip === 1) {
        if (think.isEmpty(data.overduedate)) {
          data.overduedate = new Date();
        }
        data.overduedate = new Date(data.overduedate).getTime();
      } else {
        data.overduedate = 0;
        data.vip = 0;
      }
      // 添加角色
      if (data.is_admin === 1) {
        const addrole = await this.model('auth_user_role').where({user_id: data.id}).thenAdd({
          user_id: data.id,
          role_id: data.role_id
        });
        // console.log(addrole);
        if (addrole.type === 'exist') {
          await this.model('auth_user_role').update({id: addrole.id, role_id: data.role_id});
        }
      }
      const res = await this.dao.update(data);

      if (res) {
        return this.success({name: '编辑成功！'});
      } else {
        return this.fail('编辑失败!');
      }
    } else {
      const id = this.get('id');
      const user = await this.model('member').find(id);
      // 不能修改超级管理员的信息
      if (!this.isAdmin) {
        if (in_array(id, this.config('user_administrator'))) {
          const error = this.controller('cx/error');
          return error.noAction('您无权操作！');
        }
      }
      this.assign('user', user);
      // console.log(user);
      // 所属管理组
      if (user.is_admin === 1) {
        const roleid = await this.model('auth_user_role').where({user_id: user.id}).getField('role_id', true);
        this.assign('roleid', roleid);
      }
      // 会员组
      const usergroup = await this.model('member_group').select();
      this.assign('usergroup', usergroup);
      // 获取管理组
      const role = await this.model('auth_role').where({status: 1}).select();
      this.assign('role', role);
      return this.display();
    }
  }

  /**
   * 显示用户信息
   * @returns {PreventPromise}
   */
  async showuserAction () {
    const id = this.get('id');
    const user = await this.model('member').find(id);
    // 非超级管理员只能修改自己的用户信息
    // if(!this.is_admin){
    //     if(this.user.uid!=id){
    //         this.http.error = new Error('您无权操作！');
    //         return think.statusAction(702, this.http);
    //     }
    //
    // }
    this.assign('user', user);
    // console.log(user);
    // 所属管理组
    if (user.is_admin === 1) {
      const roleid = await this.model('auth_user_role').where({user_id: user.id}).getField('role_id', true);
      this.assign('roleid', roleid);
    }
    // 会员组
    const usergroup = await this.model('member_group').select();
    this.assign('usergroup', usergroup);
    // 获取管理组
    const role = await this.model('auth_role').where({status: 1}).select();
    this.assign('role', role);
    this.meta_title = '个人信息';
    return this.display();
  }

  /**
   * userdel
   * 用户删除
   * @returns {Promise|*}
   */
  async userdelAction () {
    const id = this.para('ids');
    let res;
    // 判断是否是管理员，如果是不能删除;
    if (await this.verfiyAdmin(id)) {
      return this.fail('不能删除管理员!');
    } else {
      // res = await this.dao.where({id: id}).delete();
      // 逻辑删除
      res = await this.dao.where({id: ['IN', id]}).update({status: -1});
      if (res) {
        return this.success({name: '删除成功！'});
      } else {
        return this.fail('删除失败！');
      }
    }
  }

  /**
   * 改变角色状态
   * @returns {Promise|*}
   */
  async chstaAction () {
    const res = await this.dao.update(this.get());
    if (res) {
      return this.json(res);
    }
  }

  /**
   * 注册异步验证用户数据
   * @returns {Promise|*}
   */
  async parsleyAction () {
    // 验证
    const data = this.get();
    // console.log(data);
    const res = await this.dao.where(data).find();
    // console.log(res);
    if (think.isEmpty(res)) {
      return this.json(1);
    } else {
      return this.json(0);
    }
  }

  // 获取头像
  async avatarAction () {
    const uid = this.get('uid') || this.user.uid;
    const uploadPath = think.resource + '/upload/avatar/' + uid;
    const path = think.isFile(uploadPath + '/' + '/avatar.png');
    let pic;
    if (path) {
      pic = fs.readFileSync(uploadPath + '/' + '/avatar.png');
    } else {
      pic = fs.readFileSync(think.resource + '/upload/avatar/avatar.jpg');
    }
    this.header('Content-Type', 'image/png');
    return this.body = pic;
  }
}
