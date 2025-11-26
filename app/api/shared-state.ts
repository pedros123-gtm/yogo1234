// Общее хранилище статусов платежей между всеми API
// В продакшене это должна быть база данных

// Используем глобальную переменную для сохранения состояния между API вызовами
declare global {
  var paymentStatuses: Map<string, string> | undefined;
}

// Инициализируем Map только один раз
if (!global.paymentStatuses) {
  global.paymentStatuses = new Map<string, string>();
}

const paymentStatuses = global.paymentStatuses;

// Утилитарные функции для работы со статусами
export function setPaymentStatus(sessionId: string, status: string) {
  console.log(`Setting payment status: ${sessionId} -> ${status}`);
  paymentStatuses.set(sessionId, status);
  console.log('All payment statuses:', Object.fromEntries(paymentStatuses));
}

export function getPaymentStatus(sessionId: string): string {
  const status = paymentStatuses.get(sessionId) || 'processing';
  console.log(`Getting payment status for ${sessionId}: ${status}`);
  return status;
}

export { paymentStatuses }; 