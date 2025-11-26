"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type TVPlan = {
  type: "tv-mobile";
  name: string;
  price: string;
  after12?: string | null;
  description?: string;
  mobileData: string;
  additionalLines?: { name: string; count: number; price: number }[];
  tvServices: string[];
  totalPrice: number;
};

interface TVCartContextType {
  cart: TVPlan | null;
  setCart: (plan: TVPlan | null) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const TVCartContext = createContext<TVCartContextType | undefined>(undefined);

export function TVCartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<TVPlan | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Восстанавливаем корзину из localStorage при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('tv-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setIsHydrated(true);
    }
  }, []);

  const setCartWithPersistence = (plan: TVPlan | null) => {
    setCart(plan);
    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      if (plan) {
        localStorage.setItem('tv-cart', JSON.stringify(plan));
      } else {
        localStorage.removeItem('tv-cart');
      }
    }
  };

  const clearCart = () => {
    setCart(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tv-cart');
    }
  };

  return (
    <TVCartContext.Provider value={{ cart, setCart: setCartWithPersistence, clearCart, isHydrated }}>
      {children}
    </TVCartContext.Provider>
  );
}

export const useTVCart = () => {
  const context = useContext(TVCartContext);
  if (context === undefined) {
    throw new Error('useTVCart must be used within a TVCartProvider');
  }
  return context;
}; 