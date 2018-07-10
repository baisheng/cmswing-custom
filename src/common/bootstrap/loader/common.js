/* eslint-disable guard-for-in */

const helper = require('think-helper');
const path = require('path');
const interopRequire = require('./util.js').interopRequire;
const debug = require('debug')(`think-loader-common-${process.pid}`);

const CommonLoader = {
  // 加入前续是为了插件请求时可以方便的识别文件内容
  loadFiles (dir, prex, type) {
    const files = helper.getdirFiles(dir).filter(file => {
      return /\.js$/.test(file);
    });
    const cache = {};
    files.forEach(file => {
      const name = file.replace(/\\/g, '/').replace(/\.js$/, '');
      const filepath = path.join(dir, file);
      const fileExport = interopRequire(filepath);
      // add __filename to export when is class
      if (helper.isFunction(fileExport)) {
        fileExport.prototype.__filename = filepath;
      }
      debug(`load file: ${filepath}`);
      if (type === 'controller') {
        cache[prex + '/' + name] = fileExport;
      }
      if (type === 'service') {
        cache[prex + '/service/' + name] = fileExport;
      }
    });
    return cache;
  },
  sort (obj) {
    const cache = Object.keys(obj).map(item => {
      return {name: item, export: obj[item]};
    }).sort((a, b) => {
      const al = a.name.split('/').length;
      const bl = b.name.split('/').length;
      if (al === bl) {
        return a.name < b.name ? 1 : -1;
      }
      return al < bl ? 1 : -1;
    });
    const ret = {};
    for (const name in cache) {
      ret[cache[name].name] = cache[name].export;
    }
    return ret;
  },
  // load (appPath, type, modules) {
  //   if (modules.length) {
  //     const cache = {};
  //     modules.forEach(item => {
  //       cache[item] = {};
  //       const itemCache = CommonLoader.loadFiles(path.join(appPath, item, type));
  //       for (const name in itemCache) {
  //         cache[item][name] = itemCache[name];
  //       }
  //     });
  //     // merge common modules to every module
  //     if (cache.common) {
  //       for (const m in cache) {
  //         if (m === 'common') {
  //           continue;
  //         }
  //         cache[m] = Object.assign({}, cache.common, cache[m]);
  //         cache[m] = CommonLoader.sort(cache[m]);
  //       }
  //     }
  //     return cache;
  //   } else {
  //     const dir = path.join(appPath, type);
  //     const obj = CommonLoader.loadFiles(dir);
  //     return CommonLoader.sort(obj);
  //   }
  // },
  load (appPath, type, addons) {
    if (addons.length) {
      // const cache = {};
      let addonList = []

      addons.forEach(item => {
        // cache[item] = {};
        const addonItem = CommonLoader.loadFiles(path.join(appPath, item, type), item, type);
        addonList.push(addonItem)
        // for (const name in itemCache) {
        //   cache[item][name] = itemCache[name];
        // }
      });
      let types = {}
      for (let c of addonList) {
        types = think.extend(types, c)
      }
      return {'addons': types };
    } else {
      const dir = path.join(appPath, type);
      const obj = CommonLoader.loadFiles(dir);
      return CommonLoader.sort(obj);
    }
  }

};

module.exports = CommonLoader;
