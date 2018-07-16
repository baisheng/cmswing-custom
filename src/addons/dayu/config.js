module.exports = {
  ext: 'dayu', // 插件目录，必须为英文
  name: '阿里大于', // 插件名称
  description: '阿里大于短信服务', // 插件描述
  isadm: 0, // 是否有后台管理，1：有，0：没有，入口地址:'/ext/devteam/admin/index'
  isindex: 0, // 是否需要前台访问，1：需要，0：不需要,入口地址:'/ext/devteam/index/index'
  version: '1.0', // 版本号
  author: '', // 作者
  table: [], // 插件包含的 数据库表，不包含表前缀，如：cmswing_ext_table 就是 table，多个['table','table_2']没有留空数组。
  sql: '', // 插件安装的时候会找个名字的sql文件导入，默认 插件目录名.sql;
  hooks: ['smsRegistration'], // 挂载的钩子，数组格式，如['hooks1', 'hooks2'],不挂载留空：[]
  setting: [
    {
      '阿里大于设置': [
        {
          'name': 'appkey',
          'label': 'App Key:',
          'type': 'text',
          'value': 'LTAIkIzpjwJsgeRg',
          'html': `在阿里大于申请到的 App Key ,填写到此处`
        },
        {
          'name': 'appsecre',
          'label': 'App Secre:',
          'type': 'text',
          'value': 'DXWECX5NcfoPpmVf0pHzidtz6b8pfs',
          'html': `在阿里大于申请到的 App Secret ,填写到此处。`
        },
        {
          'name': 'qianming',
          'label': '短信签名',
          'type': 'text',
          'value': '阿里云短信测试专用',
          'html': '在相应的短信后台获取<br>短信示例：【阿里大鱼】 验证码${number}，您正进行支付宝的身份验证，打死不告诉别人！ <br>短信签名：阿里大鱼 <br>短信模板: 验证码${number}，您正进行支付宝的身份验证，打死不告诉别人！'
        },
        {
          'name': 'product',
          'label': '变量${product}',
          'type': 'text',
          'value': '',
          'html': '设置模版的时候填入的值，会替换${product}'
        },
        {
          'name': 'signup',
          'label': '用户注册验证码模版 ID',
          'type': 'text',
          'value': 'SMS_92715115',
          'html': `在短信渠道后台申请
                   实例：验证码\$\{code\}，您正在注册成为\$\{product\}用户，感谢您的支持`
        },
        {
          'name': 'forgot',
          'label': '找回密码模板 ID',
          'type': 'text',
          'value': 'SMS_92715114',
          'html': `在短信渠道后台申请
                   实例：验证码\$\{code\}，您正在找回密码。`
        }
      ]
    }
  ]
};
