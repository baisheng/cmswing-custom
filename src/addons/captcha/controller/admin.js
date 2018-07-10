module.exports = class extends think.common.AddonAdmin {
  async indexAction () {
    return this.display()
  }
}
