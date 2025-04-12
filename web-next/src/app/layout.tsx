import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Connect RPC 计算器',
  description: '使用 Go + Connect RPC 实现的计算器服务',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gradient-to-b from-primary-50 to-white">
        <main className="container mx-auto px-4 py-12">
          {children}
        </main>
      </body>
    </html>
  );
} 