# 证书管理系统

## 项目简介
该系统用于批量导入设备证书数据，支持二维码展示、单页查看、后台管理编辑等功能，适用于 Cloudflare Pages + Workers + D1 部署架构。

## 文件结构
```
/
├── public/               # 前端页面
├── functions/api/        # 后端接口函数
├── schema.sql            # D1 数据库表结构
├── wrangler.toml         # D1 配置
└── README.md             # 本说明文件
```

## 功能模块
- 提交单条证书（submit.html）
- 展示某条证书（list.html?id=xxx）
- 批量导入 Excel 证书（batch-import.html）
- 后台管理所有数据（admin.html）

## API 接口
- POST `/api/cert-upload`：提交一条
- GET `/api/cert-get?id=1`：读取一条
- POST `/api/cert-batch`：批量导入
- GET `/api/cert-latest?count=N`：拉取最新 ID
- GET `/api/cert-all`：获取所有数据
- POST `/api/cert-update`：更新
- DELETE `/api/cert-delete?id=1`：删除

## 初始化步骤
1. 上传文件夹至 GitHub
2. 连接到 Cloudflare Pages
3. 启用 Functions 与 D1 数据库绑定
4. 在 D1 控制台执行 schema.sql
5. 开始上传证书或扫描使用
