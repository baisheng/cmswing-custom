module.exports = class extends think.common.AddonIndex {
  async captchaAction () {
    const svgCaptcha = think.addonService('captcha', 'captcha')
    // console.log(svgCaptcha)
    if (this.isGet) {
      const captcha = await svgCaptcha.create(this.ctx)
      // console.log(captcha)
      return this.success(captcha.data)
    }
  }
}
