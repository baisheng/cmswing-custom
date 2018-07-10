/* eslint-disable no-useless-constructor */
const Base = require('./base')
const Ajv = require('ajv');
const ajv = new Ajv(); // options can be passed, e.g. {allErrors: true}

module.exports = class extends Base {
  constructor (...args) {
    super(...args)
  }

  /**
   * @api {post} /api/experiment 实验数据添加接口
   * @apiGroup Experiment
   * @apiDescription 实验数据
   * @apiName Experiment
   * @apiHeader  Authorization  Basic Access Authentication token.
   * @apiHeaderExample {json} Header-Example:
   * {
   *    "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsInVzZXJuYW1lIjoiYWRtaW4iLCJsYXN0X2xvZ2luX3RpbWUiOjE1MjU4NDg1MzUzODcsImlhdCI6MTUyNTg0ODk3NiwiZXhwIjoxNTI2NDUzNzc2fQ.HDLxwuAjjdfYpeG6oLeJPyw6JvcWMXEW3yqkOIY65yA"
   * }
   * @apiError {text}   401/Unauthorized
   * @apiError {text}   403/Forbidden
   * @apiError {text}   1000/type 数据值类型校验错误
   * @apiErrorExample {json} Error-Response:
   * {
   * "errno": 1000,
   * "errmsg": [
       * {
       *     "keyword": "type",
       *     "dataPath": "[0].experiment",
       *     "schemaPath": "#/items/properties/experiment/type",
       *     "params": {
       *         "type": "integer"
       *     },
       *     "message": "should be integer"
       * }
    *]}
   * @apiParam {jsonArray} data 批量数据内容
   * @apiParamExample {json} Request-Example:
   * [{
   *      "experiment": 1,
   *      "c1": 1.2,
   *      "c2": 2.3,
   *      "r1": 1.2,
   *      "r2": 2.1,
   *      "r3": 3.2,
   *      "t1": 1.2,
   *      "t2": 2.1,
   *      "a1": 1.2,
   *      "a2": 2.5,
   *      "a3": 3.6
   * }, {…}]
   * @apiSuccess {json} result
   * @apiSuccessExample {json} Success-Response:
   * {
   *    "errno": 0,
   *    "errmsg": "",
   *    "data": [
   *        28,
   *        29,
   *        30,
   *        31,
   *        32
   *    ]
   *}
   * @apiSampleRequest http://vrlab.ixueike.net/api/experiment
   * @apiVersion 1.0.0
   */
  async postAction () {
    const schema = {
      "title": "实验数据",
      "description": "实验数据数组数据，用于一次实验指提交",
      "type": "array",
      "items": {
        "properties": {
          "experiment": {"type": "integer"},
          "c1": {"type": "number"},
          "c2": {"type": "number"},
          "r1": {"type": "number"},
          "r2": {"type": "number"},
          "r3": {"type": "number"},
          "t1": {"type": "number"},
          "t2": {"type": "number"},
          "a1": {"type": "number"},
          "a2": {"type": "number"},
          "a3": {"type": "number"}
        },
        "type": "object"
      },
      "minItems": 1
    }
    const validate = ajv.compile(schema);

    let data = this.post()
    const jwtUser = this.ctx.state.user
    if (think.isEmpty(jwtUser)) {
      return this.fail('非法提交，请重新登录。')
    }
    const currentTime = new Date().getTime()
    let batData = JSON.parse(data.data)

    const valid = validate(batData);
    if (!valid) {
      return this.fail(validate.errors)
    } else {
      for (let item of batData) {
        item.date = currentTime
        item.modified = currentTime
        item.uid = jwtUser.uid
      }
      let insertIds = await this.model('experiment_data').addMany(batData)
      if (insertIds) {
        return this.success(insertIds)
      } else {
          return this.fail('数据添加失败，请重试。')
      }
    }
  }
}
