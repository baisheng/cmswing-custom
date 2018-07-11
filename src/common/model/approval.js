/**
 * 审核数据模型
 * @type {module.exports}
 */
module.exports = class extends think.Model {
  /**
     * 添加审核
     * @param model
     * @param uid
     * @param title
     * @param data
     * @returns {Promise}
     */
  async adds(model, uid, title, data) {
    const res = await this.add({model: model, uid: uid, title: title, data: JSON.stringify(data), time: new Date().getTime()});
    return res;
  }
};
