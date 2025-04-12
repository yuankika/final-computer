# Next.js 前端部署指南

本文档提供有关如何部署和管理 Next.js 前端应用的说明。

## GitHub 部署注意事项

在将项目推送到 GitHub 时，请注意以下几点：

1. **不要提交 `node_modules` 目录**
   - 该目录包含所有依赖项，非常大，且包含超过 GitHub 100MB 文件大小限制的文件
   - 该目录已在 `.gitignore` 文件中被排除

2. **不要提交 `.next` 构建目录**
   - 构建输出是为特定环境生成的，不应提交到版本控制系统

## 开发环境设置

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

## 生产环境部署

### 标准部署

```bash
# 安装依赖
npm install

# 构建生产版本
npm run build

# 启动生产服务器
npm run start
```

### Docker 部署 (可选)

如果你想使用 Docker 部署，可以创建以下 Dockerfile：

```dockerfile
FROM node:18-alpine AS base

# 安装依赖
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# 构建应用
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# 生产环境
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
```

然后构建并运行容器：

```bash
docker build -t calculator-frontend .
docker run -p 3000:3000 calculator-frontend
```

## 常见问题解决

1. **依赖安装失败**
   - 尝试删除 `node_modules` 目录和 `package-lock.json` 文件，然后重新运行 `npm install`

2. **构建错误**
   - 确保所有依赖都已正确安装
   - 检查 TypeScript 类型错误

3. **API 连接问题**
   - 确保后端服务在 `http://localhost:8080` 运行
   - 检查 Next.js 配置中的 API 代理设置 