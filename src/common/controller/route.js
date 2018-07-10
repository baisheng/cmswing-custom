/* eslint-disable no-return-assign */
module.exports = class extends think.common.Home {
  /**
   * 解析路由，判断是频道页面还是列表页面
   */
  async indexAction () {
    const cate = await this.category(this.get('category').split('-')[0]);
    if (think.isEmpty(cate)) {
      return cate;
    }
    let type = cate.allow_publish;
    if (Number(cate.mold) === 2) {
      type = 'sp';
    }

    switch (type) {
      case 0:
        if (Number(cate.mold) === 1) {
          await this.action('modindexbase', 'index');
        } else {
          await this.action('home/cover', 'index');
        }
        break;
      case 1:
      case 2:
        if (Number(cate.mold) === 1) {
          await this.action('modindexbase', 'list');
        } else {
          await this.action('list', 'index', 'home');
        }
        break;
      case 'sp':
        await this.action('home/sp', 'index');
        break;
      default: {
        return this.body = ':)'
      }
      // return this.body = '~';
    }
    // this.end(cate.allow_publish)
    // 获取当前栏目的模型
    // let models = await this.model("category",{},'admin').get_category(cate.id, 'model');
  }
};
