'use client';

import React from 'react';

const BenefitsSection: React.FC = () => {
  const benefits = [
    {
      id: 'duo',
      title: 'Líneas DÚO',
      description: 'Comparte datos entre líneas familiares y ahorra en tu factura mensual. Perfecto para familias que quieren estar conectadas sin límites.',
      image: '/images/distri-duo-img-copy-3_2x.webp',
      link: 'Saber más'
    },
    {
      id: 'cobertura5g',
      title: 'Cobertura 5G',
      description: 'Disfruta de la máxima velocidad con nuestra red 5G de última generación. Navega, descarga y disfruta del contenido más rápido que nunca.',
      image: '/images/distri-5-g-img-copy_2x.webp',
      link: 'Descubre la cobertura 5G'
    },
    {
      id: 'ventajas',
      title: 'Ventajas Exclusivas',
      description: 'Accede a promociones y descuentos especiales solo para clientes Yoigo. Disfruta de beneficios únicos y ofertas personalizadas.',
      image: '/images/Imagen__18_.webp',
      link: 'Ver ventajas'
    }
  ];

  return (
    <section className="mb-12">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 text-gray-800 text-shadow">
        ADEMÁS, POR SER DE YOIGO...
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="tariff-card hover-scale overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img 
                src={benefit.image} 
                alt={benefit.title} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Hide image if it fails to load
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-3 text-gray-800">{benefit.title}</h3>
              <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                {benefit.description}
              </p>
              <button className="text-[#E52E8A] font-bold hover:text-[#C5197D] transition-colors flex items-center">
                {benefit.link}
                <i className="fas fa-arrow-right ml-2"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection; 