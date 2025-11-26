'use client';

import React from 'react';
import Image from 'next/image';

interface TVPackage {
  title: string;
  price: string;
  description: string;
  features: string[];
  icon: string;
  buttonText: string;
}

const tvPackages: TVPackage[] = [
  {
    title: "Yoigo TV",
    price: "5€/mes",
    description: "Entretenimiento para toda la familia",
    features: [
      "Más de 100 canales",
      "Contenido en HD",
      "Grabación en la nube",
      "Múltiples dispositivos"
    ],
    icon: "/images/television-yoigo.webp",
    buttonText: "Contratar"
  },
  {
    title: "Yoigo TV + Deporte",
    price: "15€/mes",
    description: "Todo el deporte en directo",
    features: [
      "Todos los canales de Yoigo TV",
      "Canales deportivos premium",
      "LaLiga, Champions League",
      "Deportes internacionales"
    ],
    icon: "/images/yoigo_tv_deporte_1.svg",
    buttonText: "Contratar"
  },
  {
    title: "Yoigo TV + Netflix",
    price: "20€/mes",
    description: "Series y películas sin límites",
    features: [
      "Todos los canales de Yoigo TV",
      "Netflix incluido",
      "Contenido original",
      "4K Ultra HD"
    ],
    icon: "/images/Card-Netflix.png",
    buttonText: "Contratar"
  }
];

export default function TVPackagesSection() {
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
    <>
      {/* Title Section */}
      <section className="flex flex-col w-full h-auto items-center">
        <div className="w-full max-w-6xl mx-auto px-2 h-full">
          <div className="flex flex-col w-full h-full bg-cover bg-center">
            <div className="h-full grid pt-8 pb-3 grid-cols-1 md:pt-8 md:pb-3 lg:pt-14 lg:pb-3">
              <div className="h-full w-full">
                <div className="w-full h-full">
                  <div className="w-full h-full shadow-none rounded-none">
                    <h2 className="font-roboto-condensed font-semibold text-2xl leading-tight text-center mb-4 md:text-3xl md:leading-tight">
                      AÑADE EL CONTENIDO QUE MÁS TE GUSTE
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cards Section */}
      <section className="flex flex-col pt-0 pb-4 px-4 items-center w-full">
        <div className="flex flex-col items-center max-w-6xl w-full bg-transparent p-0 rounded-none shadow-none bg-cover bg-center">
          <div className="w-full max-w-full block">
            <div className="mt-2 mb-2 flex-1 flex flex-col">
              {/* 4 Cards in one row */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 w-full pt-3 pb-3 justify-items-center">
                
                {/* Netflix Card */}
                <div className="w-full max-w-[220px]">
                  <button onClick={scrollToConfigurator} className="no-underline w-full">
                    <div className="flex flex-col bg-white w-full h-full rounded">
                      <div className="bg-white rounded shadow-md overflow-hidden shadow-none hover:shadow-lg transition-shadow">
                        <Image
                          src="/images/Card-Netflix.png"
                          alt="Netflix Card"
                          width={220}
                          height={120}
                          className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                        />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Max Card */}
                <div className="w-full max-w-[220px]">
                  <button onClick={scrollToConfigurator} className="no-underline w-full">
                    <div className="flex flex-col bg-white w-full h-full rounded">
                      <div className="bg-white rounded shadow-md overflow-hidden shadow-none hover:shadow-lg transition-shadow">
                        <Image
                          src="/images/Card-Max__1_.png"
                          alt="Max Card"
                          width={220}
                          height={120}
                          className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                        />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Prime Card */}
                <div className="w-full max-w-[220px]">
                  <button onClick={scrollToConfigurator} className="no-underline w-full">
                    <div className="flex flex-col bg-white w-full h-full rounded">
                      <div className="bg-white rounded shadow-md overflow-hidden shadow-none hover:shadow-lg transition-shadow">
                        <Image
                          src="/images/yoigo_card_prime.png"
                          alt="Prime Card"
                          width={220}
                          height={120}
                          className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                        />
                      </div>
                    </div>
                  </button>
                </div>

                {/* HBO Max Card */}
                <div className="w-full max-w-[220px]">
                  <button onClick={scrollToConfigurator} className="no-underline w-full">
                    <div className="flex flex-col bg-white w-full h-full rounded">
                      <div className="bg-white rounded shadow-md overflow-hidden shadow-none hover:shadow-lg transition-shadow">
                        <Image
                          src="/images/yoigo_card_max.png"
                          alt="HBO Max Card"
                          width={220}
                          height={120}
                          className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                        />
                      </div>
                    </div>
                  </button>
                </div>

              </div>

              {/* Caja image spanning full width below the 4 cards */}
              <div className="w-full mt-4">
                <button onClick={scrollToConfigurator} className="w-full">
                  <Image
                    src="/images/Caja.webp"
                    alt="Caja"
                    width={1200}
                    height={300}
                    className="w-full h-auto object-cover rounded hover:opacity-90 transition-opacity"
                  />
                </button>
              </div>

            </div>
          </div>
        </div>
      </section>
    </>
  );
} 