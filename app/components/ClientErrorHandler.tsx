'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

interface ClientErrorHandlerProps {
  onError: (error: string) => void;
}

export default function ClientErrorHandler({ onError }: ClientErrorHandlerProps) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    
    if (errorParam === 'rejected') {
      onError('Los datos introducidos son incorrectos. Por favor, verifícalos y vuelve a intentarlo.');
    } else if (errorParam === 'timeout') {
      onError('El tiempo para completar el pago ha expirado. Por favor, inténtalo de nuevo.');
    }
  }, [searchParams, onError]);

  return null; // Этот компонент не рендерит ничего
} 