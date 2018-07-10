/* eslint-disable no-undef,no-const-assign */
// import speakeasy from 'speakeasy';
const jwt = require('jsonwebtoken')
const Base = require('./base')

module.exports = class extends Base {
  /**
   * 用户登录
   *
   * @api {post} /api/signin 用户登录
   * @apiGroup Auth
   * @apiDescription 用户登录
   * @apiName signin
   * @apiGroup Auth
   * @apiParam {Integer} teacher 老师 id
   * @apiParam {String} username  用户名为手机号
   * @apiParam {password} password  密码
   * @apiSuccess {json} result
   *
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "errno": 0,
   *    "errmsg": "",
   *     "data": {
   *        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJsYXN0X2xvZ2luX3RpbWUiOjE1MjU4NDg1MzUzODcsImlhdCI6MTUyNTg0ODk3NiwiZXhwIjoxNTI2NDUzNzc2fQ.HDLxwuAjjdfYpeG6oLeJPyw6JvcWMXEW3yqkOIY65yA"
   *    }
   * }
   * @apiSampleRequest http://vrlab.ixueike.net/api/signin
   * @apiVersion 1.0.0
   */
  async postAction () {
    const teacherId = this.post('teacher')
    if (think.isEmpty(teacherId)) {
      return this.fail(404, '教师 id 不能为空')
    }
    const username = this.post('username');
    let password = this.post('password');
    password = encryptPassword(password);
    // 手机号登录验证
    const res = await this.model('cx/member').signin(username, password, this.ip, 3, 0);

    if (res.uid > 0) {
      // 添加老师与学生的关联
      await this.addStudent(teacherId, res.uid)

      // 获取签名盐
      const token = jwt.sign(res, 'vrsys', {expiresIn: '7d'})
      return this.success({token: token});
    } else { // 登录失败
      let fail;
      switch (res) {
        case 401:
          fail = '用户不存在或被禁用';
          break; // 系统级别禁用
        case 404:
          fail = '用户名或者密码不正确';
          break;
        default:
          fail = '未知错误';
          break; // 0-接口参数错误（调试阶段使用）
      }
      return this.fail(res, fail);
    }
  }

  /**
   * 添加学生关联
   *
   * @param teacherId
   * @param memberId
   * @returns {Promise<void>}
   */
  async addStudent (teacherId, memberId) {
    const memberMeta = this.model('cx/membermeta')
    const result = await memberMeta.where({
      member_id: teacherId,
      meta_key: 'students'
    }).find()
    let studentCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        studentCount = JSON.parse(result.meta_value).length
        const myTeacher = await think._.find(JSON.parse(result.meta_value), ['id', memberId.toString()])
        if (!myTeacher) {
          await memberMeta.newStudentForTeacher(teacherId, memberId)
          studentCount++
        }
      } else {
        return studentCount
      }
    } else {
      // 添加
      const addRes = await memberMeta.add({
        member_id: teacherId,
        meta_key: 'students',
        meta_value: ['exp', `JSON_ARRAY(JSON_OBJECT('id', '${memberId}', 'date', '${new Date().getTime()}'))`]
      })
      if (addRes > 0) {
        studentCount++
      }
      return studentCount
    }
  }
}
