/* eslint-disable no-eval,no-unreachable,no-undef */
const path = require('path');
const pack = require('../../../package.json');
/**
 * Home 模块，首页基础配置
 * @type {module.exports}
 */
module.exports = class extends think.Controller {
  constructor (...args) {
    super(...args)

    // Home view path
    this.HOME_VIEW_PATH = path.join(think.ROOT_PATH, 'view', 'home');
  }

  async __before () {
    this.assign('VERSION', pack.version)
    // console.log(think.app.controllers)
    // Set theme view root path
    // let theme = options.theme || 'vrcms'
    let theme = 'vrlab'
    this.THEME_VIEW_PATH = path.join(think.ROOT_PATH, 'www', 'theme', theme)
    this.setup = await think.config('setup')
    // 当前登录状态
    this.is_login = await this.islogin()

    // 用户信息
    this.user = {}
    // 访问控制
    if (this.is_login) {
      this.user.roleid = await this.model('member').where({id: this.is_login}).getField('groupid', true)
    }
    this.user = think.extend(this.user, await this.session('webuser'))
    // 设置主题
    // this.http.theme("default)
  }

  async displayView (name) {
    let viewpath = path.join(this.THEME_VIEW_PATH, name + '.html')
    return this.display(path.join(this.THEME_VIEW_PATH, name + '.html'))
  }
  /**
   * 独立模型模版渲染
   * @param p action
   * @param m pc||移动
   * @returns {*}
   */
  moduleDisplay (p = this.ctx.action, m = '') {
    let c = this.ctx.controller.split('/');
    if (this.ctx.controller === 'modadminbase') {
      c = `module/${this.mod.name}/admin`.split('/');
    }
    if (p === 'm' || !think.isEmpty(m)) {
      if (p === 'm') {
        p = this.ctx.action;
        if (this.ctx.controller === 'modadminbase') {
          p = 'index';
        }
      }
      // const pp = path.join(think.ROOT_PATH, 'src', 'controller', 'mod', c[1], 'view', 'mobile', c[2]);
      const pp = path.join(think.ROOT_PATH, 'src', 'module', 'controller', c[0], 'view', 'mobile', c[1]);
      return this.display(`${pp}_${p}`);
    } else {
      const pp = path.join(think.ROOT_PATH, 'src', 'module', 'controller', c[0], 'view', 'pc', c[1]);
      return this.display(`${pp}_${p}`);
    }
  }
  /**
   * 判断是否登录
   * @returns {boolean}
   */
  async islogin () {
    // 前台判断是否登录
    const user = await
      this.session('webuser')
    const res = think.isEmpty(user) ? false : user.uid
    return res
  }

  async weblogin () {
    const islogin = await
      this.islogin();
    if (!islogin) {
      return this.redirect('/common/error/login')
    }
  }

// 获取分类信息
  async category (id, field) {
    const error = think.app.controllers['common/error']
    id = id || 0;
    field = field || '';
    if (think.isEmpty(id)) {
      // this.fail('没有指定数据分类！');
      // this.http.error = new Error('没有指定数据分类！')
      return error.noAction('没有指定数据分类！')
    }
    const cate = await
      this.model('category').info(id, field)
    return cate;
    if (cate && cate.status === 1) {
      return cate
      /* 因定制需求暂时注释

  switch (cate.display) {
    case 0:
      // this.fail('该分类禁止显示')
      return error.noAction('该分类禁止显示！');
    default:
      return cate;
  }
  */

    } else {
      return error.noAction('分类不存在或者被禁用！')
    }
  }

  /**
   * 处理文档列表显示
   * @param {array} list 列表数据
   * @param {integer} model_id 模型id
   */
  async parseDocumentList (list, model_id) {
    model_id = model_id || 1;
    const attrList = await
      this.model('attribute').get_model_attribute(model_id, false, 'id,name,type,extra')
    if (think.isArray(list)) {
      list.forEach((data, k) => {
        for (const key in data) {
          if (!think.isEmpty(attrList[key])) {
            const extra = attrList[key].extra;
            const type = attrList[key].type;
            // console.log(extra);
            if (type == 'select' || type == 'checkbox' || type == 'radio' || type == 'bool') {
              // 枚举/多选/单选/布尔型
              const options = parse_config_attr(extra)
              const oparr = Object.keys(options)
              if (options && in_array(data[key], oparr)) {
                data[key] = options[data[key]]
              }
            } else if (type == 'date') { // 日期型
              data[key] = dateformat('Y-m-d', data[key])
            } else if (type == 'datetime') { // 时间型
              data[key] = dateformat('Y-m-d H:i', data[key])
            } else if (type === 'pics') {
              data[key] = `<span class="thumb-sm"><img alt="..." src="${data[key]}" class="img-responsive img-thumbnail"></span>`
            }
          }
        }
        data.model_id = model_id
        list[k] = data
      })
      return list
    }
  }

// 跨域设置
  setCorsHeader () {
    this.header('Access-Control-Allow-Origin', this.header('origin') || '*')
    this.header('Access-Control-Allow-Headers', 'x-requested-with')
    this.header('Access-Control-Request-Method', 'GET,POST,PUT,DELETE')
    this.header('Access-Control-Allow-Credentials', 'true')
  }
}
