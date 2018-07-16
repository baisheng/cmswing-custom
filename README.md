## Why？
大部分互联网产品本质上都脱离不开 (cms）的本质，因为公司业务上的需求，也希望有个简单、易用，且多变的，能适应多机构（组织、个人）、多应用、多用户的管理系统，希望它拥有的功能如下：

- 多机构管理，这里想的是主体用户可能是个企业、团队、或者就是一个独立的个体。希望有独立的管理页面、独立的入口，个性化的域名。
- 多应用，可以管理如：博客、资讯、APP的内容，现在因为有一些小程序的业务工作，也希望能对小程序应用做管理
- 多用户，是希望用户相对于应用与机构是独立的，不同的用户归属于不同的应用，应用之间的用户可能是相互隔离的，但内容有可能是打通的，甚至多机构的内容也是相互打通的。

一直关注 [CMSWing](https://github.com/arterli/CmsWing)，现阶段它的功能已经非常丰富并且结构灵活，可以满足大部分业务需求，并且基础是基于 thinkjs3 这个框架在 nodejs 框架中是非常易使用，综合选型后是比较符合我去做一个原型业务系统的基础，因此有了在此基础定制的想法

## WIP

- 采用 CMSWing (基于 thinkjs3 + mysql 构建) 定制
- 多模块项目结构
- 独立插件目录 (addons)
- 独立扩展模块目录 (modules)
- API 模块
- Nunjucks + bootstrap4 UI 定制
- 可插拔前后台页面模板
- nuxtjs 支持
- graphql
- ...

## 目录结构 
```bash
.
├── README.md                   # README
├── development.js              # dev 环境配置
├── nginx.conf
├── package.json
├── pm2.json
├── port                        # 服务启动端口配置
├── production.js               # 生产环境配置
├── src                         # 项目源文件
│   ├── addons                  # 插件目录
│   ├── admin                   # admin 业务模块
│   ├── api                     # api 业务模块
│   ├── common                  # 公共业务模块
│   ├── home                    # 默认业务模块
│   └── module                  # 扩展业务模块
├── test
│   └── index.js
├── view
│   ├── _ui
│   ├── admin
│   └── common
├── www
│   ├── static
│   ├── theme
│   └── upload
└── yarn.lock

```

## Todos 更新记录

- ~~将 CMSWing 从单模块工程到多模块工程重建~~
- ~~将 CMSWing 的基类迁移到 common 模块~~
- ~~将 ext 迁移至 addons 模块~~
- ~~增加 addons 插件加载机制，可识别插件目录结构~~
- 基于 bootstrap4 和 nunjucks 重构 admin 前端视图
    - ~~登录页~~
    - 后台管理 Dashboard 页
    - ~~菜单管理~~
    - ~~导航管理~~
    - ~~系统设置~~
    - ~~用户行为~~
    - ~~行为日志~~
    - ~~订单中心~~
    - ~~支付与配送~~
    - ~~用户管理~~
    - ~~扩展~~
- nunjucks UI 组件
    - Button
    - ~~Dropdown(default, menu)~~
    - ~~Pages(toolbar, content)~~
    - ~~Cards(grid, datagrid)~~
    - ~~Tables(table, datatable)~~
    - ~~Toolbars~~
    - Form fields
    - Links
    - Modal

## 效果截图
<img src="https://github.com/baisheng/cmswing-custom/blob/master/screenshot/user_login.png?raw=true" width="375">
<img src="https://github.com/baisheng/cmswing-custom/blob/master/screenshot/admin_menu_index.png?raw=true" width="375">
<img src="https://github.com/baisheng/cmswing-custom/blob/master/screenshot/admin_model_index.png?raw=true" width="375">


## 相关文章
- [Thinkjs3 中自定义加载，实现插件目录功能](https://www.jianshu.com/p/df9346a1d0bb)
- [Thinkjs3 支持 Nuxtjs](https://www.jianshu.com/p/16feed3a5715)
- [CMSWing SVG 验证码插件](https://github.com/baisheng/cmswing-ext-captcha)
- [采用 Dokku 构建自己的 PaaS 服务](https://www.jianshu.com/p/476cb3b8a64d)
- [Dokku 项目部署](https://www.jianshu.com/p/f5951d860446)
- [基于 Thinkjs、Vuejs 的多用户、多应用，管理系统实践](https://www.jianshu.com/p/150cab22ff27)