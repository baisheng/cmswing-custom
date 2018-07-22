const Elements = require('./elements')

module.exports = class extends think.Model {

  async getDraftById (draftId) {
    const result = this.field([
      'id',
      'entryId',
      'sectionId',
      'creatorId',
      // 'siteId',
      'name',
      'notes',
      'data',
      'dateCreated',
      'dateUpdated',
      'uid',
    ]).where({
      id: draftId
    }).find()
    if (!result) {
      return null;
    }
    result.data = JSON.parse(result.data)
    let entry = await this.model('entries').getEntryById(result.id, result.siteId);
    this._configureRevisionWithEntryProperties(result, entry)
    return result
  }
  // constructor () {
  //   super();
  // }

  // @flow
  async getVersionById (id) {
    // const entryVersionsModel = this.model('entryversions')
    const result = await this.field([
      'id',
      'entryId',
      'sectionId',
      'creatorId',
      // 'siteId',
      'num',
      'notes',
      'data',
      'dateCreated',
      'dateUpdated',
      'uid',
    ]).where({id: id}).find()
    if (!result) {
      return null;
    }
    result.data = JSON.parse(result.data)
    let entry = await this.model('entries').getEntryById(result.id, result.siteId);
    // this._configureRevisionWithEntryProperties(result, entry)
    // console.log(JSON.stringify(entry))
    this._configureRevisionWithEntryProperties(result, entry)
    return result
  }

  _configureRevisionWithEntryProperties (version, entry) {
    version.contentId = entry.contentId
    version.root = entry.root
    version.lft = entry.lft
    version.rgt = entry.rgt
    version.level = entry.level
    version.typeId = entry.typeId
  }
}
