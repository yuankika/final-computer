import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Calculator from '../Calculator';
import { calculatorService } from '@/services/calculatorService';

// 模拟calculatorService
jest.mock('@/services/calculatorService', () => ({
  calculatorService: {
    calculate: jest.fn(),
  },
}));

describe('Calculator组件', () => {
  beforeEach(() => {
    // 重置所有模拟
    jest.clearAllMocks();
  });

  it('应渲染计算器界面', () => {
    render(<Calculator />);
    
    // 验证标题
    expect(screen.getByText('Connect RPC 计算器')).toBeInTheDocument();
    
    // 验证输入框
    expect(screen.getByPlaceholderText('数字 1')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('数字 2')).toBeInTheDocument();
    
    // 验证操作按钮
    expect(screen.getByRole('button', { name: '计算' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '重置' })).toBeInTheDocument();
  });

  it('应在输入无效数字时显示错误', async () => {
    const user = userEvent.setup();
    render(<Calculator />);
    
    // 只填写第一个输入框
    await user.type(screen.getByPlaceholderText('数字 1'), '10');
    
    // 点击计算按钮
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    // 验证错误消息
    expect(await screen.findByText('请输入有效的数字')).toBeInTheDocument();
  });

  it('应正确执行加法计算', async () => {
    // 模拟服务返回
    (calculatorService.calculate as jest.Mock).mockResolvedValue({ result: 15 });
    
    const user = userEvent.setup();
    render(<Calculator />);
    
    // 填写输入框
    await user.type(screen.getByPlaceholderText('数字 1'), '10');
    await user.type(screen.getByPlaceholderText('数字 2'), '5');
    
    // 点击计算按钮
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    // 验证服务调用
    expect(calculatorService.calculate).toHaveBeenCalledWith(10, 5, '+');
    
    // 验证结果显示
    await waitFor(() => {
      expect(screen.getByText('计算结果:')).toBeInTheDocument();
      expect(screen.getByText('15')).toBeInTheDocument();
    });
  });

  it('应正确显示除以零错误', async () => {
    // 模拟服务返回
    (calculatorService.calculate as jest.Mock).mockResolvedValue({ error: '除数不能为零' });
    
    const user = userEvent.setup();
    render(<Calculator />);
    
    // 填写输入框
    await user.type(screen.getByPlaceholderText('数字 1'), '10');
    await user.type(screen.getByPlaceholderText('数字 2'), '0');
    
    // 选择除法操作
    const divideButton = screen.getAllByRole('button')[3]; // 第四个按钮是除法
    await user.click(divideButton);
    
    // 点击计算按钮
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    // 验证服务调用
    expect(calculatorService.calculate).toHaveBeenCalledWith(10, 0, '/');
    
    // 验证错误显示
    await waitFor(() => {
      expect(screen.getByText('除数不能为零')).toBeInTheDocument();
    });
  });

  it('应在重置按钮点击时清空所有输入和结果', async () => {
    // 模拟服务返回
    (calculatorService.calculate as jest.Mock).mockResolvedValue({ result: 15 });
    
    const user = userEvent.setup();
    render(<Calculator />);
    
    // 填写输入框
    await user.type(screen.getByPlaceholderText('数字 1'), '10');
    await user.type(screen.getByPlaceholderText('数字 2'), '5');
    
    // 点击计算按钮
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    // 等待结果显示
    await waitFor(() => {
      expect(screen.getByText('15')).toBeInTheDocument();
    });
    
    // 点击重置按钮
    await user.click(screen.getByRole('button', { name: '重置' }));
    
    // 验证输入框已清空
    expect(screen.getByPlaceholderText('数字 1')).toHaveValue('');
    expect(screen.getByPlaceholderText('数字 2')).toHaveValue('');
    
    // 验证结果已清除
    expect(screen.queryByText('计算结果:')).not.toBeInTheDocument();
  });

  it('应对API失败显示错误信息', async () => {
    // 模拟服务失败
    (calculatorService.calculate as jest.Mock).mockRejectedValue(new Error('API错误'));
    
    const user = userEvent.setup();
    render(<Calculator />);
    
    // 填写输入框
    await user.type(screen.getByPlaceholderText('数字 1'), '10');
    await user.type(screen.getByPlaceholderText('数字 2'), '5');
    
    // 点击计算按钮
    await user.click(screen.getByRole('button', { name: '计算' }));
    
    // 验证错误显示
    await waitFor(() => {
      expect(screen.getByText('计算失败，请稍后重试')).toBeInTheDocument();
    });
  });
}); 