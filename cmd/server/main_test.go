package main

import (
	"context"
	"testing"

	calculatorpb "calculator/proto"

	"connectrpc.com/connect"
)

// 测试加法运算
func TestCalculate_Addition(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  5,
		Op: calculatorpb.Operation_ADD,
	})

	// 调用Calculate方法
	resp, err := service.Calculate(context.Background(), req)

	// 验证没有错误
	if err != nil {
		t.Fatalf("计算出错: %v", err)
	}

	// 验证结果
	if resp.Msg.Result != 15 {
		t.Errorf("加法计算错误: 预期 %v, 得到 %v", 15, resp.Msg.Result)
	}

	// 验证没有错误信息
	if resp.Msg.Error != "" {
		t.Errorf("不应该有错误信息，但得到: %v", resp.Msg.Error)
	}
}

// 测试减法运算
func TestCalculate_Subtraction(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  5,
		Op: calculatorpb.Operation_SUBTRACT,
	})

	// 调用Calculate方法
	resp, err := service.Calculate(context.Background(), req)

	// 验证没有错误
	if err != nil {
		t.Fatalf("计算出错: %v", err)
	}

	// 验证结果
	if resp.Msg.Result != 5 {
		t.Errorf("减法计算错误: 预期 %v, 得到 %v", 5, resp.Msg.Result)
	}
}

// 测试乘法运算
func TestCalculate_Multiplication(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  5,
		Op: calculatorpb.Operation_MULTIPLY,
	})

	// 调用Calculate方法
	resp, err := service.Calculate(context.Background(), req)

	// 验证没有错误
	if err != nil {
		t.Fatalf("计算出错: %v", err)
	}

	// 验证结果
	if resp.Msg.Result != 50 {
		t.Errorf("乘法计算错误: 预期 %v, 得到 %v", 50, resp.Msg.Result)
	}
}

// 测试除法运算
func TestCalculate_Division(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  5,
		Op: calculatorpb.Operation_DIVIDE,
	})

	// 调用Calculate方法
	resp, err := service.Calculate(context.Background(), req)

	// 验证没有错误
	if err != nil {
		t.Fatalf("计算出错: %v", err)
	}

	// 验证结果
	if resp.Msg.Result != 2 {
		t.Errorf("除法计算错误: 预期 %v, 得到 %v", 2, resp.Msg.Result)
	}
}

// 测试除以零的情况
func TestCalculate_DivisionByZero(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  0,
		Op: calculatorpb.Operation_DIVIDE,
	})

	// 调用Calculate方法
	resp, err := service.Calculate(context.Background(), req)

	// 验证没有错误(因为我们通过返回的Msg.Error字段处理这种情况)
	if err != nil {
		t.Fatalf("应该通过Msg.Error字段处理除以零，但得到了错误: %v", err)
	}

	// 验证错误信息
	if resp.Msg.Error == "" {
		t.Error("除以零应该返回错误信息，但没有")
	}

	// 验证错误信息内容
	expectedErrorMsg := "除数不能为零"
	if resp.Msg.Error != expectedErrorMsg {
		t.Errorf("除以零错误信息错误: 预期 %q, 得到 %q", expectedErrorMsg, resp.Msg.Error)
	}
}

// 测试无效的操作符
func TestCalculate_InvalidOperation(t *testing.T) {
	// 创建服务实例
	service := &calculatorServer{}

	// 准备请求，使用一个无效的操作码
	req := connect.NewRequest(&calculatorpb.CalculateRequest{
		A:  10,
		B:  5,
		Op: calculatorpb.Operation(99), // 无效的操作码
	})

	// 调用Calculate方法
	_, err := service.Calculate(context.Background(), req)

	// 验证有错误
	if err == nil {
		t.Fatal("应该返回错误，但没有")
	}

	// 验证是否是Connect错误
	connectError, ok := err.(*connect.Error)
	if !ok {
		t.Fatalf("应该返回Connect错误，但得到: %T", err)
	}

	// 验证错误代码
	if connectError.Code() != connect.CodeInvalidArgument {
		t.Errorf("错误代码错误: 预期 %v, 得到 %v", connect.CodeInvalidArgument, connectError.Code())
	}
}
