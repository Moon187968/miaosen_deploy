'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// 中间件组件，检查用户是否已登录
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // 检查用户是否已登录
    const checkAuth = async () => {
      try {
        // 这里简单通过cookie存在来判断，实际应该验证cookie的有效性
        const hasCookie = document.cookie.includes('session=');
        
        if (!hasCookie) {
          // 未登录，重定向到登录页
          router.push('/admin/login');
          return;
        }
        
        setIsAuthenticated(true);
      } catch (error) {
        console.error('验证登录状态失败:', error);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/admin/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
        <p className="ml-2">加载中...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // 未认证时不显示内容，等待重定向
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* 管理界面顶部导航 */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <Link href="/admin" className="text-xl font-bold text-green-600">
                  淼森管理系统
                </Link>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link href="/admin" className="border-green-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  控制台
                </Link>
                <Link href="/admin/products" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  产品管理
                </Link>
                <Link href="/admin/regions" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                  地区管理
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 mr-4 text-sm">
                查看网站
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                退出登录
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* 主要内容区域 */}
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}
