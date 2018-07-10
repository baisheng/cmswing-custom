/* eslint-disable no-undef,max-depth,new-cap */
const Base = require('./base.js');

module.exports = class extends Base {
  async indexAction () {
    this.meta_title = 'homeTitle'
    // 为首页提供默认分类内容展示
    let defaultCategory = think.config('setup.default_category')
    const categoryId = this.get('category') || defaultCategory
    let id = 0
    const query = categoryId.split('-')
    if (categoryId !== 0) {
      id = query[0]
    }
    let cate = await this.category(id)
    cate = think.extend({}, cate)

    const models = await this.model('category').get_category(cate.id, 'model');
    // 获取模型信息
    let modellist = [];
    if (think.isEmpty(models)) {
      modellist = null;
    } else {
      for (const val of models.split(',')) {
        const modelobj = {};
        modelobj.id = val;
        modelobj.title = await this.model('model').get_model(val, 'title')
        modellist.push(modelobj)
      }
    }
    this.assign('modellist', modellist)
    this.assign('model', models.split(','))

    // 获取当前分类的所有子栏目
    const subcate = await this.model('category').get_sub_category(cate.id)
    subcate.push(cate.id);
    // 获取模型列表数据个数
    let num
    if (cate.list_row > 0) {
      num = cate.list_row;
    } else if (cate.model.split(',').length === 1) {
      const pagenum = await this.model('model').get_model(cate.model, 'list_row');
      if (pagenum !== 0) {
        num = pagenum;
      }
    } else {
      num = this.config('db.nums_per_page');
    }

    const map = {
      'pid': 0,
      'status': 1,
      'category_id': ['IN', subcate]
    }

    // 排序
    const o = {};
    o.level = 'DESC';
    let order = query[1] || 0;
    order = Number(order);
    switch (order) {
      case 1:
        o.update_time = 'ASC';
        break;
      case 2:
        o.view = 'DESC';
        break;
      case 3:
        o.view = 'ASC';
        break;
      case 4:
        map.update_time = {
          '>': new Date(GetDateStr(0) + ' ' + '00:00:00').getTime(),
          '<': new Date(GetDateStr(0) + ' ' + '23:59:59').getTime()
        };
        o.update_time = 'DESC';
        break;
      case 5:
        map.update_time = {
          '>': new Date(GetDateStr(1) + ' ' + '00:00:00').getTime(),
          '<': new Date(GetDateStr(5) + ' ' + '23:59:59').getTime()
        };
        o.update_time = 'DESC';
        break;
      case 6:
        map.update_time = {'<': new Date().getTime()};
        map.deadline = {'>': new Date().getTime()};
        o.update_time = 'DESC';
        break;
      case 7:
        map.deadline = {'<': new Date().getTime()};
        o.update_time = 'DESC';
        break;
      default:
        o.update_time = 'DESC';
    }
    this.assign('order', order);
    // 获取分类信息
    let sortid = query[3] || 0;
    if (!think.isEmpty(sortid)) {
      map.sort_id = sortid;
    }
    let sortarr = query[4] ? decodeURIComponent(query[4]) : null;
    let nsobj = {};
    let sort = await this.model('category').get_category(cate.id, 'documentsorts');
    if (sort) {
      this.assign('sorturl', categoryId.split('-')[4]);
      sort = JSON.parse(sort);
      if (sortid == 0) {
        sortid = sort.defaultshow;
      }
      const typevar = await this.model('typevar').where({sortid: sortid}).order('displayorder ASC').select();
      for (const val of typevar) {
        val.option = await this.model('typeoption').where({optionid: val.optionid}).find();
        if (val.option.type === 'select' || val.option.type === 'radio') {
          if (!think.isEmpty(val.option.rules)) {
            val.option.rules = JSON.parse(val.option.rules);
            val.rules = parse_type_attr(val.option.rules.choices);
            val.option.rules.choices = parse_config_attr(val.option.rules.choices);
            // console.log(val.rules);
          }
        } else if (val.option.type === 'checkbox') {
          if (!think.isEmpty(val.option.rules)) {
            val.option.rules = JSON.parse(val.option.rules);
            val.rules = parse_type_attr(val.option.rules.choices);
            for (const v of val.rules) {
              v.id = 'l>' + v.id;
            }
            val.option.rules.choices = parse_config_attr(val.option.rules.choices);
          }
        } else if (val.option.type === 'range') {
          if (!think.isEmpty(val.option.rules)) {
            const searchtxt = JSON.parse(val.option.rules).searchtxt;
            const searcharr = [];
            if (!think.isEmpty(searchtxt)) {
              const arr = searchtxt.split(',');
              const len = arr.length;
              for (let i = 0; i < len; i++) {
                const obj = {};
                if (!think.isEmpty(arr[i - 1])) {
                  if (i == 1) {
                    obj.id = 'd>' + arr[i];
                    obj.name = '低于' + arr[i];
                    obj.pid = 0;
                    searcharr.push(obj);
                  } else {
                    obj.id = arr[i - 1] + '>' + arr[i];
                    obj.name = arr[i - 1] + '-' + arr[i];
                    obj.pid = 0;
                    searcharr.push(obj);
                  }
                }
              }
              searcharr.push({id: 'u>' + arr[len - 1], name: '高于' + arr[len - 1], pid: 0});
            }
            val.option.rules = JSON.parse(val.option.rules);
            val.rules = searcharr;
          }
        }
      }
      this.assign('typevar', typevar);
    }

    if (!think.isEmpty(sortarr)) {
      sortarr = sortarr.split('|');

      nsobj = {};
      const optionidarr = [];
      const valuearr = [];
      for (const v of sortarr) {
        const qarr = v.split('_');
        nsobj[qarr[0]] = qarr[1];
        if (qarr[1] != 0) {
          const vv = qarr[1].split('>');
          // console.log(vv);
          if (vv[0] == 'd' && !think.isEmpty(vv[1])) {
            map['t.' + qarr[0]] = ['<', vv[1]];
          } else if (vv[0] == 'u' && !think.isEmpty(vv[1])) {
            map['t.' + qarr[0]] = ['>', vv[1]];
          } else if (vv[0] == 'l' && !think.isEmpty(vv[1])) {
            map['t.' + qarr[0]] = ['like', `%"${vv[1]}"%`];
          } else if (!think.isEmpty(vv[0]) && !think.isEmpty(vv[1])) {
            map['t.' + qarr[0]] = ['BETWEEN', Number(vv[0]), Number(vv[1])];
          } else {
            map['t.' + qarr[0]] = qarr[1];
          }
        }
      }
      map.fid = cate.id;
      // where.optionid = ["IN",optionidarr];
      // where['value'] = ["IN",valuearr];
      // let type= await this.model("typeoptionvar").where(where).select();
    }

    this.assign('sort', sort);
    this.assign('nsobj', nsobj);

    this.assign('sortid', sortid);
    let group_id = 0;
    if (!think.isEmpty(query[2]) && query[2] != 0) {
      map.group_id = query[2];
      group_id = map.group_id;
    }
    this.assign('group_id', group_id);
    let data;
    if (!think.isEmpty(sortarr)) {
      data = await this.model('document').join({
        table: 'type_optionvalue' + sortid,
        join: 'left', // 有 left,right,inner 3 个值
        as: 't',
        on: ['id', 'tid']
      }).where(map).page(this.get('page'), num).order(o).countSelect();
    } else {
      data = await this.model('document').join({
        'document_course': {
          on: ['id', 'id']
        }
      }).where(map).page(this.get('page'), num).order(o).countSelect();
    }

    const html = this.pagination(data)
    this.assign('pagination', html)

    // seo
    this.meta_title = cate.meta_title ? cate.meta_title : cate.title // 标题
    this.keywords = cate.keywords ? cate.keywords : '' // seo关键词
    this.description = cate.description ? cate.description : '' // seo描述

    // 获取面包屑信息
    const breadcrumb = await this.model('category').get_parent_category(cate.id, true)
    this.assign('breadcrumb', breadcrumb);

    /* 模板赋值并渲染模板 */
    this.assign('category', cate)
    this.assign('list', data.data)
    this.assign('count', data.count)
    return this.displayView('index');
  }
}
