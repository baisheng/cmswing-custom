module.exports = class extends think.Model {
  /**
   * 获取用户组并进行缓存
   * @returns {Promise}
   */
  async getgroup (map = {}) {
    const list = await think.cache('all_member_group', () => {
      return this.select();
    }, {timeout: 365 * 24 * 3600});
    if (think.isEmpty(map)) {
      return list;
    } else {
      return think._.filter(list, map);
    }
  }
};
