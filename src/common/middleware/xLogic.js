const assert = require('assert');
const helper = require('think-helper');

/**
 * invoke logic
 */
function invokeLogic (options, app) {
  return (ctx, next) => {
    const isMultiModule = app.modules.length;
    let logics = app.logics;

    if (isMultiModule) {
      assert(ctx.module, 'ctx.module required in multi module');
    }
    assert(ctx.controller, 'ctx.controller required');
    assert(ctx.action, 'ctx.action required');
    // avoid to throw error
    if (logics && isMultiModule) {
      logics = logics[ctx.module];
    }
    // logics empty
    if (helper.isEmpty(logics)) {
      return next();
    }
    let logic = logics[ctx.controller];
    if (ctx.controller.indexOf('ext') === 0 || ctx.controller.indexOf('mod') === 0) {
      const logickey = ctx.controller.split('/');
      logickey.splice(2, 0, 'logic');
      logic = app.controllers[logickey.join('/')];
    }
    // logic not exist
    if (helper.isEmpty(logic)) {
      return next();
    }
    const instance = new logic(ctx);
    let promise = Promise.resolve();
    if (instance.__before) {
      promise = Promise.resolve(instance.__before());
    }
    // if return false, it will be prevent next process
    return promise.then(data => {
      if (data === false) return false;
      let method = `${ctx.action}Action`;
      if (!instance[method]) {
        method = '__call';
      }
      if (instance[method]) {
        return instance[method]();
      }
    }).then(data => {
      if (data === false) return false;
      if (instance.__after) {
        return instance.__after();
      }
    }).then(data => {
      if (data !== false) {
        return next();
      }
    });
  };
}

module.exports = invokeLogic;
