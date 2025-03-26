'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalRegions: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // 获取所有产品
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('获取产品数据失败');
        }
        const productsData = await productsResponse.json();
        
        // 获取所有地区
        const regionsResponse = await fetch('/api/regions');
        if (!regionsResponse.ok) {
          throw new Error('获取地区数据失败');
        }
        const regionsData = await regionsResponse.json();
        
        setStats({
          totalProducts: productsData.length,
          totalRegions: regionsData.length
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
        <p className="mt-4 text-gray-600">正在加载数据...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong className="font-bold">加载失败！</strong>
        <span className="block sm:inline"> {error}</span>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">控制台</h1>
      
      {/* 统计卡片 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">总产品数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalProducts}</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/admin/products" className="font-medium text-green-600 hover:text-green-500">
                查看所有产品
              </Link>
            </div>
          </div>
        </div>
        
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">总地区数</dt>
              <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalRegions}</dd>
            </dl>
          </div>
          <div className="bg-gray-50 px-4 py-4 sm:px-6">
            <div className="text-sm">
              <Link href="/admin/regions" className="font-medium text-green-600 hover:text-green-500">
                查看所有地区
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 快速操作 */}
      <div className="bg-white shadow rounded-lg mb-8">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">快速操作</h3>
          <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <Link href="/admin/products/new">
                <div className="group flex items-center px-4 py-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-green-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">添加新产品</h4>
                    <p className="text-sm text-gray-500">添加新的特产信息到网站</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div>
              <Link href="/admin/regions/new">
                <div className="group flex items-center px-4 py-4 border border-gray-300 rounded-md hover:bg-gray-50 cursor-pointer">
                  <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-md bg-green-500 text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-medium text-gray-900 group-hover:text-gray-700">添加新地区</h4>
                    <p className="text-sm text-gray-500">添加新的地理位置信息</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* 使用指南 */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">管理系统使用指南</h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500">
            <p>通过管理系统，您可以轻松管理淼森网站上的特产信息。</p>
          </div>
          <div className="mt-5">
            <ul className="space-y-4 text-sm text-gray-500">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2">在<strong>产品管理</strong>页面，您可以添加、编辑和删除产品信息。</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2">在<strong>地区管理</strong>页面，您可以添加、编辑和删除地区信息。</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="ml-2">添加新产品时，需要先选择或创建对应的地区。</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
