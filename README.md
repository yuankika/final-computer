# Connect RPC 计算器服务

这是一个使用 Go 和 Connect RPC 实现的简单计算器服务，支持基本的加减乘除运算。

## 项目结构

```
calculator/
├── proto/               # Protocol Buffers 定义
│   ├── calculator.proto
│   ├── calculator.pb.go
│   └── calculatorpbconnect/
│       └── calculator.connect.go
├── cmd/
│   ├── server/          # 服务器实现
│   │   └── main.go      # 服务器入口点和实现
│   └── client/          # 命令行客户端
│       └── main.go      # 客户端实现
├── web/                 # 基础Web前端（HTML/JS）
│   └── index.html       # 计算器Web界面
├── web-next/            # Next.js实现的现代Web前端
│   ├── src/             # 源代码
│   │   ├── app/         # Next.js应用
│   │   ├── components/  # React组件
│   │   └── services/    # API服务
│   ├── public/          # 静态资源
│   └── package.json     # 项目配置
├── buf.yaml             # Buf 配置
├── buf.gen.yaml         # Buf 代码生成配置
└── README.md            # 本文档
```

## 功能

- 支持的运算：加法、减法、乘法、除法
- 基于 Connect RPC 协议的客户端/服务器通信
- 处理错误情况（例如除以零）
- 提供多种客户端界面：
  - 命令行客户端
  - 简单的HTML/JS Web界面
  - 现代化的Next.js Web界面

## 如何使用

### 启动服务器

```bash
cd calculator
go run cmd/server/main.go
```

服务器将在 `localhost:8080` 上启动，并自动打开基础Web界面。

### 使用命令行客户端

```bash
cd calculator
go run cmd/client/main.go <数字1> <操作符> <数字2>
```

支持的操作符：`+`, `-`, `*`, `/`

例如：

```bash
go run cmd/client/main.go 10 + 5
# 输出：结果: 15.000000

go run cmd/client/main.go 10 / 0
# 输出：错误: 除数不能为零
```

### 使用基础Web界面

基础Web界面会在启动服务器时自动打开，或者可以手动访问 `http://localhost:8080`。

1. 在第一个输入框中输入第一个数字
2. 从下拉菜单中选择运算符（+, -, ×, ÷）
3. 在第二个输入框中输入第二个数字
4. 点击"计算"按钮查看结果

### 使用Next.js Web界面

Next.js前端提供了更现代、更友好的用户界面：

1. 安装依赖并启动前端开发服务器：

```bash
cd calculator/web-next
npm install
npm run dev
```

> **注意**：首次运行`npm install`将安装所有必要的依赖项，这可能需要几分钟时间。安装完成后，启动开发服务器通常只需几秒钟。

2. 访问 `http://localhost:3000` 使用计算器

#### 部署Next.js前端到生产环境

如果你想为生产环境构建前端应用：

```bash
cd calculator/web-next
npm install
npm run build
npm run start
```

这将创建优化版本的应用程序并在端口3000上启动服务器。

## 测试

项目包含了全面的单元测试，覆盖后端和前端的核心功能。

### 运行后端测试

```bash
cd calculator/cmd/server
go test -v
```

后端测试覆盖了：
- 所有计算操作（加、减、乘、除）
- 处理特殊情况（如除以零）
- 错误处理

### 运行前端测试

首先确保安装了依赖：

```bash
cd calculator/web-next
npm install
```

然后运行测试：

```bash
npm test
```

前端测试覆盖了：
- 服务模块测试：验证API调用和数据处理
- 组件测试：验证UI功能和用户交互
- 错误处理和边界条件

### 运行所有测试

在Windows上，可以使用提供的批处理文件运行所有测试：

```bash
calculator/run_tests.bat
```

## 技术细节

- 后端：
  - 使用 [Connect RPC](https://connectrpc.com/) 实现 RPC 通信
  - 使用 Protocol Buffers 定义消息格式
  - 使用 HTTP/2 作为传输层
  - 支持跨域资源共享(CORS)

- 前端：
  - 基础Web界面：纯HTML、CSS和JavaScript
  - 现代Web界面：Next.js、React、Tailwind CSS 