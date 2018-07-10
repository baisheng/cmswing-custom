// invoked in worker
// 工作线程
// invoked in worker
require('./global');
require('./model');
require('./tags');
const helper = require('think-helper');
// const commonLoader = require('./loader/common');
const AddonLoader = require('./loader');
const path = require('path');
const fs = require('fs');

think.beforeStartServer(async () => {
  // 加载网站配置
  const webconfig = await think.model('setup').getset()
  think.config('setup', webconfig)
  // 加载扩展配置
  const extconfig = await think.model('ext').getset()
  think.config('ext', extconfig)

  const addonControllers = new AddonLoader(`${think.ROOT_PATH}/src/addons/`).loadController()
  const addonServices = new AddonLoader(`${think.ROOT_PATH}/src/addons/`).loadService()
  think.app.controllers = think.extend(think.app.controllers, addonControllers, addonServices);
  think.app.services = think.extend(think.app.services, addonServices);
});
