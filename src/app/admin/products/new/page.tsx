'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Region } from '@/lib/db';

export default function NewProductPage() {
  const [formData, setFormData] = useState({
    name: '',
    region_id: '',
    description: '',
    origin: '',
    shipping_from: '',
    specifications: [{ name: '规格', value: '' }],
    notes: [''],
    images: [''],
    ktt_link: '',
    contact_info: ''
  });
  const [regions, setRegions] = useState<Region[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // 获取所有地区
    const fetchRegions = async () => {
      try {
        const response = await fetch('/api/regions');
        if (!response.ok) {
          throw new Error('获取地区数据失败');
        }
        const data = await response.json();
        setRegions(data);
        
        // 如果有地区数据，默认选择第一个
        if (data.length > 0) {
          setFormData(prev => ({ ...prev, region_id: data[0].id }));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载地区数据时出错');
      }
    };

    fetchRegions();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (index: number, field: 'name' | 'value', value: string) => {
    const newSpecs = [...formData.specifications];
    newSpecs[index][field] = value;
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const addSpec = () => {
    setFormData(prev => ({
      ...prev,
      specifications: [...prev.specifications, { name: '', value: '' }]
    }));
  };

  const removeSpec = (index: number) => {
    const newSpecs = [...formData.specifications];
    newSpecs.splice(index, 1);
    setFormData(prev => ({ ...prev, specifications: newSpecs }));
  };

  const handleNoteChange = (index: number, value: string) => {
    const newNotes = [...formData.notes];
    newNotes[index] = value;
    setFormData(prev => ({ ...prev, notes: newNotes }));
  };

  const addNote = () => {
    setFormData(prev => ({
      ...prev,
      notes: [...prev.notes, '']
    }));
  };

  const removeNote = (index: number) => {
    const newNotes = [...formData.notes];
    newNotes.splice(index, 1);
    setFormData(prev => ({ ...prev, notes: newNotes }));
  };

  const handleImageChange = (index: number, value: string) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, '']
    }));
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // 过滤掉空的规格、注意事项和图片
      const filteredData = {
        ...formData,
        specifications: formData.specifications.filter(spec => spec.name.trim() !== '' && spec.value.trim() !== ''),
        notes: formData.notes.filter(note => note.trim() !== ''),
        images: formData.images.filter(image => image.trim() !== '')
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(filteredData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '创建产品失败');
      }

      // 创建成功，跳转到产品列表页
      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : '创建产品失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">添加新产品</h1>
        <Link href="/admin/products">
          <button className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded">
            返回列表
          </button>
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
          <strong className="font-bold">错误：</strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <form onSubmit={handleSubmit}>
          <div className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6">
              {/* 基本信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">基本信息</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">产品名称 *</label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="region_id" className="block text-sm font-medium text-gray-700">所属地区 *</label>
                    <select
                      name="region_id"
                      id="region_id"
                      required
                      value={formData.region_id}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    >
                      {regions.length === 0 ? (
                        <option value="">暂无地区数据</option>
                      ) : (
                        regions.map(region => (
                          <option key={region.id} value={region.id}>{region.name}</option>
                        ))
                      )}
                    </select>
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">产品描述</label>
                    <textarea
                      name="description"
                      id="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="origin" className="block text-sm font-medium text-gray-700">产地 *</label>
                    <input
                      type="text"
                      name="origin"
                      id="origin"
                      required
                      value={formData.origin}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="shipping_from" className="block text-sm font-medium text-gray-700">发货地</label>
                    <input
                      type="text"
                      name="shipping_from"
                      id="shipping_from"
                      value={formData.shipping_from}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
              
              {/* 规格信息 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">规格信息</h3>
                  <button
                    type="button"
                    onClick={addSpec}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    添加规格
                  </button>
                </div>
                
                {formData.specifications.map((spec, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="规格名称"
                      value={spec.name}
                      onChange={(e) => handleSpecChange(index, 'name', e.target.value)}
                      className="block w-1/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    <input
                      type="text"
                      placeholder="规格值"
                      value={spec.value}
                      onChange={(e) => handleSpecChange(index, 'value', e.target.value)}
                      className="block w-2/3 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeSpec(index)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 注意事项 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">注意事项</h3>
                  <button
                    type="button"
                    onClick={addNote}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    添加注意事项
                  </button>
                </div>
                
                {formData.notes.map((note, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="注意事项"
                      value={note}
                      onChange={(e) => handleNoteChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeNote(index)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
              
              {/* 图片信息 */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">图片信息</h3>
                  <button
                    type="button"
                    onClick={addImage}
                    className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    添加图片
                  </button>
                </div>
                
                {formData.images.map((image, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="图片URL"
                      value={image}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="inline-flex items-center p-1 border border-transparent rounded-full text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                ))}
                <p className="mt-1 text-sm text-gray-500">输入图片的URL地址，例如：/images/products/product1.jpg</p>
              </div>
              
              {/* 联系和下单信息 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">联系和下单信息</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label htmlFor="ktt_link" className="block text-sm font-medium text-gray-700">快团团链接</label>
                    <input
                      type="text"
                      name="ktt_link"
                      id="ktt_link"
                      value={formData.ktt_link}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="contact_info" className="block text-sm font-medium text-gray-700">联系方式</label>
                    <input
                      type="text"
                      name="contact_info"
                      id="contact_info"
                      value={formData.contact_info}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="submit"
              disabled={loading}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white ${
                loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
            >
              {loading ? '保存中...' : '保存产品'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
