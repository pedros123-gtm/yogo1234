import React from 'react';
import './globals.css';
import dynamic from 'next/dynamic';

import { CartProvider as TarifasCartProvider } from './tarifas-moviles/CartContext';
import { CartProvider as FibraCartProvider } from './fibra-optica/CartContext';
import { TVCartProvider } from './tv/CartContext';

// динамический импорт клиентского обёртчика (ssr: false!)
const SupportClient = dynamic(() => import('./SupportWidget/SupportClient'), { ssr: false });

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <title>Tarifas móvil de contrato ¡Sin permanencia! | Tarifas Yoigo</title>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet" />
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" />
      </head>
      <body>
        <TarifasCartProvider>
          <FibraCartProvider>
            <TVCartProvider>
              {children}
            </TVCartProvider>
          </FibraCartProvider>
        </TarifasCartProvider>

        {/* виджет поддержки — рендерится только на клиенте и будет на всех страницах */}
        <SupportClient />
      </body>
    </html>
  );
}
