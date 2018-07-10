module.exports = class extends think.Model {
  /**
   * 添加老师的学生
   *
   * @param teacherId
   * @param studentId
   * @returns {Promise<void>}
   */
  async newStudentForTeacher (teacherId, studentId) {
    await this.where({
      member_id: teacherId,
      meta_key: 'students'
    }).update({
      'member_id': teacherId,
      'meta_key': 'students',
      'meta_value': ['exp', `JSON_ARRAY_APPEND(meta_value, '$', JSON_OBJECT('id', '${studentId}', 'date', '${new Date().getTime()}'))`]
    })
  }

  /**
   * 获取老师的学生列表
   * @param teacherId
   * @returns {Promise<Array>}
   */
  async students (teacherId) {
    const result = await this.where({member_id: teacherId, meta_key: 'students'}).find()
    const students = []
    let totalCount = 0
    if (!think.isEmpty(result)) {
      if (!think.isEmpty(result.meta_value)) {
        const list = JSON.parse(result.meta_value)
        totalCount = list.length
        for (const u of list) {
          let student = await this.model('cx/member').where({id: u.id}).find()
          students.push(student)
        }
      }
    }
    return students
    // return {
    //   found: totalCount,
    //   teacherId: teacherId,
    //   students: students
    // }
  }
}
