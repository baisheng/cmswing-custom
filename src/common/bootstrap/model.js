/* eslint-disable camelcase,no-return-await */
/**
 * 获取模型字段信息
 * @param modelId 模型id 或 模型名称
 * @param id 数据id
 * @param field 字段
 * @param return 整条数据或字段数据
 */
global.getmodelfield = async(modelId, id, field) => {
  let res;
  const table = await think.model('model').get_table_name(modelId);
  const modelinfo = await think.model(table).find(id);
  if (!think.isEmpty(field)) {
    res = modelinfo[field];
  } else {
    res = modelinfo;
  }
  return res;
};
/**
 * 获取模型字段
 * @param model_id
 * @param field
 * @returns {*}
 */
global.get_model = async(modelId, field) => {
  return await think.model('model').get_model(modelId, field);
};
