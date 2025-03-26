'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Product, Region } from '@/lib/db';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [regions, setRegions] = useState<{[key: string]: Region}>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取所有产品
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('获取产品数据失败');
        }
        const productsData = await productsResponse.json();
        setProducts(productsData);
        
        // 获取所有地区
        const regionsResponse = await fetch('/api/regions');
        if (!regionsResponse.ok) {
          throw new Error('获取地区数据失败');
        }
        const regionsData = await regionsResponse.json();
        
        // 将地区数据转换为对象，方便查找
        const regionsMap: {[key: string]: Region} = {};
        regionsData.forEach((region: Region) => {
          regionsMap[region.id] = region;
        });
        setRegions(regionsMap);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('确定要删除这个产品吗？此操作不可撤销。')) {
      return;
    }
    
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('删除产品失败');
      }
      
      // 更新产品列表
      setProducts(products.filter(product => product.id !== id));
    } catch (error) {
      alert('删除产品失败: ' + (error instanceof Error ? error.message : '未知错误'));
    }
  };

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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">产品管理</h1>
        <Link href="/admin/products/new">
          <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
            添加新产品
          </button>
        </Link>
      </div>
      
      {products.length === 0 ? (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 sm:p-6 text-center">
            <p className="text-gray-500">暂无产品数据</p>
            <Link href="/admin/products/new">
              <button className="mt-4 bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                添加第一个产品
              </button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {products.map((product) => (
              <li key={product.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12 bg-gray-200 rounded-md overflow-hidden">
                        {product.images && product.images.length > 0 ? (
                          <img 
                            src={product.images[0]} 
                            alt={product.name} 
                            className="h-12 w-12 object-cover"
                          />
                        ) : (
                          <div className="h-12 w-12 flex items-center justify-center bg-green-50">
                            <span className="text-green-800 text-lg font-semibold">{product.name.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                        <div className="text-sm text-gray-500">
                          <span>产地: {product.origin}</span>
                          <span className="mx-2">•</span>
                          <span>地区: {regions[product.region_id]?.name || '未知地区'}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Link href={`/admin/products/edit/${product.id}`}>
                        <button className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-1 px-3 rounded text-sm">
                          编辑
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-1 px-3 rounded text-sm"
                      >
                        删除
                      </button>
                      <Link href={`/products/${product.id}`} target="_blank">
                        <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-1 px-3 rounded text-sm">
                          查看
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
