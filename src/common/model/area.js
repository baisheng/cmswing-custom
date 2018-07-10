/* eslint-disable no-return-await */
module.exports = class extends think.Model {
  async getArea(id) {
    return await this.where({id: id}).getField('name', true);
  }
};
