-- Migration number: 0001        2025-03-23
-- 淼森网站数据库初始化

-- 删除已存在的表
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS regions;
DROP TABLE IF EXISTS users;

-- 创建地区表
CREATE TABLE IF NOT EXISTS regions (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image TEXT,
  latitude REAL,
  longitude REAL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建产品表
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  region_id TEXT NOT NULL,
  description TEXT,
  origin TEXT,
  shipping_from TEXT,
  specifications TEXT, -- JSON格式存储规格数组
  notes TEXT, -- JSON格式存储注意事项数组
  images TEXT, -- JSON格式存储图片URL数组
  ktt_link TEXT, -- 快团团链接
  contact_info TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (region_id) REFERENCES regions(id)
);

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL, -- 存储加密后的密码
  role TEXT NOT NULL DEFAULT 'admin',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX idx_products_region_id ON products(region_id);
CREATE INDEX idx_regions_name ON regions(name);
CREATE INDEX idx_users_username ON users(username);

-- 初始数据：添加默认管理员用户（密码为加密后的'admin123'）
INSERT INTO users (id, username, password, role) VALUES 
  ('user_001', 'admin', '$2a$10$JwXdETcWePtU4TpRh.wJI.K3JOq0xYVkJ7bMFLdHXjOZGBdUUEFy.', 'admin');

-- 初始数据：添加示例地区
INSERT INTO regions (id, name, description, image, latitude, longitude) VALUES 
  ('region_001', '云南抚仙湖', '云南抚仙湖位于云南省玉溪市澄江县，是中国第二深的淡水湖，也是世界第三深的淡水湖。湖水清澈见底，被誉为"高原明珠"。', '/images/regions/fuxianhu.jpg', 24.5372, 102.8639);

-- 初始数据：添加示例产品
INSERT INTO products (id, name, region_id, description, origin, shipping_from, specifications, notes, images, ktt_link, contact_info) VALUES 
  ('product_001', '花香L25蓝莓', 'region_001', '云南抚仙湖特产蓝莓，新鲜采摘，口感甜美。', '云南抚仙湖', '云南抚仙湖', 
  '[{"name":"规格","value":"四盒/八盒/十二盒（125g/盒）"}]', 
  '["因水果是生鲜类，再加上生鲜特殊性，无法进行退换货第二次销售，故发货后不接受无条件退货及拒收。","我们提供时令最新鲜的水果，每个人对酸甜感觉多少有不同，因个人口感问题，不作为售后赔付范围。"]', 
  '["/images/products/blueberry1.jpg","/images/products/blueberry2.jpg"]', 
  'https://ktt.pinduoduo.com/groups/detail/0sa6gu87e-0sLomywLottugtrG02ndIQ', 
  '电话：13800138000');
