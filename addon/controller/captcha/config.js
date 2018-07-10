module.exports = {
  ext: 'captcha', // 插件目录，必须为英文
  name: 'SVG 验证码', // 插件名称
  description: '基于 SVG 的图形验证码', // 插件描述
  isadm: 0, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/sysinfo/admin/index'
  isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/sysinfo/index/index'
  version: '1.0', // 版本号
  author: 'CaiXie', // 作者
  table: [], // 插件包含的 数据库表，不包含表前缀，如：cx_ext_table 就是 table，多个['table','table_2']没有留空数组。
  sql: '', // 插件安装的时候会找个名字的sql文件导入，默认 插件目录名.sql;
  hooks: ['signinBefore', 'signinView', 'loginBefore', 'loginView'], // 挂载的钩子，数组格式，如['hooks1', 'hooks2'],不挂载留空：[]
  setting: [
    {
      '验证码设置': [
        {
          'name': 'size',
          'label': 'size',
          'type': 'text',
          'value': '4',
          'html': `验证码长度`
        },
        {
          'name': 'ignoreChars',
          'label': 'ignoreChars',
          'type': 'text',
          'value': '0o1i',
          'html': `验证码字符中排除的字符`
        },
        {
          'name': 'noise',
          'label': 'noise',
          'type': 'text',
          'value': '1',
          'html': `噪点线条数量`
        },
        {
          'name': 'color',
          'label': 'color',
          'type': 'radio',
          'options': {'true': '启用', 'false': '禁用'},
          'value': false,
          'html': `验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有`
        },
        {
          'name': 'background',
          'label': 'background',
          'type': 'text',
          'value': '',
          'html': `验证码图片背景颜色`
        },
        {
          'name': 'width',
          'label': 'width',
          'type': 'text',
          'value': 100,
          'html': `验证码宽度`
        },
        {
          'name': 'height',
          'label': 'height',
          'type': 'text',
          'value': 34,
          'html': `验证码高度`
        },
        {
          'name': 'fontSize',
          'label': 'fontSize',
          'type': 'text',
          'value': 28,
          'html': `验证码文字大小`
        },
        {
          'name': 'charPreset',
          'label': 'charPreset',
          'type': 'text',
          'value': 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789', // random character preset
          'html': `验证码用的预置字符`
        },
        {
          'name': 'fontPath',
          'label': 'fontPath',
          'type': 'text',
          'value': 'fonts/Roboto_Slab/RobotoSlab-Regular.ttf',
          'html': `验证码采用的字体`
        }
      ]
    }
  ]
};
