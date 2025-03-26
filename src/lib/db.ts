// 数据库操作工具函数
import { D1Database } from '@cloudflare/workers-types';

// 地区类型定义
export interface Region {
  id: string;
  name: string;
  description: string;
  image: string;
  latitude: number;
  longitude: number;
  created_at: string;
  updated_at: string;
}

// 产品类型定义
export interface Product {
  id: string;
  name: string;
  region_id: string;
  description: string;
  origin: string;
  shipping_from: string;
  specifications: Array<{name: string, value: string}>;
  notes: string[];
  images: string[];
  ktt_link: string;
  contact_info: string;
  created_at: string;
  updated_at: string;
}

// 获取所有地区
export async function getAllRegions(db: D1Database): Promise<Region[]> {
  const { results } = await db.prepare('SELECT * FROM regions ORDER BY name').all<Region>();
  return results;
}

// 获取特定地区
export async function getRegionById(db: D1Database, id: string): Promise<Region | null> {
  const region = await db.prepare('SELECT * FROM regions WHERE id = ?').bind(id).first<Region>();
  return region || null;
}

// 获取所有产品
export async function getAllProducts(db: D1Database): Promise<Product[]> {
  const { results } = await db.prepare('SELECT * FROM products ORDER BY name').all<any>();
  
  // 处理JSON字符串字段
  return results.map((product: any) => ({
    ...product,
    specifications: JSON.parse(product.specifications || '[]'),
    notes: JSON.parse(product.notes || '[]'),
    images: JSON.parse(product.images || '[]')
  }));
}

// 获取特定产品
export async function getProductById(db: D1Database, id: string): Promise<Product | null> {
  const product = await db.prepare('SELECT * FROM products WHERE id = ?').bind(id).first<any>();
  
  if (!product) return null;
  
  // 处理JSON字符串字段
  return {
    ...product,
    specifications: JSON.parse(product.specifications || '[]'),
    notes: JSON.parse(product.notes || '[]'),
    images: JSON.parse(product.images || '[]')
  };
}

// 获取特定地区的所有产品
export async function getProductsByRegionId(db: D1Database, regionId: string): Promise<Product[]> {
  const { results } = await db.prepare('SELECT * FROM products WHERE region_id = ? ORDER BY name')
    .bind(regionId)
    .all<any>();
  
  // 处理JSON字符串字段
  return results.map((product: any) => ({
    ...product,
    specifications: JSON.parse(product.specifications || '[]'),
    notes: JSON.parse(product.notes || '[]'),
    images: JSON.parse(product.images || '[]')
  }));
}

// 创建新产品
export async function createProduct(db: D1Database, product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const id = `product_${Date.now()}`;
  
  await db.prepare(`
    INSERT INTO products (
      id, name, region_id, description, origin, shipping_from, 
      specifications, notes, images, ktt_link, contact_info
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    product.name,
    product.region_id,
    product.description,
    product.origin,
    product.shipping_from,
    JSON.stringify(product.specifications),
    JSON.stringify(product.notes),
    JSON.stringify(product.images),
    product.ktt_link,
    product.contact_info
  ).run();
  
  return id;
}

// 更新产品
export async function updateProduct(db: D1Database, id: string, product: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existingProduct = await getProductById(db, id);
  if (!existingProduct) return false;
  
  const updates = [];
  const values = [];
  
  if (product.name !== undefined) {
    updates.push('name = ?');
    values.push(product.name);
  }
  
  if (product.region_id !== undefined) {
    updates.push('region_id = ?');
    values.push(product.region_id);
  }
  
  if (product.description !== undefined) {
    updates.push('description = ?');
    values.push(product.description);
  }
  
  if (product.origin !== undefined) {
    updates.push('origin = ?');
    values.push(product.origin);
  }
  
  if (product.shipping_from !== undefined) {
    updates.push('shipping_from = ?');
    values.push(product.shipping_from);
  }
  
  if (product.specifications !== undefined) {
    updates.push('specifications = ?');
    values.push(JSON.stringify(product.specifications));
  }
  
  if (product.notes !== undefined) {
    updates.push('notes = ?');
    values.push(JSON.stringify(product.notes));
  }
  
  if (product.images !== undefined) {
    updates.push('images = ?');
    values.push(JSON.stringify(product.images));
  }
  
  if (product.ktt_link !== undefined) {
    updates.push('ktt_link = ?');
    values.push(product.ktt_link);
  }
  
  if (product.contact_info !== undefined) {
    updates.push('contact_info = ?');
    values.push(product.contact_info);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  if (updates.length === 0) return true;
  
  const query = `UPDATE products SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  await db.prepare(query).bind(...values).run();
  return true;
}

// 删除产品
export async function deleteProduct(db: D1Database, id: string): Promise<boolean> {
  const result = await db.prepare('DELETE FROM products WHERE id = ?').bind(id).run();
  return result.success;
}

// 创建新地区
export async function createRegion(db: D1Database, region: Omit<Region, 'id' | 'created_at' | 'updated_at'>): Promise<string> {
  const id = `region_${Date.now()}`;
  
  await db.prepare(`
    INSERT INTO regions (
      id, name, description, image, latitude, longitude
    ) VALUES (?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    region.name,
    region.description,
    region.image,
    region.latitude,
    region.longitude
  ).run();
  
  return id;
}

// 更新地区
export async function updateRegion(db: D1Database, id: string, region: Partial<Omit<Region, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
  const existingRegion = await getRegionById(db, id);
  if (!existingRegion) return false;
  
  const updates = [];
  const values = [];
  
  if (region.name !== undefined) {
    updates.push('name = ?');
    values.push(region.name);
  }
  
  if (region.description !== undefined) {
    updates.push('description = ?');
    values.push(region.description);
  }
  
  if (region.image !== undefined) {
    updates.push('image = ?');
    values.push(region.image);
  }
  
  if (region.latitude !== undefined) {
    updates.push('latitude = ?');
    values.push(region.latitude);
  }
  
  if (region.longitude !== undefined) {
    updates.push('longitude = ?');
    values.push(region.longitude);
  }
  
  updates.push('updated_at = CURRENT_TIMESTAMP');
  
  if (updates.length === 0) return true;
  
  const query = `UPDATE regions SET ${updates.join(', ')} WHERE id = ?`;
  values.push(id);
  
  await db.prepare(query).bind(...values).run();
  return true;
}

// 删除地区
export async function deleteRegion(db: D1Database, id: string): Promise<boolean> {
  // 检查是否有产品关联到该地区
  const { count } = await db.prepare('SELECT COUNT(*) as count FROM products WHERE region_id = ?')
    .bind(id)
    .first<{count: number}>();
  
  if (count > 0) {
    return false; // 有关联产品，不能删除
  }
  
  const result = await db.prepare('DELETE FROM regions WHERE id = ?').bind(id).run();
  return result.success;
}
