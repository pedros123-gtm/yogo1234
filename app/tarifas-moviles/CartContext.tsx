"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

export type CartTariff = {
  type: "ready" | "custom";
  name: string;
  price: string;
  after12?: string | null;
  description?: string;
  lines?: { label: string; count: number; price: string }[];
};

interface CartContextType {
  cart: CartTariff | null;
  setCart: (tariff: CartTariff | null) => void;
  clearCart: () => void;
  isHydrated: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartTariff | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // Восстанавливаем корзину из localStorage при загрузке
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCart = localStorage.getItem('yoigo-cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      setIsHydrated(true);
    }
  }, []);

  const setCartWithPersistence = (tariff: CartTariff | null) => {
    setCart(tariff);
    // Сохраняем в localStorage
    if (typeof window !== 'undefined') {
      if (tariff) {
        localStorage.setItem('yoigo-cart', JSON.stringify(tariff));
      } else {
        localStorage.removeItem('yoigo-cart');
      }
    }
  };

  const clearCart = () => {
    setCart(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('yoigo-cart');
    }
  };

  return (
    <CartContext.Provider value={{ cart, setCart: setCartWithPersistence, clearCart, isHydrated }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
} 