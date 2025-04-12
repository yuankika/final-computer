# Connect RPC 计算器前端

基于 Next.js 和 Tailwind CSS 的计算器前端界面，使用 Connect RPC 协议与后端服务通信。

## 特点

- 现代化的用户界面，使用 Tailwind CSS 构建
- 响应式设计，适配不同屏幕尺寸
- 实时反馈和错误处理
- 使用 Next.js API 路由代理请求，避免跨域问题

## 安装依赖

```bash
cd web-next
npm install
```

## 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 构建生产版本

```bash
npm run build
npm run start
```

## 与后端的集成

这个前端应用使用 Next.js API 路由作为代理，将请求转发到后端服务。确保在启动前端之前，后端服务已经在 `http://localhost:8080` 上运行。

请求流程：

1. 前端应用向 `/api/calculator.CalculatorService/Calculate` 发送请求
2. Next.js API 路由将请求代理到 `http://localhost:8080/calculator.CalculatorService/Calculate`
3. 后端处理请求并返回结果
4. 结果通过代理返回给前端

## 技术栈

- [Next.js](https://nextjs.org/) - React 框架
- [Tailwind CSS](https://tailwindcss.com/) - CSS 框架
- [React Icons](https://react-icons.github.io/react-icons/) - 图标库
- [Axios](https://axios-http.com/) - HTTP 客户端 