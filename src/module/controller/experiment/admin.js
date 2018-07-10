/* eslint-disable no-undef */
module.exports = class extends think.common.ModuleAdmin {
  constructor (ctx) {
    super(ctx);
    this.tactive = 'mod/experiment/admin';
  }

  /**
   * 实验数据
   * @returns {Promise<*>}
   */
  async dataAction () {
    this.active = `${this.ctx.module}/experiment/admin/data`
    this.meta_title = '实验数据'
    const data = await this.model('experiment_data').page(this.get('page') || 1, 20).order('id DESC').countSelect()
    const html = this.pagination(data)
    this.assign('pagerData', html)
    this.assign('list', data.data)
    return this.moduleDisplay()
  }

  /**
   * 实验数据详情展示
   * @returns {Promise<*>}
   */
  async dataviewAction () {
    const id = this.get('id')
    const data = await this.model('experiment_data').where({
      id: id
    }).find()

    this.assign('data', data)
    return this.moduleDisplay()
  }

  /**
   * 添加实验报告评价
   * @returns {Promise<void>}
   */
  async evaluationAction () {
    if (this.isPost) {
      let data = this.post()
      const currentTime = new Date().getTime().valueOf()
      data.date = currentTime
      data.modified = currentTime

      // `vote` tinyint(4) NOT NULL COMMENT '4 优秀 3 良好 2中等 1较差',
      const res = await this.model('experiment_report_evaluates').add(data)
      if (res > 0) {
        await this.model('experiment_report').thenUpdate({
          evaluation: 1
        }, {id: data.report_id})

        const evaluates = await this.model('experiment_report_evaluates').where({
          report_id: data.report_id
        }).page(this.get('page') || 1, 20).order('id DESC').countSelect()
        return this.success(evaluates)
      } else {
        return this.fail('报告评价添加失败，请重试。')
      }
    } else {
      // this.assign('evaluateList', JSON.stringify(evaluates.data))
      // this.assign('data', data)
    }
  }

  /**
   * 实验报告详情展示
   * @returns {Promise<*>}
   */
  async reportviewAction () {
    const id = this.get('id')
    const data = await this.model('experiment_report').where({id: id}).find()
    this.active = 'mod/experiment/admin/report'
    this.tactive = 'report'
    this.meta_title = data.title
    let evaluates = await this.model('experiment_report_evaluates').where({
      report_id: id
    }).page(this.get('page') || 1, 20).order('id DESC').countSelect()

    for (let item of evaluates.data) {
      item.real_name = await get_realname(item.uid)
    }
    const html = this.pagination(evaluates)
    this.assign('pagerData', html)

    this.assign('evaluateList', JSON.stringify(evaluates.data))
    this.assign('data', data)
    return this.moduleDisplay()
  }

  /**
   * 添加报告
   * @returns {Promise<*>}
   */
  async reportAction () {
    this.meta_title = '实验报告'
    this.active = `${this.ctx.module}/experiment/admin/report`

    if (this.isPost) {
      let data = this.post()
      const currentTime = new Date().getTime().valueOf()
      data.date = currentTime
      data.modified = currentTime
      const res = await this.model('experiment_report').add(data)
      if (res > 0) {
        return this.success(res)
      } else {
        return this.fail('实验数据添加失败，请重试。')
      }
    }
    const data = await this.model('experiment_report').page(this.get('page') || 1, 20).order('id DESC').countSelect()
    const html = this.pagination(data)
    this.assign('pagerData', html)
    this.assign('list', data.data)

    return this.moduleDisplay()
  }

  /**
   * 模型后台管理入口
   * index action
   * @return {Promise} []
   */
  async indexAction () {
    this.active = 'mod/experiment/admin'

    // const cate = this.m_cate;
    // this.assign('category', cate);
    //
    // // 获取当前栏目的模型
    // const model = this.mod;
    // this.assign('model', model);
    // this.meta_title = this.m_cate.title;
    //
    // // 面包屑
    // await this.breadcrumb();
    // // 分组
    // const gid = this.get('group_id') || 0;
    // this.assign('group_id', gid);
    // // 获取分组
    // await this.groups();
    // const name = await this.model('category').get_category(cate.id, 'name') || cate.id;
    // this.assign({'navxs': true, 'name': name});
    //
    // const map = {};
    // // 获取当前分类的所有子栏目
    // if (cate.id) {
    //   const subcate = await this.model('category').get_sub_category(cate.id);
    //   subcate.push(cate.id);
    //   map.category_id = ['IN', subcate];
    // }
    // // 加入分组条件
    // if (gid) {
    //   map.group_id = gid;
    // }

    // 搜索
    // if (this.get('title')) {
    //   map.title = ['like', '%' + this.get('title') + '%'];
    // }
    // 分页列表实例
    // const list = await this.model('模型表名').where(map).order('update_time DESC').page(this.get('page'), 20).countSelect();
    // const html = this.pagination(list);
    // this.assign('list', list.data);
    // this.assign('pagerData', html); // 分页展示使用

    // 入口模版渲染
    return this.moduleDisplay();
  }

  /**
   * 添加
   * @returns {*}
   */
  async addAction () {
    // d

  }

  /**
   * 修改
   */
  async editAction () {

  }

  /**
   * 删除
   */
  async delAction () {

  }
};
