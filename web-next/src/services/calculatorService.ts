import axios, { AxiosError } from 'axios';

// 操作枚举
enum Operation {
  ADD = 0,
  SUBTRACT = 1,
  MULTIPLY = 2,
  DIVIDE = 3
}

// 请求接口
interface CalculateRequest {
  a: number;
  b: number;
  op: Operation;
}

// 响应接口
interface CalculateResponse {
  result?: number;
  error?: string;
}

// 计算器服务
export const calculatorService = {
  /**
   * 执行计算操作
   * @param a 第一个操作数
   * @param b 第二个操作数
   * @param operation 运算符
   * @returns 计算结果或错误信息
   */
  async calculate(a: number, b: number, operation: string): Promise<CalculateResponse> {
    try {
      // 将操作符映射到枚举值
      const opMap: { [key: string]: Operation } = {
        '+': Operation.ADD,
        '-': Operation.SUBTRACT,
        '*': Operation.MULTIPLY,
        '/': Operation.DIVIDE
      };
      
      const op = opMap[operation];
      
      if (op === undefined) {
        return { error: '不支持的操作' };
      }
      
      // 构建请求
      const request: CalculateRequest = { a, b, op };
      
      // 发送请求
      const response = await axios.post('/api/calculator.CalculatorService/Calculate', request, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Connect-Protocol-Version': '1'
        }
      });
      
      // 处理响应
      const data = response.data;
      
      // 处理错误情况
      if (data.error && typeof data.error === 'string') {
        return { error: data.error };
      } else if (data.code !== undefined) {
        return { error: `错误代码: ${data.code}, 消息: ${data.message || '未知错误'}` };
      }
      
      // 返回结果
      return { result: data.result || 0 };
    } catch (error: unknown) {
      console.error('API调用失败:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        if (axiosError.response) {
          return { error: `服务器错误(${axiosError.response.status}): ${axiosError.message}` };
        }
      }
      
      return { error: '计算服务调用失败' };
    }
  }
}; 