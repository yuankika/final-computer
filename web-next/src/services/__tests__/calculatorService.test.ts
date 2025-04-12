import { calculatorService } from '../calculatorService';
import axios from 'axios';

// 模拟axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('calculatorService', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.resetAllMocks();
  });

  describe('calculate', () => {
    it('应正确处理加法运算', async () => {
      // 模拟API响应
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: 15 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '+');

      // 验证结果
      expect(result).toEqual({ result: 15 });

      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/calculator.CalculatorService/Calculate',
        { a: 10, b: 5, op: 0 },
        expect.any(Object)
      );
    });

    it('应正确处理减法运算', async () => {
      // 模拟API响应
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: 5 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '-');

      // 验证结果
      expect(result).toEqual({ result: 5 });

      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/calculator.CalculatorService/Calculate',
        { a: 10, b: 5, op: 1 },
        expect.any(Object)
      );
    });

    it('应正确处理乘法运算', async () => {
      // 模拟API响应
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: 50 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '*');

      // 验证结果
      expect(result).toEqual({ result: 50 });

      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/calculator.CalculatorService/Calculate',
        { a: 10, b: 5, op: 2 },
        expect.any(Object)
      );
    });

    it('应正确处理除法运算', async () => {
      // 模拟API响应
      mockedAxios.post.mockResolvedValueOnce({
        data: { result: 2 },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '/');

      // 验证结果
      expect(result).toEqual({ result: 2 });

      // 验证API调用
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/api/calculator.CalculatorService/Calculate',
        { a: 10, b: 5, op: 3 },
        expect.any(Object)
      );
    });

    it('应正确处理除以零的错误', async () => {
      // 模拟API响应
      mockedAxios.post.mockResolvedValueOnce({
        data: { error: '除数不能为零' },
        status: 200,
        statusText: 'OK',
        headers: {},
        config: {} as any,
      });

      // 调用服务
      const result = await calculatorService.calculate(10, 0, '/');

      // 验证结果
      expect(result).toEqual({ error: '除数不能为零' });
    });

    it('应正确处理API错误', async () => {
      // 模拟API错误
      const errorMessage = 'Network Error';
      mockedAxios.post.mockRejectedValueOnce(new Error(errorMessage));

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '+');

      // 验证结果
      expect(result).toEqual({ error: '计算服务调用失败' });
    });

    it('应正确处理HTTP错误', async () => {
      // 模拟HTTP错误
      const axiosError: any = {
        isAxiosError: true,
        response: {
          status: 500,
          data: { message: 'Internal Server Error' }
        },
        message: 'Request failed with status code 500'
      };
      mockedAxios.post.mockRejectedValueOnce(axiosError);
      mockedAxios.isAxiosError.mockReturnValueOnce(true);

      // 调用服务
      const result = await calculatorService.calculate(10, 5, '+');

      // 验证结果
      expect(result).toEqual({ 
        error: expect.stringContaining('服务器错误(500)') 
      });
    });

    it('应处理不支持的操作', async () => {
      // 调用服务，使用不支持的操作符
      const result = await calculatorService.calculate(10, 5, '%');

      // 验证结果
      expect(result).toEqual({ error: '不支持的操作' });

      // 验证没有调用API
      expect(mockedAxios.post).not.toHaveBeenCalled();
    });
  });
}); 