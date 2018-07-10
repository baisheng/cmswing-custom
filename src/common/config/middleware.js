const path = require('path');
const isDev = think.env === 'development';
const cors = require('@koa/cors')
const jwt = require('koa-jwt')
const xRouter = require('../middleware/router')
const xController = require('../middleware/controller')
module.exports = [
  {
    handle: 'meta',
    options: {
      logRequest: isDev,
      sendResponseTime: isDev
    }
  },
  {
    handle: 'resource',
    enable: isDev,
    options: {
      root: path.join(think.ROOT_PATH, 'www'),
      publicPath: /^\/(static|themes|theme|favicon\.ico)/
    }
  },
  {
    handle: 'trace',
    enable: !think.isCli,
    options: {
      debug: isDev,
      contentType (ctx) {
        // All request url starts of /api or
        // request header contains `X-Requested-With: XMLHttpRequest` will output json error
        if (!isDev) {
          return 'json';
        }
        const APIRequest = /^\/admin\/api/.test(ctx.request.path);
        const AJAXRequest = ctx.is('X-Requested-With', 'XMLHttpRequest');

        return APIRequest || AJAXRequest ? 'json' : 'html';
      },
      // basic set as string, then put 404.html, 500.html into error folder
      // templates: path.join(__dirname, 'error'),
      // customed set as object
      templates: {
        404: path.join(__dirname, 'error/404.html'),
        500: path.join(__dirname, 'error/500.html'),
        502: path.join(__dirname, 'error/502.html')
      },
      sourceMap: false,
      error (err, ctx) {
        if (think.isPrevent(err)) {
          return false;
        }
        console.error(err);
      }
    }
  },
  {
    handle: 'payload',
    options: {
      uploadDir: path.join(think.ROOT_PATH, 'runtime/data')
    }
  },
  {
    handle: xRouter,
    // handle: 'router',
    options: {
      // 是否对首页进行优化，默认值为 true（开启后如果访问地址是首页，那么不会进行自定义路由匹配）
      optimizeHomepageRouter: false,
      defaultModule: 'home',
      defaultController: 'index',
      defaultAction: 'index',
      prefix: [],
      suffix: ['.html'],
      enableDefaultRouter: true,
      subdomainOffset: 2,
      subdomain: {},
      denyModules: []
    }
  },
  // {
  //   handle: (option, app) => {
  //     return (ctx, next) => {
  //       return next().catch((err) => {
  //         // eslint-disable-next-line yoda
  //         if (401 === err.status) {
  //           ctx.status = 401;
  //           ctx.body = 'Protected resource, use Authorization header to get access\n';
  //         } else {
  //           ctx.body = 'Protected resource, use Authorization header to get access\n';
  //           throw err;
  //         }
  //       });
  //     };
  //   }
  // },
  {
    handle: cors,
    options: {}
  },
  {
    handle: jwt,
    options: {
      secret: 'vrsys'
    },
    match: ctx => {
      return false
      // console.log(ctx.url)
      // if (ctx.url.match(ctx.url.match(/^\/api\/signin?/) || ctx.url.match(/^\/apidocs?/) || ctx.url.match(/^\/plugins?/))) {
      //   return false
      // } else if (ctx.url.match(/^\/api*?\/*/)) {
      //   return true
      // }
      /*
      if (ctx.url.match(ctx.url.match(/^\/v1\/org\/\d+\/subdomain_validation|signin|signout?/) ||
              ctx.url.match(/^\/v1\/apps\/\w+\/options?/) ||
              ctx.url.match(/^\/v1\/apps\/\w+\/auth\/token|verify?/))) {

              return false;
            } else if (ctx.url.match(ctx.url.match(/^\/v1*?/) || ctx.url.match(/^\/v2*?/))) {
              return true
            }
            */
    }
  },
  // 'xLogic',
  'logic',
  {
    handle: xController
  }
];
