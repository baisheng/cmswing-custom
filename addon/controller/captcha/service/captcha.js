const svgCaptcha = require('svg-captcha')
// const helper = require('think-helper')
const cacheFont = {}

module.exports = class extends think.Service {
  constructor (options) {
    super()
    const defaultOptions = {
      size: think.config('ext.captcha.size'), // size of random string
      ignoreChars: think.config('ext.captcha.ignoreChars'), // filter out some characters
      noise: think.config('ext.captcha.noise'), // number of noise lines
      color: think.config('ext.captcha.color'), // default grey, true if background option is set
      background: think.config('ext.captcha.background'), // background color of the svg image
      width: think.config('ext.captcha.width'), // width of captcha
      height: think.config('ext.captcha.height'), // height of captcha
      // fontPath: think.config('ext.captcha.fontPath'),
      fontSize: think.config('ext.captcha.fontSize'), // captcha text size
      charPreset: think.config('ext.captcha.charPreset') // random character preset
    }
    this.options = think.extend({}, defaultOptions, options)
    if (this.options.fontPath) {
      const theCacheFont = cacheFont[this.options.fontPath]
      if (theCacheFont) {
        this.options.font = theCacheFont
      } else {
        svgCaptcha.loadFont(this.options.fontPath)
        cacheFont[this.options.fontPath] = svgCaptcha.options.font
      }
    }
  }

  async create (ctx) {
    const captcha = svgCaptcha.create(this.options)
    await ctx.session('captcha', captcha.text)
    return captcha
  }

  svgCaptcha (text) {
    return svgCaptcha(text, this.options)
  }

  async verify (ctx, data) {
    // console.log(data)
    let sessionCaptcha = await ctx.session('captcha')

    const isValidate = data.captcha.toString().toLowerCase() === sessionCaptcha.toString().toLowerCase()
    return isValidate
  }
}
