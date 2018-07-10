/* eslint-disable no-undef */
/**
 * 模型前台控制器
 * 如果插件有前台展示业务，写在这个控制器里面
 */
module.exports = class extends think.common.Home {
  async __before () {
    await super.__before();
    // 判断是否登陆
    // await this.weblogin();
    if (!this.is_login) {
      // 判断浏览客户端
      // if (this.isMobile) {
      // return this.redirect('/center/public/login');
      // } else {
      return this.redirect('/account/login');
      // }
    }
  }

  /**
   * 学生列表页
   * @returns {Promise<void>}
   */
  async studentsAction () {
    this.active = 'module/experiment/index/students'
    this.meta_title = '学生数据列表'
    let data = {}
    // 查询当前教师的学生
    if (this.user.roleid == 2) {
      data = await this.model('membermeta').students(this.user.uid)
    }
    this.assign('list', data)
    return this.moduleDisplay()
    // return this.display('center/experiment/students')
  }

  /**
   * 学生报告列表页
   * @returns {Promise<void>}
   */
  async studentreportsAction () {
    this.active = 'module/experiment/index/studentreports'
    this.meta_title = '学生数据列表'
    let data = {}
    // 查询当前教师的学生
    if (this.user.roleid == 2) {
      data = await this.model('membermeta').students(this.user.uid)
    }
    this.assign('list', data)
    return this.moduleDisplay()
  }


  /**
   * 实验数据
   * @returns {Promise<*>}
   */
  async dataAction () {
    let id = this.get('id')
    this.active = 'module/experiment/index/data'
    this.meta_title = '实验数据'
    let data = {}
    if (this.user.roleid == 1) {
      data = await this.model('experiment_data').where({
        uid: this.user.uid
      }).page(this.get('page') || 1, 20).order('id DESC').countSelect()
    } else {
      if (!think.isEmpty(id)) {
        data = await this.model('experiment_data').where({
          uid: id
        }).page(this.get('page') || 1, 20).order('id DESC').countSelect()
      }
    }
    if (!think.isEmpty(data)) {
      const html = this.pagination(data)
      this.assign('pagerData', html)
    }
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
   * 添加报告
   * @returns {Promise<*>}
   */
  async reportAction () {
    if (this.isPost) {
      let data = this.post()
      data.uid = this.user.uid
      const currentTime = new Date().getTime().valueOf()
      if (think.isEmpty(data.id)) {
        data.date = currentTime
        data.modified = currentTime
        const res = await this.model('experiment_report').add(data)
        if (res > 0) {
          return this.success(res)
        } else {
          return this.fail('实验数据添加失败，请重试。')
        }
      } else {
        // data.date = currentTime
        data.modified = currentTime
        const res = await this.model('experiment_report').thenUpdate(data, {
          id: data.id
        })
        if (res > 0) {
          return this.success(res)
        } else {
          return this.fail('实验数据修改失败，请重试。')
        }
      }
    } else {
      this.meta_title = '实验报告'
      let data = {}
      if (this.user.roleid == 1) {
        data = await this.model('experiment_report').where({
          uid: this.user.uid
        }).page(this.get('page') || 1, 20).order('id DESC').countSelect()
        const html = this.pagination(data)
        this.assign('pagerData', html)
        this.assign('list', data.data)
      } else {
        let students = []
        // 查询当前教师的学生
        if (this.user.roleid == 2) {
          let id = this.get('id')
          if (!think.isEmpty(id)) {
            data = await this.model('experiment_report').where({
              uid: id
            }).select()
            this.assign('list', data)
          }
        }
      }
      return this.moduleDisplay()
    }


  }

  /**
   * 写报告
   * @returns {Promise<void>}
   */
  async writeAction () {
    if (this.isGet) {
      return this.moduleDisplay()
      // return this.display('center/experiment/write')
    }
  }

  /**
   * 报告的评价
   * @returns {Promise<*>}
   */
  async evaluatesAction () {
    // 获取报告 id
    const id = this.get('id')
    const data = await this.model('experiment_report').where({id: id}).find()
    // this.active = 'mod/experiment/admin/report'
    this.action = 'mod/experiment/index/report'
    if (think.isEmpty(id)) {
      return this.fail('请求参数错误')
    }
    let evaluates = await this.model('experiment_report_evaluates').where({
      report_id: id
    }).page(this.get('page') || 1, 20).order('id DESC').countSelect()
    for (let item of evaluates.data) {
      item.real_name = await get_realname(item.uid)
    }
    const html = this.pagination(evaluates)
    this.assign('pagerData', html)

    this.assign('evaluateList', JSON.stringify(evaluates.data))
    this.assign('list', evaluates.data)
    this.assign('data', data)
    return this.moduleDisplay()
  }

  /**
   * 修改报告
   * @returns {Promise<*>}
   */
  async editAction () {
    const id = this.get('id')
    if (think.isEmpty(id)) {
      return this.fail('请求错误')
    }
    const data = await this.model('experiment_report').where({
      id: id
    }).find()
    this.assign('data', data)
    return this.moduleDisplay()
    // return this.display('center/experiment/edit')
  }

  /**
   * 封面
   * @returns {Promise.<*>}
   */
  async indexAction () {
    // -- model调用
    // const list = await this.modModel('demo').select();
    // const list2 = await this.modModel('demo').demo();
    // const list3 = await think.modModel('demo','demo').demo();

    // -- 分页
    // const model = this.modModel('demo');
    // const data = await model.page(this.get('page')).countSelect(); // 获取分页数据
    // console.log(data);
    // const html = this.pagination(data); // 调取分页
    // this.assign('pagerData', html); // 分页展示使用

    // -- ext service
    // 无参数类的实例化
    // const Ser1 = this.modService('demo');
    // const Ser1 = think.modService('demo','demo');
    // const ser1 = Ser1.bbb('bbb');
    // console.log(ser1);
    // 有参数类的实例化
    // const Ser2 = this.modService('demo','demo','aaa','bbb');
    // const Ser2 = think.modService('demo','demo','aaa','bbb');
    // const ser2 = Ser2.aaa();
    // console.log(ser2);
    // 获取栏目信息
    const cate = this.m_cate;
    this.assign('category', cate);

    // 获取当前栏目的模型
    const model = this.mod;
    this.assign('model', model);

    // 面包屑
    await this.breadcrumb();
    if (this.isMobile) {
      return this.modDisplay('m');
    } else {
      return this.modDisplay();
    }
  }

  /**
   * 列表
   * @returns {Promise.<*>}
   */
  async listAction () {
    // 获取栏目信息
    const cate = this.m_cate;
    this.assign('category', cate);

    // 获取当前栏目的模型
    const model = this.mod;
    this.assign('model', model);

    // 面包屑
    await this.breadcrumb();

    // 模版渲染
    if (this.isMobile) {
      return this.modDisplay('m');
    } else {
      return this.modDisplay();
    }
  }
};
