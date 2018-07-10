/* eslint-disable no-undef,new-cap,no-extra-parens */
const url = require('url');
const path = require('path');
const fs = require('fs-extra');
const decompress = require('decompress')
const moment = require('moment');

const ALLOW_EXTS = [
  /** 图片文件 */
  /\.(gif|jpe?g|png|tiff|bmp|ico)$/i,
  /** 多媒体文件 */
  /\.(mp3|wmv|mp4|avi|flv)$/i,
  /** 常用档案文件 */
  /\.(txt|xml|json|docx?|xlsx?|pptx?)/i,
  /\.(zip|rar|pdf|gz)/i
]

module.exports = class extends think.Controller {
  async __before () {
    // 登陆验证
    const is_login = await this.islogin();
    if (!is_login) {
      return this.fail('非法操作!');
    }
  }

  constructor (ctx) {
    super(ctx);
    this.pdb = this.model('ext_attachment_pic');
    this.fdb = this.model('ext_attachment_file');
  }

  /**
   * 判断是否登录
   * @returns {boolean}
   */
  async islogin () {
    // 判断是否登录
    const user = await this.session('userInfo');
    const res = think.isEmpty(user) ? false : user.uid;
    return res;
  }

  /**
   * index action
   * @return {Promise} []
   */
  indexAction () {
    return this.display();
  }

  // 获取当前的格式化时间
  formatNow () {
    return moment(new Date()).format('YYYYMMDD');
  }

  async uploadAction () {
    // let file = this.file('file')
    const file = this.file('file')

    // const file = think.extend({}, this.file('file'));
    const filePath = file.path
    const extname = path.extname(file.name)
    const basename = path.basename(filePath) + extname
    const uploadPath = think.TMPDIR_PATH + '/' + this.formatNow();
    think.mkdir(uploadPath);
    fs.renameSync(filePath, uploadPath + '/' + basename)
    file.path = uploadPath + '/' + basename
    if (!file) {
      return this.fail('FILE_UPLOAD_ERROR')
    }

    /** 检查文件类型 */
    const ext = this.extWhiteList(file);
    if (!ext) {
      return this.fail('FILE_FORMAT_NOT_ALLOWED');
    }

    // 主要用于处理区分 unity html zip 包
    let type = 'default'
    let postData = this.post()
    if (Object.is(postData, 'type') !== undefined) {
      type = postData.type
    }

    let data

    // 处理 vr html zip
    // 处理其它上传
    // if (type === 'default')  {
    let result = await this.serviceUpload(file, {})
    if (think.isFile(result)) {
      data = {
        savepath: '/upload/' + this.formatNow() + '/',
        create_time: new Date().getTime(),
        name: file.name,
        savename: basename,
        mime: file.type,
        size: file.size,
        md5: think.md5(basename)
      }
    }
    const res = await this.fdb.add(data)
    if (type === 'htmlfile' && res) {
      const htmlPath = think.resource + '/html/' + res
      const decompressObj = await decompress(result, htmlPath, {
        map: file => {
          // file.path = `unicorn-${file.path}`;
          // file.path = `app-${file.path}`;
          return file
        }
      })

      if (decompressObj) {
        await this.fdb.thenUpdate({
          savepath: htmlPath,
          mime: 'htmlfile'
        }, {id: res})
        return this.json({id: res, size: file.size});
      }
    }
    return this.json({id: res, size: file.size});
  }

  // MIME过滤
  extWhiteList (file) {
    return ALLOW_EXTS.some(reg => reg.test(file.name));
  }

  /**
   * 上传文件
   */
  async serviceUpload (file, config) {
    try {
      const uploader = think.service('upload/local');
      console.log(file)
      const result = await uploader.run(file, config);
      return result
    } catch (e) {
      if (think.isPrevent(e)) {
        return true;
      }
      return this.fail(e.message || 'FILE_UPLOAD_ERROR');
    }
  }

  // 上传图片
  async uploadpicAction () {
    const type = this.get('type');
    let name = 'file';
    let att = {};
    if (!think.isEmpty(type)) {
      const atts = await this.addonModel('attachment').where({dis: type, type: 0}).find();
      att = think.extend(att, atts);
    }
    if (!think.isEmpty(att) && !think.isEmpty(att.name)) {
      name = att.name;
    }

    const file = think.extend({}, this.file(name));
    const filepath = file.path;
    const extname = path.extname(file.name);
    const basename = path.basename(filepath) + extname;
    // const ret = {'status': 1, 'info': '上传成功', 'data': ''};
    let data;

    // 默认路径
    // const uploadPath = this.saveFile(filepath, 'picture', basename, att);
    const result = await this.serviceUpload(file, {})
    if (think.isFile(result)) {
      data = {
        // savepath: '/upload/' + this.formatNow() + '/',
        path: '/upload/' + this.formatNow() + '/' + basename,
        // path: result,
        create_time: new Date().getTime(),
        name: file.name,
        savename: basename,
        mime: file.type,
        size: file.size,
        md5: think.md5(basename),
        status: 1
      }
    }
    const res = await this.pdb.add(data);
    const r = {id: res, url: await get_pic(res), name: (file.name).trim()};
    let rr = {};
    if (!think.isEmpty(att) && !think.isEmpty(att.rule)) {
      const match = att.rule.match(/\${(\S+?)\}/g);
      // console.log(match);
      const replace = [];
      for (let val of match) {
        val = val.replace(/(^\${)|(\}$)/g, '');
        replace.push(r[val]);
      }
      console.log(replace);
      rr = str_replace(match, replace, att.rule);
      // console.log(rr);
      if (att.rule.indexOf('{') === 0) {
        rr = JSON.parse(rr);
      }
    }
    return think.isEmpty(rr) ? this.json(res) : this.json(rr);
  }

  async saveFile (filepath, defpath, basename, attr) {
    // 处理路径
    if (attr.path != null && !think.isEmpty(attr.path.trim())) {
      defpath = attr.path.trim();
    }
    // 生成目录
    // const rootpath = `/upload/${defpath}/${dateformat('Y-m-d', new Date().getTime())}`;
    // const uploadPath = `${think.resource}${rootpath}`;
    // think.mkdir(uploadPath);

    const uploadPath = think.TMPDIR_PATH + `/${defpath}` + this.formatNow();
    think.mkdir(uploadPath);
    fs.renameSync(filepath, uploadPath + '/' + basename)
    let result = await this.serviceUpload(filepath, {name: defpath})

    // 转移文件
    // if (think.isFile(filepath)) {
    //   fs.renameSync(filepath, uploadPath + '/' + basename)
    // }
    if (think.isFile(result)) {
      data = {
        savepath: '/upload/' + this.formatNow() + '/',
        create_time: new Date().getTime(),
        name: file.name,
        savename: basename,
        mime: file.type,
        size: file.size,
        md5: think.md5(basename)
      }
    }
    return {
      path: uploadPath,
      root: `/upload/${defpath}/${this.formatNow()}`,
      def: defpath
    };
  }


  // 文件信息
  async fileinfoAction () {
    const res = await this.fdb.find(this.get('id'));
    if (!think.isEmpty(res)) {
      res.time = this.moment(res.create_time).format('lll');
    }
    return this.json(res);
  }
};
