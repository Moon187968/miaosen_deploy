import { NextRequest, NextResponse } from 'next/server';
import { createProduct, updateProduct, deleteProduct } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const env = request.env as any;
    
    // 验证必填字段
    if (!data.name || !data.region_id || !data.origin) {
      return NextResponse.json({ error: '产品名称、所属地区和产地为必填项' }, { status: 400 });
    }
    
    // 创建产品
    const productId = await createProduct(env.DB, data);
    
    return NextResponse.json({ id: productId, success: true });
  } catch (error) {
    console.error('创建产品失败:', error);
    return NextResponse.json({ error: '创建产品失败' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少产品ID' }, { status: 400 });
    }
    
    const data = await request.json();
    const env = request.env as any;
    
    // 更新产品
    const success = await updateProduct(env.DB, id, data);
    
    if (!success) {
      return NextResponse.json({ error: '产品不存在' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('更新产品失败:', error);
    return NextResponse.json({ error: '更新产品失败' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: '缺少产品ID' }, { status: 400 });
    }
    
    const env = request.env as any;
    
    // 删除产品
    const success = await deleteProduct(env.DB, id);
    
    if (!success) {
      return NextResponse.json({ error: '产品不存在或删除失败' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除产品失败:', error);
    return NextResponse.json({ error: '删除产品失败' }, { status: 500 });
  }
}
