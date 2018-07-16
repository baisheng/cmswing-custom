const preventMessage = 'PREVENT_NEXT_PROCESS';
const lodash = require('lodash')
const path = require('path')
const qetag = require('./qetag')
const rootPath = think.ROOT_PATH

module.exports = {
  prevent () {
    throw new Error(preventMessage);
  },
  isPrevent (err) {
    return think.isError(err) && err.message === preventMessage;
  },
  _: lodash,
  // 文件上传排重
  etag: qetag,
  resource: path.join(rootPath, 'www'),
  UPLOAD_BASE_URL: '',
  TMPDIR_PATH: path.join(think.ROOT_PATH, 'runtime', 'tmp'),
  RUNTIME_PATH: path.join(think.ROOT_PATH, 'runtime'),
  UPLOAD_PATH: path.join(think.ROOT_PATH, 'www', 'upload'),

  common: {
    pkg: require(path.join(rootPath, 'package.json')),
    Admin: require(path.join(rootPath, 'src', 'common', 'controller', 'admin')),
    Home: require(path.join(rootPath, 'src', 'common', 'controller', 'home')),
    ModuleIndex: require(path.join(rootPath, 'src', 'common', 'controller', 'moduleIndex')),
    ModuleAdmin: require(path.join(rootPath, 'src', 'common', 'controller', 'moduleAdmin')),
    AddonIndex: require(path.join(rootPath, 'src', 'common', 'controller', 'addonIndex')),
    AddonAdmin: require(path.join(rootPath, 'src', 'common', 'controller', 'addonAdmin')),
    Error: require(path.join(rootPath, 'src', 'common', 'controller', 'error')),
    // modAdmin: require(path.join(rootPath, 'src', 'common', 'extend', 'picker', 'modAdminBase')),
  },
  addonModel (modelName = '', addonName = '', config = think.config('model.mysql'), prefix = 'ext_') {
    try {
      // const Cls = think.app.modules[`addons/${addonName}/model/${modelName}`];
      // const Cls = think.model(`${addonName}/model/${modelName}`, config, 'addons');
      // const Cls = think.app.controllers.addon[`${addonName}/model/${modelName}`]
      const Cls = think.addons[`${addonName}/model/${modelName}`]

      return new Cls(`${prefix}${modelName}`, config);
    } catch (e) {
      return think.model(`${prefix}${modelName}`);
    }
  },
  addonService (name = '', ser = '', ...args) {
    // const Cls = think.app.controllers.addons[`${ser}/service/${name}`]
    const Cls = think.app.services.addons[`${ser}/service/${name}`]
    // const Cls = think.addons[`${ser}/service/${name}`]
    if (think.isFunction(Cls)) {
      return new Cls(...args)
    }
    return Cls;
  },
  moduleModel (modelName = '', extName = '', config = think.config('model.mysql'), prefix = '') {
    try {
      const Cls = think.app.controllers[`mod/${extName}/model/${modelName}`]
      return new Cls(`${prefix}${modelName}`, config)
    } catch (e) {
      return think.model(`${prefix}${modelName}`)
    }
  },
  moduleService (name = '', ser = '', ...args) {
    const Cls = think.app.controllers[`mod/${ser}/service/${name}`]
    if (think.isFunction(Cls)) {
      return new Cls(...args)
    }
    return Cls
  }
}
