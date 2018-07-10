# VR LAB

## 相关技术

- ES6
- Node.js & Think.js
- MySQL
- Nunjucks

## 项目结构说明
### 基础项目结构
```
.
├── development.js  // 开发环境下的入口文件
├── nginx.conf      // nginx 配置文件
├── package.json    
├── pm2.json        // pm2 配置文件
├── port            // 服务启动端口配置默认为 5000
├── production.js   // 生产环境下的入口文件
├── runtime         // 服务启动后自动生成的缓存文件
├── src             // 源码目录
├── view            // 模板视图目录
└── www             // 静态文件资源
```

### src
```
.
├── addon           // 插件功能目录
│   └── controller
│       ├── ad          // 广告插件（轮播图）
│       ├── attachment  // 附件插件
│       ├── captcha     // 登录验证码
│       ├── dayu        // 阿里大于短信
│       └── editor      // 编辑器
├── admin           // 后台管理模块
│   └── controller
│       ├── article.js      // 文档管理控制器
│       ├── attribute.js    // 表属性管理
│       ├── auth.js         // 权限管理
│       ├── base.js         // Admin controller 基类
│       ├── category.js     // 类别管理
│       ├── channel.js      // 导航管理
│       ├── ext.js          // 插件管理（addon）
│       ├── hooks.js        // 勾子插件管理（页面级别插件）
│       ├── index.js        // 后台主页管理
│       ├── menu.js         // 菜单管理
│       ├── model.js        // 表模型管理
│       ├── public.js       // 公开访问 action
│       ├── setup.js        // 系统配置
│       ├── tags.js         // 标签管理（实验图标）
│       ├── type.js         // 分类信息（实验内容分类信息）
│       └── user.js         // 用户管理
├── api             // 对外提供的 api 模块
│   ├── base.js             // API 基类
│   ├── experiment.js       // 实验数据 API
│   ├── rest.js             // REST 请求基类
│   ├── signin.js           // 登录请求 API
│   └── users.js            // 用户请求（教师） API
├── common          // 公共应用模块
│   ├── bootstrap           // 启动自动执行目录
│   │   ├── global.js       // 全局函数，服务启动时加载
│   │   ├── master.js       // Master 进程下自动执行
│   │   ├── model.js        // 模型字段信息
│   │   ├── tags.js         // 视图标签
│   │   └── worker.js       // Worker 进程下自动执行
│   ├── config       // 配置文件目录
│   │   ├── adapter         // adapter 配置文件目录
│   │   ├── adapter.js      // adapter 配置文件
│   │   ├── config.js       // 默认配置文件
│   │   ├── config.production.js    //生产环境下的默认配置文件，和 config.js 合并
│   │   ├── extend.js       // extend 配置文件
│   │   ├── middleware.js   // middleware 配置文件 
│   │   └── router.js       // 自定义路由配置文件
│   ├── controller  // 公共应用模块下的控制器目录 
│   │   ├── admin.js        // ADMIN 模块控制器继承的
│   │   ├── error.js        // 公共错误控制
│   │   ├── extAdminBase.js // 插件后台控制器继承
│   │   ├── extIndexBase.js // 插件前台控制器继承
│   │   ├── home.js         // 系统前台首页控制器继承
│   │   ├── modAdminBase.js // 模块管理控制器继承
│   │   └── modIndexBase.js // 模块前台控制器继承
│   ├── extend              // extend 配置目录
│   │   ├── context.js      // 全局上下文扩展配置
│   │   ├── controller.js   // 全局控制器扩展
│   │   ├── qetag.js        // 计算文件的eTag 基于七牛算法（用于文件重复上传管理，暂未使用）
│   │   └── think.js        // 全局变量 think 的扩展
│   ├── i18n        // 多语言配置（暂未使用）
│   │   ├── cn.js           // 中文
│   │   └── en.js           // 英文
│   ├── middleware  // 中间件扩展
│   │   └── xLogic.js       // logic 扩展
│   ├── model       // 数据模型
│   │   ├── area.js         // 地域
│   │   ├── attribute.js    // 字段属性
│   │   ├── categories.js   // 分类
│   │   ├── category.js     // 分类表数据模型
│   │   ├── category_priv.js    // 分类权限
│   │   ├── channel.js      // 导航模型
│   │   ├── document.js     // 文档模型
│   │   ├── ext.js          // 插件模型
│   │   ├── ext_type.js     // 插件类型模型
│   │   ├── hooks.js        // 勾子插件模型 
│   │   ├── member.js       // 成员模型
│   │   ├── member_group.js // 成员组
│   │   ├── membermeta.js   // 成员模型元数据
│   │   ├── menu.js         // 后台菜单模型
│   │   ├── model.js        // 模型
│   │   ├── search.js       // 检索
│   │   ├── setup.js        // 配置
│   │   └── type.js         // 分类信息
│   └── service     // 公共业务层
│       └── upload          // 文件上传
├── home            // 系统默认模块
│   ├── controller  
│   │   ├── account.js      // 用户账户
│   │   ├── base.js         
│   │   ├── detail.js       // 内容详情页
│   │   ├── index.js        // 网站首页
│   │   ├── list.js         // 网站列表页
│   │   └── profile.js      // 用户信息页
│   ├── logic           
│   │   └── index.js
│   └── model
│       └── index.js
└── module          // 系统独立模块
    └── controller
        └── experiment      // 实验模块

```
## 模块开发
    模块(Module)，是包含了轻小型业务逻辑，是基于业务层面的划分。

## 插件机制
    插件(Addon), 是包含了超轻量级业务逻辑或对模块(Module)进行功能扩展的独立的功能模块。

