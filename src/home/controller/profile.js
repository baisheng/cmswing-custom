/* eslint-disable no-return-assign */
const fs = require('fs');
const Jimp = require('jimp');

const Base = require('./base.js');
module.exports = class extends Base {
  /**
   * index action
   * 用户中心主页
   * @return {Promise} []
   */
  async indexAction () {
    if (!this.is_login) {
      return this.redirect('/account/login');
    }
    this.active = '/'
    this.tactive = 'index';
    // 判断是否登陆
    await this.weblogin();
    // 获取用户信息
    // const userInfo = await this.model('member').find(this.user.uid);
    // 获取用户信息
    const userInfo = await this.model('member').join({
      table: 'member_group',
      join: 'left',
      as: 'c',
      on: ['groupid', 'groupid']
    }).find(this.user.uid);
    this.assign('userInfo', userInfo);
    // 获取省份
    const province = await this.model('area').where({parent_id: 0}).select()
    const city = await this.model('area').where({parent_id: userInfo.province}).select();
    const county = await this.model('area').where({parent_id: userInfo.city}).select();

    this.assign('province', province);
    this.assign('city', city);
    this.assign('county', county);
    this.meta_title = '用户中心';
    return this.displayView('profile');
  }

  // 获取头像
  async avatarAction () {
    const uid = this.get('uid') || this.user.uid;
    const uploadPath = `${think.resource}/upload/avatar/${uid}`;
    const path = think.isFile(`${uploadPath}/avatar.png`);
    let pic;
    if (path) {
      pic = fs.readFileSync(`${uploadPath}/avatar.png`);
    } else {
      pic = fs.readFileSync(`${think.resource}/upload/avatar/avatar.jpg`);
    }
    this.header('Content-Type', 'image/png');
    return this.body = pic;
  }


  // 更新用户信息
  async updateinfoAction () {
    // 判断是否登陆
    await this.weblogin();
    const data = this.post();
    // think.log(data);
    const member = {
      email: data.email,
      mobile: data.mobile,
      real_name: data.real_name,
      sex: data.sex,
      birthday: new Date(data.birthday).getTime(),
      province: data.province,
      city: data.city,
      county: data.county,
      addr: data.addr
    };

    const update = await this.model('member').where({id: this.user.uid}).update(member);
    // think.log(customer);
    if (update) {
      this.assign('userInfo', member);
      return this.success({name: '更新用户资料成功！'});
    } else {
      return this.fail('更新失败！');
    }
  }

  // 修改密码
  async updatepasswordAction () {
    // 判断是否登陆
    await this.weblogin();
    const data = this.post();
    if (think.isEmpty(data.password)) {
      return this.fail('请填写新密码！');
    }
    const password = await this.model('member').where({id: this.user.uid}).getField('password', true);
    if (password === encryptPassword(data.oldpassword)) {
      await this.model('member').where({id: this.user.uid}).update({password: encryptPassword(data.password)});
      return this.success({name: '密码修改成功，请用新密码重新登陆！'});
    } else {
      return this.fail('旧密码不正确，请重新输入。');
    }
  }

  // 上传头像
  async updateavatarAction () {
    // 判断是否登陆
    await this.weblogin();
    const file = think.extend({}, this.file('file'));
    // console.log(file);
    // think.log(avatar_data);
    const filepath = file.path;
    // 文件上传后，需要将文件移动到项目其他地方，否则会在请求结束时删除掉该文件
    const uploadPath = think.resource + '/upload/avatar/' + this.user.uid;
    think.mkdir(uploadPath);
    let res;
    if (this.isMobile) {
      const jimp2 = () => {
        console.log(111);
        const deferred = think.defer();
        const self = this;
        Jimp.read(filepath, function (err, lenna) {
          if (err) { throw err; }
          lenna.resize(200, 200) // resize
            .quality(60) // set JPEG quality
            .write(uploadPath + '/avatar.png', function (e, r) {
              deferred.resolve('/upload/avatar/' + self.user.uid + '/avatar.png');
            }); // save
        });
        return deferred.promise;
      };
      res = await jimp2();
    } else {
      const post = this.post();
      const avatar_data = JSON.parse(post.avatar_data);
      const jimp = () => {
        const deferred = think.defer();
        const self = this;
        Jimp.read(filepath, function (err, lenna) {
          // console.log(lenna)

          if (err) { throw err; }
          lenna.crop(avatar_data.x, avatar_data.y, avatar_data.width, avatar_data.height) // resize
            .quality(60)
            .write(uploadPath + '/avatar.png', function (e, r) {
              deferred.resolve('/upload/avatar/' + self.user.uid + '/avatar.png');
            }); // save
        });
        return deferred.promise;
      };
      res = await jimp();
    }

    // think.log(res);
    const data = {
      'result': res,
      'errno': 0,
      'message': '头像上传成功！'
    };
    return this.json(data);
  }

}
