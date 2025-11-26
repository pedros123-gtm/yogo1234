const fs = require('fs');
const path = require('path');

// Загружаем переменные из .env.local
function loadEnvLocal() {
  const envPath = path.join(__dirname, '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('❌ Файл .env.local не найден!');
    process.exit(1);
  }

  const envContent = fs.readFileSync(envPath, 'utf8');
  const envVars = {};
  
  envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  });

  return envVars;
}

async function setupWebhook() {
  const env = loadEnvLocal();
  
  const botToken = env.TELEGRAM_BOT_TOKEN;
  const ngrokUrl = 'https://ed38-213-109-66-73.ngrok-free.app';
  
  if (!botToken) {
    console.error('❌ TELEGRAM_BOT_TOKEN не найден в .env.local');
    return;
  }

  console.log('🔧 Устанавливаем webhook...');
  console.log('Bot Token:', botToken.substring(0, 10) + '...');
  console.log('Webhook URL:', `${ngrokUrl}/api/telegram-webhook`);

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: `${ngrokUrl}/api/telegram-webhook`
      })
    });

    const result = await response.json();
    
    if (result.ok) {
      console.log('✅ Webhook установлен успешно!');
    } else {
      console.error('❌ Ошибка установки webhook:', result);
    }

    // Проверяем статус webhook
    console.log('\n🔍 Проверяем статус webhook...');
    const infoResponse = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
    const infoResult = await infoResponse.json();
    
    console.log('Webhook Info:', infoResult);

  } catch (error) {
    console.error('❌ Ошибка:', error);
  }
}

setupWebhook(); 