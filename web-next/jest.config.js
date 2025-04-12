const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // 提供Next.js应用的路径，以加载next.config.js和.env文件
  dir: './',
});

// 自定义Jest配置
/** @type {import('jest').Config} */
const customJestConfig = {
  // 添加更多自定义配置
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>/'],
  testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

// 通过创建Next.js的Jest配置来导出
module.exports = createJestConfig(customJestConfig); 