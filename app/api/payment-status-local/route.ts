import { NextRequest, NextResponse } from 'next/server';
import { getPaymentStatus, setPaymentStatus } from '../shared-state';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('sessionId');

  console.log('GET payment-status called with sessionId:', sessionId);

  if (!sessionId) {
    return NextResponse.json({ error: 'Session ID required' }, { status: 400 });
  }

  const status = getPaymentStatus(sessionId);
  console.log('Returning status for GET request:', { sessionId, status });
  return NextResponse.json({ status });
}

export async function POST(request: NextRequest) {
  try {
    const { sessionId, status } = await request.json();
    
    console.log('POST payment-status called with:', { sessionId, status });
    
    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Session ID and status required' }, { status: 400 });
    }

    setPaymentStatus(sessionId, status);
    console.log('Status set successfully via POST');
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Status update error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 