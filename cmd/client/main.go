package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"connectrpc.com/connect"

	calculatorpb "calculator/proto"
	"calculator/proto/calculatorpbconnect"
)

func main() {
	// 检查参数
	if len(os.Args) != 4 {
		fmt.Println("用法: client <数字1> <操作符> <数字2>")
		fmt.Println("支持的操作符: +, -, *, /")
		os.Exit(1)
	}

	// 解析参数
	a, err := strconv.ParseFloat(os.Args[1], 64)
	if err != nil {
		log.Fatalf("无法解析第一个参数: %v", err)
	}

	opStr := os.Args[2]

	b, err := strconv.ParseFloat(os.Args[3], 64)
	if err != nil {
		log.Fatalf("无法解析第二个参数: %v", err)
	}

	// 确定操作类型
	var op calculatorpb.Operation
	switch opStr {
	case "+":
		op = calculatorpb.Operation_ADD
	case "-":
		op = calculatorpb.Operation_SUBTRACT
	case "*":
		op = calculatorpb.Operation_MULTIPLY
	case "/":
		op = calculatorpb.Operation_DIVIDE
	default:
		log.Fatalf("不支持的操作符: %s", opStr)
	}

	// 创建客户端
	client := calculatorpbconnect.NewCalculatorServiceClient(
		http.DefaultClient,
		"http://localhost:8080",
	)

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  a,
		B:  b,
		Op: op,
	})

	// 调用服务
	fmt.Printf("计算: %f %s %f\n", a, opStr, b)
	resp, err := client.Calculate(context.Background(), req)
	if err != nil {
		// 解析 Connect 错误
		if connectErr, ok := err.(*connect.Error); ok {
			log.Fatalf("调用错误 [%s]: %s", connectErr.Code(), connectErr.Message())
		}
		log.Fatalf("调用失败: %v", err)
	}

	// 检查是否有错误消息
	if resp.Msg.Error != "" {
		fmt.Printf("错误: %s\n", resp.Msg.Error)
		os.Exit(1)
	}

	// 显示结果
	fmt.Printf("结果: %f\n", resp.Msg.Result)
}
