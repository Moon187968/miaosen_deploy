import { NextRequest, NextResponse } from 'next/server';

// 登出API
export async function POST(request: NextRequest) {
  try {
    // 清除会话cookie
    return NextResponse.json({ success: true }, {
      headers: {
        'Set-Cookie': `session=; Path=/; HttpOnly; SameSite=Strict; Expires=Thu, 01 Jan 1970 00:00:00 GMT`
      }
    });
  } catch (error) {
    console.error('登出失败:', error);
    return NextResponse.json({ error: '登出失败' }, { status: 500 });
  }
}
