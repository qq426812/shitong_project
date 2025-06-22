# Cloudflare Pages + D1 证书管理系统

## 📁 项目结构

```
/
├── public/
│   ├── submit.html           # 提交单条证书数据并生成二维码
│   ├── list.html             # 展示某个 id 的证书信息
│   ├── batch-import.html     # 批量上传 Excel，生成多个二维码
│   ├── admin.html            # 后台查看、编辑、删除数据
│
├── functions/api/
│   ├── cert-upload.js        # POST 单条证书
│   ├── cert-get.js           # GET 某条证书信息
│   ├── cert-batch.js         # POST 多条证书数据
│   ├── cert-latest.js        # GET 最新记录 ID
│   ├── cert-all.js           # GET 所有数据（admin 用）
│   ├── cert-update.js        # POST 更新一条记录
│   ├── cert-delete.js        # DELETE 删除一条记录
│
├── schema.sql                # 初始化数据库结构
├── wrangler.toml             # D1 配置绑定
└── README.md                 # 项目说明文档
```

## 🚀 快速部署

1. 上传该项目至 GitHub
2. Cloudflare Pages → Create Project → 选择该仓库
3. 构建设置：无构建命令，输出目录填写：`public`
4. Functions 自动启用，绑定 D1 数据库
5. 打开 `schema.sql` 初始化数据表

## 📌 注意事项

- 所有数据接口基于 Cloudflare D1 进行读写
- 批量导入需上传 `.xlsx` 文件，推荐字段匹配
- 管理后台支持编辑/删除每一条记录