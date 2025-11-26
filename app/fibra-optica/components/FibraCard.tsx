'use client';

import React, { ReactElement } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../CartContext';
import { useCart as useTarifasCart } from '../../tarifas-moviles/CartContext';
import { useTVCart } from '../../tv/CartContext';
import { applyGlobalDiscount, DiscountBadge } from '../../../utils/discount';

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

interface FibraCardProps {
  plan: FibraPlan;
}

const FibraCard: React.FC<FibraCardProps> = ({ plan }) => {
  const router = useRouter();
  const { addToCart } = useCart();
  const tarifasCart = useTarifasCart();
  const tvCart = useTVCart();

  const priceData = applyGlobalDiscount(plan.price);

  const handleSelectPlan = () => {
    if (tarifasCart.cart) {
      tarifasCart.clearCart();
    }
    if (tvCart.cart) {
      tvCart.clearCart();
    }
    
    const planWithDiscount = {
      ...plan,
      price: priceData.discountedPrice,
      originalPrice: priceData.hasDiscount ? plan.price : plan.originalPrice
    };
    
    addToCart(planWithDiscount);
    router.push('/cart');
  };

  const renderServiceLogos = () => {
    const logos: React.ReactElement[] = [];
    
    plan.services.forEach((service, index) => {
      switch (service) {
        case 'Netflix':
          logos.push(
            <div key={`netflix-${index}`} className="flex items-center justify-center">
              <img 
                src="/images/netflix-svgrepo-com.svg" 
                alt="Netflix" 
                className="h-8 w-auto"
              />
            </div>
          );
          break;
        case 'Disney+':
          logos.push(
            <div key={`disney-${index}`} className="flex items-center justify-center">
              <img 
                src="/images/brand-disney-svgrepo-com.svg" 
                alt="Disney+" 
                className="h-8 w-auto"
              />
            </div>
          );
          break;
        case 'Prime':
          logos.push(
            <div key={`prime-${index}`} className="flex items-center justify-center">
              <img 
                src="/images/prime-svgrepo-com.svg" 
                alt="Prime" 
                className="h-8 w-auto"
              />
            </div>
          );
          break;
        case 'Yoigo TV + Deporte':
          logos.push(
            <div key={`yoigo-${index}`} className="bg-gray-100 px-3 py-2 rounded text-sm font-bold text-gray-700 text-center">
              📺 Yoigo TV + Deporte
            </div>
          );
          break;
      }
    });
    
    return logos;
  };

  return (
    <div className={`bg-white rounded-lg shadow-md border-2 p-6 relative hover:shadow-lg transition-all duration-300 h-full flex flex-col ${plan.bestSeller ? 'border-blue-400' : 'border-gray-200'}`}>
      {/* Global Discount Badge */}
      <DiscountBadge discount={priceData.discountPercent} />
      
      {/* Best Seller Badge */}
      {plan.bestSeller && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg z-10 whitespace-nowrap">
          🥇 LA MÁS VENDIDA
        </div>
      )}
      
      {/* Discount Badge */}
      <div className="absolute top-4 right-4 z-10">
        <svg width="85" height="30" viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
          <defs>
            <linearGradient id={`gradient-${plan.id}`} x1="0" y1="0" x2="85" y2="0" gradientUnits="userSpaceOnUse">
              {plan.badgeColor === 'green-badge' ? (
                <>
                  <stop stopColor="#4CAF50"/>
                  <stop offset="1" stopColor="#45A049"/>
                </>
              ) : (
                <>
                  <stop stopColor="#2196F3"/>
                  <stop offset="1" stopColor="#1976D2"/>
                </>
              )}
            </linearGradient>
          </defs>
          <path fillRule="evenodd" clipRule="evenodd" d="M12.5 0.0775199C18 0.0757826 43.8933 -0.0957233 54 0.0770601C57.5315 0.13685 61.5 0.387459 65 0.387459C67 0.387459 70.3793 0.387459 71.8911 0.387459C74.1188 0.387459 76.5475 0.159366 78.3317 0.651024C79.5178 0.914588 80.5594 2.91455 80.5594 4.42738C80.5594 5.93258 80.5594 9.70648 80.5594 10.4596C80.5594 11.2128 83.4861 10.1698 84 11.2141C84.5139 12.2583 84.7426 14.2321 84.7426 17.2501C84.7426 18.7592 84 20.2682 82.5148 20.2682C82.3172 20.4831 78.3317 20.2682 77.5891 20.2682C77.4855 21.0666 77.9254 22.8958 78.4204 24.4048C79.163 26.6683 78.4204 28.4104 77.5888 28.6857C76.0888 29.1857 75.2891 29.0131 72.5 29.0762C70.2148 29.1284 69 29.0762 66 29.0762C59.4632 29.0762 29.8722 29.1804 20.6259 28.7554C15.8504 28.8707 11.0753 29.0543 6.29987 29.0753C4.78434 29.0823 3.25227 28.826 1.75703 28.3918C0.51751 28.0314 -0.157516 25.5208 0.0313789 23.3732C0.18663 21.6071 0.0313789 20.2669 0.742574 18.0034C1.48515 16.4943 4.45545 17.2489 5.19802 17.2489C4.45545 16.4943 3.65372 16.3741 2.9703 14.9853C2.22772 13.4763 1.6651 8.93446 2.22772 7.44024C2.49016 6.74355 4.45545 6.68573 6.68317 6.68573C5.94059 5.93122 5.19958 3.69725 5.19802 2.91319C5.19583 1.87952 5.19802 1.02692 5.94059 0.649665C7.42574 -0.104844 10.7772 0.0775199 12.5 0.0775199Z" fill={`url(#gradient-${plan.id})`}/>
          <g style={{fontFamily: 'inherit'}}>
            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fontSize="16" fill="#fff">
              {plan.badge.replace(' GB', '')}
              <tspan fontSize="9" dy="-6" dx="2" fontWeight="400">GB</tspan>
            </text>
          </g>
        </svg>
      </div>

      {/* Price Section */}
      <div className="text-center mb-4 pt-2">
        <div className="flex items-baseline justify-center mb-1">
          <span className="text-5xl font-bold text-gray-800">{priceData.formattedDiscounted.split(',')[0]}</span>
          <span className="text-lg text-gray-800">,{priceData.formattedDiscounted.split(',')[1]}</span>
        </div>
        <div className="text-gray-600 font-medium">€/mes</div>
        <div className="text-sm text-gray-500">IVA incl.</div>
        {priceData.hasDiscount && (
          <div className="mt-2 p-2 bg-gray-100 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Precio original:</div>
            <div className="text-lg font-bold text-gray-400 line-through">
              {priceData.formattedOriginal}€/mes
            </div>
            <div className="text-xs text-green-600 font-bold mt-1">
              ¡Ahorras {priceData.savings.toFixed(2).replace('.', ',')}€/mes!
            </div>
          </div>
        )}
        <div className="text-xs text-gray-500 mt-2">
          {plan.promoMonths} meses, luego {priceData.hasDiscount ? priceData.formattedOriginal : plan.originalPrice},00€/mes
        </div>
      </div>

      {/* Action Button */}
      <div className="mb-4">
        <button
          onClick={handleSelectPlan}
          className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold transition-colors text-sm"
          style={{ backgroundColor: '#7CB342' }}
        >
          VER TARIFA
        </button>
      </div>

      {/* Features */}
      <div className="space-y-2 text-sm mb-4 flex-grow">
        <div className="flex items-center">
          <i className="fas fa-wifi text-gray-500 mr-3 w-4 text-sm"></i>
          <span>Fibra <strong>{plan.speed}</strong> + fijo</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-mobile-alt text-gray-500 mr-3 w-4 text-sm"></i>
          <span>Móvil con <strong>{plan.mobile}</strong></span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-phone text-gray-500 mr-3 w-4 text-sm"></i>
          <span>y llamadas <strong>infinitas</strong></span>
        </div>
      </div>

      {/* Special Offer */}
      {plan.specialOffer && (
        <div className="text-center text-sm bg-blue-600 text-white p-2 rounded-lg mb-4 font-bold">
          + {plan.specialOffer}
        </div>
      )}

      {/* Services */}
      <div className="flex justify-center items-center space-x-3 min-h-[48px] mb-4 flex-wrap gap-2">
        {renderServiceLogos()}
      </div>

      {/* Additional Line */}
      <div className="text-center text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors font-medium mt-auto">
        {plan.addLine}
      </div>
    </div>
  );
};

export default FibraCard; 