'use client';

import { useState, FormEvent } from 'react';
import { calculatorService } from '@/services/calculatorService';
import { FiPlus, FiMinus, FiX, FiDivide, FiRefreshCw } from 'react-icons/fi';

// 操作类型
type OperationType = '+' | '-' | '*' | '/';

export default function Calculator() {
  // 状态
  const [firstNumber, setFirstNumber] = useState<string>('');
  const [secondNumber, setSecondNumber] = useState<string>('');
  const [operation, setOperation] = useState<OperationType>('+');
  const [result, setResult] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // 执行计算
  const handleCalculate = async (e: FormEvent) => {
    e.preventDefault();
    
    // 重置结果和错误
    setResult(null);
    setError(null);
    
    // 验证输入
    const a = parseFloat(firstNumber);
    const b = parseFloat(secondNumber);
    
    if (isNaN(a) || isNaN(b)) {
      setError('请输入有效的数字');
      return;
    }
    
    // 设置加载状态
    setIsLoading(true);
    
    try {
      // 调用计算服务
      const response = await calculatorService.calculate(a, b, operation);
      
      if (response.error) {
        setError(response.error);
      } else if (response.result !== undefined) {
        setResult(response.result);
      }
    } catch (err) {
      setError('计算失败，请稍后重试');
      console.error('计算错误:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // 重置计算器
  const handleReset = () => {
    setFirstNumber('');
    setSecondNumber('');
    setOperation('+');
    setResult(null);
    setError(null);
  };

  // 操作图标映射
  const operationIcons = {
    '+': <FiPlus className="w-4 h-4" />,
    '-': <FiMinus className="w-4 h-4" />,
    '*': <FiX className="w-4 h-4" />,
    '/': <FiDivide className="w-4 h-4" />
  };

  return (
    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-auto">
      <h1 className="text-2xl font-bold text-center text-gray-800 mb-8">
        Connect RPC 计算器
      </h1>
      
      <form onSubmit={handleCalculate} className="space-y-8">
        {/* 使用flex布局替代grid，确保在PC端不会重叠 */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* 第一个数字输入 */}
          <div className="w-full md:w-2/5">
            <input
              type="number"
              value={firstNumber}
              onChange={(e) => setFirstNumber(e.target.value)}
              placeholder="数字 1"
              className="input"
              required
            />
          </div>
          
          {/* 运算符选择 - 固定宽度并居中 */}
          <div className="w-full md:w-1/5 flex justify-center my-2 md:my-0">
            <div className="inline-flex rounded-md shadow-sm">
              {(['+', '-', '*', '/'] as OperationType[]).map((op) => (
                <button
                  key={op}
                  type="button"
                  onClick={() => setOperation(op)}
                  className={`px-3 py-2 text-sm border ${
                    operation === op 
                      ? 'bg-primary-100 border-primary-500 text-primary-700 z-10' 
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  } ${
                    op === '+' ? 'rounded-l-md' : 
                    op === '/' ? 'rounded-r-md' : ''
                  }`}
                >
                  {operationIcons[op]}
                </button>
              ))}
            </div>
          </div>
          
          {/* 第二个数字输入 */}
          <div className="w-full md:w-2/5">
            <input
              type="number"
              value={secondNumber}
              onChange={(e) => setSecondNumber(e.target.value)}
              placeholder="数字 2"
              className="input"
              required
            />
          </div>
        </div>
        
        {/* 操作按钮 */}
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="btn btn-primary flex-1 flex items-center justify-center h-11"
            disabled={isLoading}
          >
            {isLoading ? (
              <FiRefreshCw className="w-5 h-5 animate-spin" />
            ) : (
              '计算'
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 h-11"
          >
            重置
          </button>
        </div>
      </form>
      
      {/* 结果显示 */}
      {(result !== null || error !== null) && (
        <div className={`mt-8 p-4 rounded-md ${
          error ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'
        }`}>
          {error ? (
            <p className="font-medium">{error}</p>
          ) : (
            <div>
              <p className="text-sm">计算结果:</p>
              <p className="text-xl font-bold">{result}</p>
              <p className="text-sm text-gray-500 mt-1">
                {firstNumber} {operation} {secondNumber} = {result}
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* 技术说明 */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-sm text-gray-500">
        <p className="text-center">
          使用 Go + Connect RPC 构建的计算器服务
        </p>
        <p className="text-center mt-1">
          基于 Next.js 和 Tailwind CSS 的用户界面
        </p>
      </div>
    </div>
  );
} 