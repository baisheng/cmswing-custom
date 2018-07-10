/* eslint-disable no-undef */
module.exports = class extends think.common.AddonAdmin {
  /**
   * index action
   * 插件管理入口
   * @return {Promise} []
   */
  async indexAction () {
    this.meta_title = '文件资源管理';
    this.active = `${this.ctx.module}/attachment/admin/index`

    const model = this.addonModel('attachment_pic');
    const data = await model.page(this.get('page'), 20).order('id DESC').countSelect(); // 获取分页数据
    const html = this.pagination(data); // 调取分页
    this.assign('pagerData', html); // 分页展示使用
    // for (const item of data.data) {
    //   item.time = think.datetime(item.create_time);
    //   item.path = await get_pdq(item.id);
    // }

    this.assign('list', data.data);
    // 入口模版渲染
    return this.addonDisplay();
  }

  async fileAction () {
    this.meta_title = '文件管理';
    this.active = `${this.ctx.module}/attachment/admin/index`
    const model = this.addonModel('attachment_file');
    const data = await model.page(this.get('page'), 20).order('id DESC').countSelect(); // 获取分页数据
    const html = this.pagination(data); // 调取分页
    this.assign('pagerData', html); // 分页展示使用
    for (const item of data.data) {
      item.time = think.datetime(item.create_time);
      item.path = await get_pic(item.id);
    }
    this.assign('list', data.data);
    // 入口模版渲染
    return this.addonDisplay();
  }

  async uploadAction () {
    return this.addonDisplay();
  }

  /**
   * 附件api管理
   * @returns {Promise.<*>}
   */
  async apiAction () {
    const model = this.addonModel('attachment');
    const data = await model.page(this.get('page')).countSelect(); // 获取分页数据
    const html = this.pagination(data); // 调取分页
    this.assign('pagerData', html); // 分页展示使用
    this.assign('list', data.data);
    return this.addonDisplay();
  }

  async addapiAction () {
    this.meta_title = '添加接口';
    return this.addonDisplay();
  }

  async editapiAction () {
    const id = this.get('id');
    const data = await this.addonModel('attachment').find(id);
    this.assign('data', data);
    this.meta_title = '修改接口';
    return this.addonDisplay('addapi');
  }

  async updateAction () {
    const data = this.post();
    const res = await this.addonModel('attachment').updates(data);
    if (think.isEmpty(res.id)) {
      return this.success({name: '添加成功', url: `/${this.ctx.controller}/api`});
    } else {
      return this.success({name: '更新成功', url: `/${this.ctx.controller}/api`});
    }
  }

  async ceshiAction () {
    const data = await this.addonModel('attachment').find(3);
    if (!think.isEmpty(data.rule)) {
      if (data.rule.indexOf('{') === 0) {
        const match = data.rule.match(/\${(\S+?)\}/g);
        console.log(match);
        const r = {id: 1, url: 'www.baidu.com'};
        const replace = [];
        for (let val of match) {
          val = val.replace(/(^\${)|(\}$)/g, '');
          replace.push(r[val]);
        }
        console.log(replace);
        const ddd = str_replace(match, replace, data.rule);
        console.log(ddd);
        console.log(JSON.parse(ddd));
      } else {
        const match = data.rule.match(/\${(\S+?)\}/g);
        const r = {id: 1, url: 'www.baidu.com'};
        console.log(match);
        const replace = [];
        for (let val of match) {
          val = val.replace(/(^\${)|(\}$)/g, '');
          replace.push(r[val]);
        }
        const ddd = str_replace(match, replace, data.rule);
        console.log(ddd);
      }
    }
    return this.body = data;
  }

  /**
   * 验证同一张表是否存在相同的子段值
   * @returns {*}
   */
  async checkextAction () {
    const get = this.get();
    // let key = think._.keys(get)[0];
    // let val = get[key];
    const res = await this.addonModel('attachment').where(get).count();
    if (res) {
      return this.json(0);
    } else {
      return this.json(1);
    }
  }

  // 禁止卸载
  // async uninstallAction () {
  //   return this.fail('禁止卸载!');
  // }

  // 禁止删除
  async delextAction () {
    return this.fail('禁止删除!');
  }
};
