// 导入testing-library的扩展断言
import '@testing-library/jest-dom';

// 禁用控制台错误以保持测试输出整洁
// 这在测试中尤其有用，因为我们可能会测试一些会产生预期错误的情况
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' && 
    (
      args[0].includes('Warning: ReactDOM.render') ||
      args[0].includes('Warning: React.createElement')
    )
  ) {
    return;
  }
  originalConsoleError(...args);
}; 