# 基于 CMSWing 定制

## 特色

- 采用 CMSWing (基于 thinkjs3 + mysql 构建) 定制
- 多模块项目结构
- 独立插件目录 (addons)
- 独立扩展模块目录 (modules)
- API 模块
- Nunjucks + bootstrap4 UI 定制
- 可插拔前后台页面模板
- nuxtjs 支持(待定)
- ...


## 效果截图
<img src="https://github.com/baisheng/cmswing-custom/blob/master/screenshot/user_login.png?raw=true" width="375">
<img src="https://github.com/baisheng/cmswing-custom/blob/master/screenshot/menu_index.png?raw=true" width="375">

## Todos 更新记录

- ~~将 CMSWing 从单模块工程到多模块工程重建~~
- ~~将 CMSWing 的基类迁移到 common 模块~~
- ~~将 ext 迁移至 addons 模块~~
- ~~增加 addons 插件加载机制，可识别插件目录结构~~
- 基于 bootstrap4 和 nunjucks 重构 admin 前端视图
    - ~~登录页~~
    - 后台管理 Dashboard 页
    - ~~菜单管理~~
- nunjucks UI 组件
    - Button
    - Dropdown
    - Form fields
    - Links
    - Modal

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
