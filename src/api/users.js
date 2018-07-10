/* eslint-disable no-undef,no-const-assign */
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')
const Base = require('./base')

module.exports = class extends Base {
  /**
   * 教师列表
   *
   * @api {get} /api/users/teacher 教师列表请求
   * @apiGroup Users
   * @apiDescription 教师列表数据
   * @apiName teacher
   * @apiParam {pagesize} pagesize 分页页面数据量
   * @apiParam {page} page 分页页码
   * @apiSuccess {json} result
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "errno": 0,
   *    "errmsg": "",
   *    "data": {
   *        "count": 8,
   *        "totalPages": 1,
   *        "pageSize": 10,
   *        "currentPage": 1,
   *        "data": [
   *            {
   *                "id": 1,
   *                "real_name": "小张1"
   *            },
   *            {
   *                "id": 4,
   *                "real_name": "崔小小12"
   *            },
   *            {
   *                "id": 6,
   *                "real_name": "孟令"
   *            },
   *            {
   *                "id": 16,
   *                "real_name": "汪亚珉"
   *            }
   *        ]
   *    }
   *}
   * @apiSampleRequest http://vrlab.ixueike.net/api/users/teacher
   * @apiVersion 1.0.0
   */
  async getAction () {
    const dao = this.model('cx/member')
    let type = this.get('type')
    if (type === 'teacher') {
      const data = await dao.page(this.get('page'), this.get('pagesize')).where({groupid: 2}).field('id, username, mobile, real_name').countSelect()
      // console.log(JSON.stringify(data))
      for (let user of data.data) {
        if (think.isEmpty(user.real_name)) {
          user.real_name = think.isEmpty(user.username) ? user.mobile : user.username
        }
        Reflect.deleteProperty(user, 'username')
        Reflect.deleteProperty(user, 'mobile')
      }
      return this.success(data)
    } else {
      return this.success({})
    }
  }
}
