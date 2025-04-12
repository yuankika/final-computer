package main

import (
	"context"
	"errors"
	"fmt"
	"log"
	"net/http"
	"os"
	"os/exec"
	"runtime"
	"time"

	"connectrpc.com/connect"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	calculatorpb "calculator/proto"
	"calculator/proto/calculatorpbconnect"
)

// calculatorServer 实现计算器服务
type calculatorServer struct {
	calculatorpbconnect.UnimplementedCalculatorServiceHandler
}

// Calculate 实现计算器服务的Calculate方法
func (s *calculatorServer) Calculate(
	ctx context.Context,
	req *connect.Request[calculatorpb.CalculateRequest],
) (*connect.Response[calculatorpb.CalculateResponse], error) {
	// 从请求中提取参数
	a := req.Msg.A
	b := req.Msg.B
	op := req.Msg.Op

	// 准备响应
	response := &calculatorpb.CalculateResponse{}

	// 执行计算
	switch op {
	case calculatorpb.Operation_ADD:
		response.Result = a + b
	case calculatorpb.Operation_SUBTRACT:
		response.Result = a - b
	case calculatorpb.Operation_MULTIPLY:
		response.Result = a * b
	case calculatorpb.Operation_DIVIDE:
		// 检查除数是否为零
		if b == 0 {
			response.Error = "除数不能为零"
			return connect.NewResponse(response), nil
		}
		response.Result = a / b
	default:
		return nil, connect.NewError(connect.CodeInvalidArgument, errors.New("未知的运算类型"))
	}

	// 返回结果
	return connect.NewResponse(response), nil
}

// corsMiddleware 添加CORS头信息
func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// 允许所有来源的跨域请求
		w.Header().Set("Access-Control-Allow-Origin", "*")

		// 允许特定的HTTP方法
		w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS")

		// 允许特定的请求头
		w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization, Connect-Protocol-Version")

		// 处理预检请求
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}

		// 继续处理请求
		next.ServeHTTP(w, r)
	})
}

// 打开浏览器
func openBrowser(url string) {
	var err error

	switch runtime.GOOS {
	case "linux":
		err = exec.Command("xdg-open", url).Start()
	case "windows":
		err = exec.Command("rundll32", "url.dll,FileProtocolHandler", url).Start()
	case "darwin":
		err = exec.Command("open", url).Start()
	default:
		err = fmt.Errorf("不支持的操作系统: %s", runtime.GOOS)
	}

	if err != nil {
		log.Printf("无法打开浏览器: %v", err)
	}
}

// Serve 启动服务器
func Serve() {
	// 检查是否存在web目录
	if _, err := os.Stat("web"); os.IsNotExist(err) {
		fmt.Println("警告: 'web'目录不存在，将在当前目录创建它")
		if err := os.Mkdir("web", 0755); err != nil {
			log.Fatalf("无法创建'web'目录: %v", err)
		}
	}

	// 检查web/index.html是否存在
	if _, err := os.Stat("web/index.html"); os.IsNotExist(err) {
		fmt.Println("警告: 'web/index.html'文件不存在，请确保前端文件已正确放置")
	}

	// 创建一个新的计算器服务实例
	calculatorService := &calculatorServer{}

	// 创建一个新的Connect处理程序
	mux := http.NewServeMux()
	path, handler := calculatorpbconnect.NewCalculatorServiceHandler(calculatorService)

	// 应用CORS中间件
	corsHandler := corsMiddleware(handler)
	mux.Handle(path, corsHandler)

	// 添加静态文件服务器，使用户可以访问前端页面
	fs := http.FileServer(http.Dir("web"))
	mux.Handle("/", http.StripPrefix("", fs))

	// 设置地址
	addr := "localhost:8080"
	url := fmt.Sprintf("http://%s", addr)

	fmt.Printf("计算器服务器启动，地址: %s\n", url)
	fmt.Printf("前端页面访问地址: %s\n", url)

	// 在一个goroutine中打开浏览器
	go func() {
		// 等待服务器启动
		time.Sleep(500 * time.Millisecond)
		openBrowser(url)
	}()

	// 使用h2c以允许HTTP/2明文连接
	server := &http.Server{
		Addr:    addr,
		Handler: h2c.NewHandler(mux, &http2.Server{}),
	}

	fmt.Println("按Ctrl+C终止服务器...")

	err := server.ListenAndServe()
	if err != nil && err != http.ErrServerClosed {
		log.Fatalf("服务器启动失败: %v", err)
	}
}

func main() {
	// 调用serve.go中的Serve函数
	Serve()
}
