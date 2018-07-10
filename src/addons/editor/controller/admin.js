module.exports = class extends think.common.AddonAdmin {
  /**
   * index action
   * 插件管理入口
   * @return {Promise} []
   */
  async indexAction () {
    return this.extDisplay();
  }

  // 禁止卸载
  async uninstallAction () {
    return this.fail('禁止卸载!');
  }

  // 禁止删除
  async delextAction () {
    return this.fail('禁止删除!');
  }
};
