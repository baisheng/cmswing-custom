const helper = require('think-helper');
const path = require('path');
const fs = require('fs');
const common = require('./common.js');

/**
 * Loader
 */
class Loader {
  /**
   * constructor
   */
  constructor(appPath) {
    this.appPath = appPath;
    // this.thinkPath = thinkPath;
    this.addons = [];
    // const dir = path.join(appPath, 'common/config');
    // if (helper.isDirectory(dir)) {
    //   this.addons = fs.readdirSync(appPath).filter(item => {
    //     const stat = fs.statSync(path.join(appPath, item));
    //     return stat.isDirectory();
    //   });
    // }
    this.addons = [];
    let addonPath = `${think.ROOT_PATH}/src/addons`
    if (helper.isDirectory(addonPath)) {
      this.addons = fs.readdirSync(addonPath).filter(item => {
        const stat = fs.statSync(path.join(addonPath, item));
        return stat.isDirectory();
      });
    }
  }
  /**
   * load config
   */
  loadConfig(env) {
    // return (new Config()).load(this.appPath, this.thinkPath, env, this.modules);
  }
  /**
   * load controller
   */
  loadController() {
    return common.load(this.appPath, 'controller', this.addons);
  }
  /**
   * load model
   */
  // loadModel() {
  //   return common.load(this.appPath, 'model', this.modules);
  // }
  /**
   * load service
   */
  loadService() {
    return common.load(this.appPath, 'service', this.addons);
  }

}


module.exports = Loader;
