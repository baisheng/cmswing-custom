/* eslint-disable no-useless-constructor */
const {parse} = require('url');
const BaseRest = require('./rest');

module.exports = class extends BaseRest {
  constructor (...args) {
    super(...args);
  }

  async __before () {
    // SSRF
    // const action = this.ctx.action;
/*    if (action !== 'get') {
      const referrer = this.ctx.referrer();
      const {site_url} = await this.model('options').getOptions()

      if (!referrer || !site_url) {
        return this.fail('REFERRER_ERROR');
      }

      const siteUrlHost = parse(site_url).host;
      const referrerHost = parse(referrer).host;
      if (!siteUrlHost || !referrerHost) {
        return this.fail('REFERRER_ERROR');
      }

      if (siteUrlHost.length < referrerHost.length) {
        if (referrerHost.slice(-siteUrlHost.length) !== siteUrlHost) {
          return this.fail('REFERRER_ERROR');
        }
      } else {
        if (siteUrlHost.slice(-referrerHost.length) !== referrerHost) {
          return this.fail('REFERRER_ERROR');
        }
      }
    }*/

  }
}
