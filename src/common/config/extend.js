const view = require('think-view')
// const view = require('../extend/view')
const model = require('think-model')
const fetch = require('think-fetch')
const email = require('think-email')
const cache = require('think-cache')
const session = require('think-session')
const createI18n = require('think-i18n')
const path = require('path')

module.exports = [
  view, // make application support view
  model(think.app),
  fetch, // HTTP request client.
  email,
  cache,
  session,
  createI18n({
    app: think.app, // 如果为空，__ 就不会被自动 `assign` 到 `think-view` 实例
    i18nFolder: path.resolve(__dirname, '../i18n'),
    localesMapping (locales) {
      return 'cn'
    }
  })
];
