# 基于 CMSWing 定制

## Todos 更新记录

- ~~将 CMSWing 从单模块工程到多模块工程重建~~
- ~~将 CMSWing 的基类迁移到 common 模块~~
- ~~将 ext 迁移至 addons 模块~~
- ~~增加 addons 插件加载机制，可识别插件目录结构~~
- 基于 bootstrap 和 nunjucks 重构 admin 前端视图
- nunjucks UI 组件


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
