const Base = require('./base')

module.exports = class extends Base {
  /**
   * index action
   * @return {Promise} []
   */
  async indexAction () {
    this.meta_title = '实验图标管理';
    this.active = `${this.ctx.module}/tags/index`

    const res = await this.model('tags').order('sort DESC').page(this.get('page')).countSelect();
    const html = this.pagination(res);
    this.assign('pagerData', html);
    this.assign('list', res.data);
    await this.hook('adminUpPic', 'icon', 0, {$hook_key: 'icon'});
    return this.display();
  }

  /**
   * 获取全部图标列表
   * @returns {Promise<*>}
   */
  async listAction () {
    const res = await this.model('tags').select()
    // const res = await this.model('tags').order('sort DESC').page(this.get('page')).countSelect();

    return this.success(res)
  }
  /**
   * 添加内容
   */
  async addAction () {
    this.meta_title = '添加实验图标';
    this.active = `${this.ctx.module}/tags/index`

    if (this.isGet) {
      await this.hook('adminUpPic', 'icon', 0, {$hook_key: 'icon'});
      return this.display()
    }

    if (this.isAjax('post')) {
      let data = this.post()
      await this.model('tags').add(data)
      return this.success({name: '添加成功', url: '/admin/tags/index'})
    }
  }

  /**
   * 删除图标
   * @returns {Promise|*}
   */
  async deleteAction () {
    const id = this.get('id');
    const res = await this.model('tags').where({id: id}).delete();
    return this.success({name: '删除成功', url: '/admin/tags/index'})
  }

  /**
   * 修改图标信息
   *
   * @returns {Promise<*>}
   */
  async editAction () {
    this.meta_title = '修改实验图标';
    this.active = `${this.ctx.module}/tags/index`

    if (this.isGet) {
      const id = this.get('id');
      const data = await this.model('tags').where({id: id}).find()
      await this.hook('adminUpPic', 'icon', data.icon, {$hook_key: 'icon'});
      this.assign('data', data)
      return this.display()
    }
    if (this.isAjax('post')) {
      let data = this.post()
      await this.model('tags').thenUpdate(data, {id: data.id})
      return this.success({name: '添加成功', url: '/admin/tags/index'})
    }
  }
  // ajax添加tags
  async ajaxaddtagsAction () {
    const data = this.post();
    data.model_id = Number(data.model_id);
    const model = this.model('tags');
    const res = await model.where({name: data.name}).thenAdd(data);
    if (res.type == 'exist') {
      await model.where({id: res.id}).increment('num');
      return this.fail('已经存在，不要重复添加，请直接选择！');
    }
    const rdata = {
      errno: 0,
      id: res.id,
      name: data.name
    };
    return this.json(rdata);
  }

  async ajaxgettagsAction () {
    const map = this.get();
    const model = this.model('tags');
    const res = await model.where(map).select();
    return this.json(res);
  }
};
