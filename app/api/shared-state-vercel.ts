// Состояние для Vercel - используем простое решение
// В продакшене лучше использовать Redis, но для демо можем использовать файловую систему

import { writeFile, readFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

const TEMP_DIR = '/tmp/payment-statuses';
const isVercel = process.env.VERCEL === '1';

// Создаем директорию если её нет
async function ensureTempDir() {
  if (!existsSync(TEMP_DIR)) {
    await mkdir(TEMP_DIR, { recursive: true });
  }
}

export async function setPaymentStatus(sessionId: string, status: string) {
  console.log(`Setting payment status: ${sessionId} -> ${status}`);
  
  if (isVercel) {
    // На Vercel используем файловую систему /tmp
    try {
      await ensureTempDir();
      const filePath = path.join(TEMP_DIR, `${sessionId}.json`);
      await writeFile(filePath, JSON.stringify({ status, timestamp: Date.now() }));
    } catch (error) {
      console.error('Error writing status to file:', error);
    }
  } else {
    // Локально используем глобальную переменную
    if (!global.paymentStatuses) {
      global.paymentStatuses = new Map<string, string>();
    }
    global.paymentStatuses.set(sessionId, status);
  }
  
  console.log(`Status set for ${sessionId}: ${status}`);
}

export async function getPaymentStatus(sessionId: string): Promise<string> {
  console.log(`Getting payment status for ${sessionId}`);
  
  if (isVercel) {
    // На Vercel читаем из файловой системы
    try {
      await ensureTempDir();
      const filePath = path.join(TEMP_DIR, `${sessionId}.json`);
      if (existsSync(filePath)) {
        const data = await readFile(filePath, 'utf8');
        const parsed = JSON.parse(data);
        // Файлы старше 1 часа считаем устаревшими
        if (Date.now() - parsed.timestamp < 3600000) {
          console.log(`Status found for ${sessionId}: ${parsed.status}`);
          return parsed.status;
        }
      }
    } catch (error) {
      console.error('Error reading status from file:', error);
    }
    
    console.log(`No status found for ${sessionId}, returning processing`);
    return 'processing';
  } else {
    // Локально используем глобальную переменную
    if (!global.paymentStatuses) {
      global.paymentStatuses = new Map<string, string>();
    }
    const status = global.paymentStatuses.get(sessionId) || 'processing';
    console.log(`Status found for ${sessionId}: ${status}`);
    return status;
  }
} 