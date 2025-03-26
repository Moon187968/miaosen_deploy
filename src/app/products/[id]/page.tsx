'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product, Region } from '@/lib/db';

// 产品详情页面
export default function ProductPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [region, setRegion] = useState<Region | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 获取产品详情
        const productResponse = await fetch(`/api/products?id=${params.id}`);
        if (!productResponse.ok) {
          throw new Error('获取产品数据失败');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        // 获取地区详情
        const regionResponse = await fetch(`/api/regions?id=${productData.region_id}`);
        if (!regionResponse.ok) {
          throw new Error('获取地区数据失败');
        }
        const regionData = await regionResponse.json();
        setRegion(regionData);
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据时出错');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const nextImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === product.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (product && product.images.length > 0) {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === 0 ? product.images.length - 1 : prevIndex - 1
      );
    }
  };

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

  if (error || !product || !region) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">加载失败！</strong>
          <span className="block sm:inline"> {error || '找不到该产品'}</span>
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
                <Link href={`/regions/${region.id}`} className="text-gray-700 hover:text-green-600">
                  {region.name}
                </Link>
              </div>
            </li>
            <li>
              <div className="flex items-center">
                <span className="mx-2 text-gray-400">/</span>
                <span className="text-gray-500">{product.name}</span>
              </div>
            </li>
          </ol>
        </nav>
      </div>

      {/* 产品详情 */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="md:flex">
          {/* 产品图片 */}
          <div className="md:w-1/2 h-96 md:h-auto bg-gray-200 relative">
            {product.images && product.images.length > 0 ? (
              <>
                <img 
                  src={product.images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain"
                />
                {product.images.length > 1 && (
                  <div className="absolute inset-0 flex items-center justify-between p-4">
                    <button 
                      onClick={prevImage}
                      className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    <button 
                      onClick={nextImage}
                      className="bg-white bg-opacity-50 hover:bg-opacity-75 rounded-full p-2 focus:outline-none"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                )}
                {product.images.length > 1 && (
                  <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                    <div className="flex space-x-2">
                      {product.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`w-2 h-2 rounded-full ${
                            index === currentImageIndex ? 'bg-green-600' : 'bg-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-green-50">
                <span className="text-green-800 text-4xl font-semibold">{product.name.charAt(0)}</span>
              </div>
            )}
          </div>
          
          {/* 产品信息 */}
          <div className="p-6 md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{product.name}</h1>
            
            <div className="mb-6">
              <p className="text-gray-600 mb-4">{product.description}</p>
            </div>
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">产品信息</h2>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex">
                  <span className="font-medium text-gray-600 w-24">产地:</span>
                  <span className="text-gray-800">{product.origin}</span>
                </div>
                <div className="flex">
                  <span className="font-medium text-gray-600 w-24">发货地:</span>
                  <span className="text-gray-800">{product.shipping_from}</span>
                </div>
                {product.specifications && product.specifications.map((spec, index) => (
                  <div key={index} className="flex">
                    <span className="font-medium text-gray-600 w-24">{spec.name}:</span>
                    <span className="text-gray-800">{spec.value}</span>
                  </div>
                ))}
              </div>
            </div>
            
            {product.notes && product.notes.length > 0 && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700 mb-2">注意事项</h2>
                <ul className="list-disc pl-5 text-gray-600 space-y-1">
                  {product.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-2">联系方式</h2>
              <p className="text-gray-600">{product.contact_info}</p>
            </div>
            
            {product.ktt_link && (
              <div className="mt-8">
                <a 
                  href={product.ktt_link} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-block bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                >
                  前往快团团下单
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
