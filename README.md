# BeJSON 网站项目

> 开发者必备的在线 JSON 处理工具平台

## 功能列表

### 核心工具 (8个)
- ✅ [JSON 格式化](/json-formatter/) - 智能缩进、颜色高亮
- ✅ [JSON 校验](/json-validator/) - 语法检查、错误定位
- ✅ [JSON 压缩](/json-compressor/) - 去除空格、换行
- ✅ [JSON 树视图](/json-tree-view/) - 可视化树形结构
- ✅ [JSON 美化](/json-formatter/) - 格式化 + 高亮
- ✅ [JSON 差异对比](/json-diff/) - 高亮显示区别
- ✅ [JSON Schema 校验](/json-schema-validator/) - 基于 Schema 标准校验
- ✅ [JSON 编辑器](/json-formatter/) - 在线代码编辑器

### 代码生成 (12个)
- ✅ [JSON → TypeScript](/json-to-typescript/)
- ✅ [JSON → JavaScript](/json-to-javascript/)
- ✅ [JSON → Java](/json-to-java/)
- ✅ [JSON → Go](/json-to-go/)
- ✅ [JSON → Python](/json-to-python/)
- ✅ [JSON → C#](/json-to-csharp/)
- ✅ [JSON → Swift](/json-to-swift/)
- ✅ [JSON → Kotlin](/json-to-kotlin/)
- ✅ [JSON → Dart](/json-to-dart/)
- ✅ [JSON → PHP](/json-to-php/)
- ✅ [JSON → Ruby](/json-to-ruby/)
- ✅ [JSON → C++](/json-to-cpp/) (使用Go)

### 格式转换 (10个)
- ✅ [JSON → XML](/json-to-xml/)
- ✅ [JSON → YAML](/json-to-yaml/)
- ✅ [JSON → CSV](/json-to-csv/)
- ✅ [JSON → SQL](/json-to-sql/)
- ✅ [JSON → TOML](/json-to-toml/)
- ✅ [JSON → Properties](/json-to-properties/)
- ✅ [XML → JSON](/xml-to-json/)
- ✅ [YAML → JSON](/yaml-to-json/)
- ✅ [CSV → JSON](/csv-to-json/)

### 辅助工具 (6个)
- ✅ [Unicode 转换](/unicode-converter/) - 中文与 Unicode 互转
- ✅ [URL 编码](/url-encoder/) - URL 编码/解码
- ✅ [时间戳转换](/timestamp-converter/) - Unix 时间戳 ↔ 日期
- ✅ [Base64 编解码](/base64-converter/)
- ✅ [哈希生成](/hash-generator/) - MD5/SHA 加密
- ✅ [颜色转换](/color-converter/) - HEX/RGB/HSL 互转

## 技术特点

- **纯静态网站** - 无需后端，所有处理在浏览器端完成
- **响应式设计** - 支持电脑、手机、平板
- **数据安全** - 数据不上传服务器
- **快速响应** - 无需服务器传输

## 本地开发

```bash
cd bejson-website

# Python
python -m http.server 8080

# Node.js
npx http-server -p 8080
```

## Vercel 部署

### 方法1: Vercel CLI
```bash
npm i -g vercel
vercel
```

### 方法2: Git 部署
1. 推送到 GitHub
2. 在 [Vercel](https://vercel.com) 导入项目
3. 自动部署

## 项目结构

```
bejson-website/
├── index.html              # 首页
├── css/
│   └── style.css          # 样式
├── js/
│   └── app.js             # 核心逻辑
├── json-formatter/        # 格式化
├── json-validator/        # 校验
├── json-compressor/      # 压缩
├── json-tree-view/        # 树视图
├── json-diff/            # 差异对比
├── json-schema-validator/ # Schema校验
├── json-to-typescript/    # TS转换
├── json-to-java/          # Java转换
├── json-to-go/            # Go转换
├── json-to-python/        # Python转换
├── json-to-csharp/        # C#转换
├── json-to-swift/         # Swift转换
├── json-to-kotlin/        # Kotlin转换
├── json-to-dart/          # Dart转换
├── json-to-php/           # PHP转换
├── json-to-ruby/          # Ruby转换
├── json-to-xml/           # XML转换
├── json-to-yaml/          # YAML转换
├── json-to-csv/           # CSV转换
├── json-to-sql/           # SQL转换
├── json-to-toml/          # TOML转换
├── json-to-properties/     # Properties转换
├── json-to-javascript/    # JS转换
├── xml-to-json/           # XML转JSON
├── yaml-to-json/          # YAML转JSON
├── csv-to-json/           # CSV转JSON
├── unicode-converter/     # Unicode转换
├── url-encoder/           # URL编码
├── timestamp-converter/   # 时间戳转换
├── base64-converter/      # Base64编解码
├── hash-generator/        # 哈希生成
├── color-converter/       # 颜色转换
└── vercel.json            # Vercel配置
```

## 页面标题和 SEO

每个工具页面都包含：
- 独特的 `<title>` 标签
- `<meta name="description">` 描述
- `<meta name="keywords">` 关键词
- 语义化的 URL 结构

## License

MIT
