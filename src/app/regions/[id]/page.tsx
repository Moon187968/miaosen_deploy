'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Region, Product } from '@/lib/db';

// 地区详情页面
export default function RegionPage({ params }: { params: { id: string } }) {
  const [region, setRegion] = useState<Region | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取地区详情
        const regionResponse = await fetch(`/api/regions?id=${params.id}`);
        if (!regionResponse.ok) {
          throw new Error('获取地区数据失败');
        }
        const regionData = await regionResponse.json();
        setRegion(regionData);

        // 获取该地区的所有产品
        const productsResponse = await fetch(`/api/products?regionId=${params.id}`);
        if (!productsResponse.ok) {
          throw new Error('获取产品数据失败');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-green-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">正在加载数据...</p>
        </div>
      </div>
    );
  }

  if (error || !region) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">加载失败！</strong>
          <span className="block sm:inline"> {error || '找不到该地区'}</span>
          <div className="mt-4">
            <Link href="/" className="text-blue-500 hover:underline">返回首页</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 面包屑导航 */}
      <div className="mb-6">
        <nav className="flex" aria-label="Breadcrumb">
          <ol className="inline-flex items-center space-x-1 md:space-x-3">
            <li className="inline-flex items-center">
              <Link href="/" className="text-gray-700 hover:text-green-600">
                首页
              </Link>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{region.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* 地区信息 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          <div className="md:w-1/3 h-64 md:h-auto bg-gray-200">
            {region.image ? (
              <img 
                src={region.image} 
                alt={region.name} 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-100">
                <span className="text-green-800 text-4xl font-semibold">{region.name.charAt(0)}</span>
              </div>
            )}
          </div>
          <div className="p-6 md:w-2/3">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{region.name}</h1>
            <p className="text-gray-600 mb-4">{region.description}</p>
            {region.latitude && region.longitude && (
              <div className="text-sm text-gray-500">
                地理坐标: {region.latitude.toFixed(4)}, {region.longitude.toFixed(4)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 产品列表 */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">{region.name}特产</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/products/${product.id}`}>
                <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                  <div className="h-48 bg-gray-200 relative">
                    {product.images && product.images.length > 0 ? (
                      <img 
                        src={product.images[0]} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-green-50">
                        <span className="text-green-800 text-xl font-semibold">{product.name.charAt(0)}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
                    <p className="text-sm text-gray-600 mt-1">{product.origin}</p>
                    <p className="text-sm text-gray-500 mt-2 line-clamp-2">{product.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">暂无产品数据</p>
        )}
      </section>
    </div>
  );
}
