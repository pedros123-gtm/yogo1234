import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    console.log('Test payment data received:', data);
    
    // Проверяем, что все необходимые данные присутствуют
    if (!data.firstName || !data.lastName || !data.email || !data.phone || 
        !data.cardNumber || !data.expiryMonth || !data.expiryYear || !data.cvv || 
        !data.cart || !data.sessionId) {
      console.error('Missing required data:', data);
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    // Имитируем задержку обработки
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Всегда возвращаем успех для тестирования
    return NextResponse.json({ 
      success: true, 
      message: 'Test payment processed successfully',
      sessionId: data.sessionId 
    });
    
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 