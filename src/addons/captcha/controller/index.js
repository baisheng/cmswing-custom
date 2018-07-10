module.exports = class extends think.common.AddonIndex {
  async indexAction () {
    return this.success('welcome to captcha')
  }
  async captchaAction () {
    const svgCaptcha = this.addonService('captcha', 'captcha')
    if (this.isGet) {
      const captcha = await svgCaptcha.create(this.ctx)
      return this.success(captcha.data)
    }
  }
}
