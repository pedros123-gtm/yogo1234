'use client';

import Image from 'next/image';

export default function TariffInfoSection() {
  const scrollToConfigurator = () => {
    const configuratorSection = document.querySelector('[data-section="configurator"]');
    if (configuratorSection) {
      configuratorSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="bg-white py-16 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Main Title - exactly as in original */}
        <div className="text-center mb-12">
          <h1 className="font-roboto-condensed text-3xl md:text-4xl font-semibold text-gray-800 leading-tight">
            LA TELEVISION DE YOIGO <br/>
            POR SOLO <span className="text-[#00A9CE]">6€/MES</span>.
          </h1>
        </div>

        {/* Channel Logos Row - 2 large logos */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
            <Image src="/images/Frame_40498.svg" alt="Eurosport" width={180} height={90} className="h-18 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <Image src="/images/Frame_40500.svg" alt="Warner TV" width={180} height={90} className="h-18 w-auto opacity-80 hover:opacity-100 transition-opacity" />
            <span className="text-[#00A9CE] font-medium text-sm ml-2">Ver +</span>
          </div>
        </div>

        {/* Features Grid - exactly as in original */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Feature 1 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-gray-800 text-base">
                <span className="font-bold">Más de 90 canales</span> para todos los gustos y 50 mil contenidos a la carta.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-gray-800 text-base">
                <span className="font-bold">Multidispositivo</span> con hasta 5 dispositivos conectados.
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <svg className="w-8 h-8 text-green-500 mt-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-gray-800 text-base">
                <span className="font-bold">Decodificador 4K</span> de alta definición y mando con control por voz
              </p>
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button 
            onClick={scrollToConfigurator}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded text-sm transition-colors duration-300 shadow-md hover:shadow-lg"
          >
            CONFIGURA TU TARIFA
          </button>
        </div>
      </div>
    </section>
  );
} 