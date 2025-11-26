'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface FibraPlan {
  id: string;
  name: string;
  description: string;
  speed: string;
  mobile: string;
  price: number;
  originalPrice: number;
  promoMonths: number;
  badge: string;
  badgeColor: string;
  services: string[];
  features: string[];
  addLine: string;
  specialOffer?: string;
  bestSeller?: boolean;
}

interface CartContextType {
  cart: FibraPlan | null;
  addToCart: (plan: FibraPlan) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<FibraPlan | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const addToCart = (plan: FibraPlan) => {
    setCart(plan);
    // Сохраняем в localStorage для персистентности
    if (typeof window !== 'undefined') {
      localStorage.setItem('fibra-cart', JSON.stringify(plan));
    }
  };

  const clearCart = () => {
    setCart(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fibra-cart');
    }
  };

  // Восстанавливаем корзину из localStorage при загрузке
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('fibra-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setIsHydrated(true);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, addToCart, clearCart, isHydrated }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 