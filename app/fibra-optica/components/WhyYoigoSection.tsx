'use client';

import React from 'react';

const WhyYoigoSection: React.FC = () => {
  const reasons = [
    {
      id: 'recommend',
      icon: 'fas fa-smile',
      title: 'Nuestros clientes nos recomiendan',
      description: 'Los clientes Yoigo recomiendan la compañía más que los clientes de otros operadores.',
      link: null
    },
    {
      id: '5g',
      icon: 'fas fa-signal',
      title: 'Velocidad 5G en tu móvil',
      description: 'Con nuestra red 5G podrás navegar a máxima velocidad con tu móvil.',
      link: null
    },
    {
      id: 'fiber',
      icon: 'fas fa-home',
      title: 'Una fibra de escándalo',
      description: 'Nuestra fibra siempre rápida llega cada vez más lejos. Comprueba si llega a tu casa.',
      link: 'Buscar dirección'
    },
    {
      id: 'installation',
      icon: 'fas fa-bolt',
      title: 'Instalación en tiempo récord',
      description: '¡Somos más rápidos que MacGyver! Te instalamos la fibra en casa en 24/48 horas.',
      link: null
    },
    {
      id: 'free',
      icon: 'fas fa-gift',
      title: 'Router e Instalación GRATIS',
      description: 'Venirte a Yoigo no te va a costar ni un euro. Los envíos, la instalación, el router... Yoigo',
      link: null
    },
    {
      id: 'discount',
      icon: 'fas fa-percentage',
      title: 'Líneas adicionales con descuento',
      description: 'Queremos que ahorres al máximo, por eso todas las líneas adicionales que te lleves tienen descuento.',
      link: null
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 text-shadow">
        ¿POR QUÉ CONTRATAR FIBRA Y MÓVIL CON YOIGO?
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reasons.map((reason) => (
          <div key={reason.id} className="text-center group">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-pink-100 rounded-full mx-auto mb-4 flex items-center justify-center group-hover:from-pink-200 group-hover:to-blue-200 transition-all duration-300">
              <i className={`${reason.icon} text-[#E52E8A] text-3xl group-hover:scale-110 transition-transform duration-300`}></i>
            </div>
            <h3 className="text-xl font-bold mb-3 text-gray-800">{reason.title}</h3>
            <p className="text-gray-600 mb-3 leading-relaxed">{reason.description}</p>
            {reason.link && (
              <button className="text-[#E52E8A] font-bold hover:text-[#C5197D] transition-colors flex items-center justify-center mx-auto">
                {reason.link}
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default WhyYoigoSection; 