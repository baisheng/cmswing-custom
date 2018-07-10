const helper = require('think-helper');
const nunjucks = require('nunjucks');
const path = require('path');
const fs = require('fs');

/**
 * default options for nunjucks
 * all available options via https://mozilla.github.io/nunjucks/api.html#configure
 */
const defaultOptions = {
  autoescape: true,
  watch: false,
  noCache: false,
  throwOnUndefined: false,
};

/**
 * nunjucks view adapter
 */
class Nunjucks {
  /**
   * constructor
   * @param {String} viewFile view file, an absolute file path
   * @param {Object} viewData view data for render file
   * @param {Object} config for nunjucks
   */
  constructor (viewFile, viewData, config) {
    this.viewFile = viewFile;
    this.viewData = viewData;
    this.config = config;
    this.modules = this.config.modules;
    this.handleOptions = helper.extend({}, defaultOptions, config.options);
  }

  newLoader (moduleName, dirs) {
    const NunjucksLoader = require('./lib/nunjucksLoader.js');
    return new NunjucksLoader(moduleName, dirs, undefined, this, this.handleOptions);
  }

  /**
   * render view file
   */
  render () {
    let dirs = []
    for (let module of this.modules) {
      dirs.push(`${think.ROOT_PATH}/src/${module}/views`)
    }
    const loader = this.newLoader('common', dirs, undefined, this)
    let env;

    env = new nunjucks.Environment(loader, { autoescape: true });

    // console.log(env)
    // const viewPath = this.config.viewPath;
    //
    // const viewFile = this.viewFile;
    // if (viewFile.indexOf(viewPath) !== 0) {
    //   env = nunjucks.configure(this.handleOptions);
    // } else {
    //   env = nunjucks.configure(viewPath, this.handleOptions);
    // }

    // this.addons = [];
    // let addonPath = `${think.ROOT_PATH}/src/addons`
    // if (helper.isDirectory(addonPath)) {
    //   this.addons = fs.readdirSync(addonPath).filter(item => {
    //     const stat = fs.statSync(path.join(addonPath, item));
    //     return stat.isDirectory();
    //   });
    // }

    // console.log(dirs)
    // console.log(loader)
    // var loader = this.newLoader(, dirs, undefined, this);
    //
    // const beforeRender = this.config.beforeRender;
    // if (beforeRender) {
    //   beforeRender(env, nunjucks, this.handleOptions);
    // }
    //
    // const fn = helper.promisify(env.render, env);
    // return fn(viewFile, this.viewData);
    console.log(this.viewFile)
    return;
  }
}

module.exports = Nunjucks;
