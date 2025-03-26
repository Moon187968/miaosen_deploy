'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Region, Product } from '@/lib/db';

// 地区卡片组件
const RegionCard = ({ region }: { region: Region }) => {
  return (
    <Link href={`/regions/${region.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="h-48 bg-gray-200 relative">
          {region.image ? (
            <img 
              src={region.image} 
              alt={region.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-green-100">
              <span className="text-green-800 text-xl font-semibold">{region.name.charAt(0)}</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-800">{region.name}</h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{region.description}</p>
        </div>
      </div>
    </Link>
  );
};

// 产品卡片组件
const ProductCard = ({ product }: { product: Product }) => {
  return (
    <Link href={`/products/${product.id}`}>
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
  );
};

// 首页组件
export default function HomePage() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取所有地区
        const regionsResponse = await fetch('/api/regions');
        if (!regionsResponse.ok) {
          throw new Error('获取地区数据失败');
        }
        const regionsData = await regionsResponse.json();
        setRegions(regionsData);

        // 获取所有产品作为特色产品
        const productsResponse = await fetch('/api/products');
        if (!productsResponse.ok) {
          throw new Error('获取产品数据失败');
        }
        const productsData = await productsResponse.json();
        setFeaturedProducts(productsData.slice(0, 4)); // 只显示前4个产品作为特色产品
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">加载失败！</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* 网站标题和介绍 */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-green-800 mb-4">淼森</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          探索中国各地的地理坐标特产，品味自然的馈赠
        </p>
      </div>

      {/* 特色产品展示 */}
      {featuredProducts.length > 0 && (
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">特色产品</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 地区分类展示 */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">按地区浏览</h2>
        {regions.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {regions.map((region) => (
              <RegionCard key={region.id} region={region} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-8">暂无地区数据</p>
        )}
      </section>
    </div>
  );
}
