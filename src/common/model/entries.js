// const Elements = require('./elements')

module.exports = class extends think.Model {

  // constructor () {
  //   super();
  // }

  async getEntryById (entryId, siteId) {
    if (!entryId) {
      return null;
    }
    return await this.model('entries').where({
      id: entryId
    }).find()
  }
}