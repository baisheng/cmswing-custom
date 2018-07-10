module.exports = class extends think.common.AddonIndex {
  // 后台登录，控制器验证
  async signinBefore () {
    const captcha = this.addonService('captcha', 'captcha')
    console.log(this.post())
    console.log('------c-c-c-c--c-c-c')
    const validate = await captcha.verify(this.ctx, this.post())
    return validate
  }

  async signinView () {
    // if is admin signinView
    const html = await this.hookRender('signinView', 'captcha')
    return html
  }
}
