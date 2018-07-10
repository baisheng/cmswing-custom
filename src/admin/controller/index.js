const Base = require('./base')

module.exports = class extends Base {
  async indexAction () {
    this.meta_title = '首页'
    await this.hook('AdminIndex')
    return this.display();
  }
}
