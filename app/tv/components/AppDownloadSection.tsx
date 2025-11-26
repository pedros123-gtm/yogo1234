import React from 'react';
import Image from 'next/image';

export default function AppDownloadSection() {
  return (
    <section className="flex flex-col w-full h-auto items-center bg-gray-50 py-12">
      <div className="w-full max-w-6xl mx-auto px-4 h-full">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          
          {/* Left Content */}
          <div className="order-2 md:order-1">
            <h2 className="font-roboto-condensed text-3xl font-semibold leading-tight mb-6 text-black">
              Descargar APP
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-6">
              Con la APP de Yoigo TV podrás conectar hasta 5 dispositivos para acceder a todo el contenido y funcionalidades de Yoigo TV. No necesitarás un segundo descodificador, podrás ver la televisión fácilmente con tu Smart TV, Google Chromecast, Amazon Fire TV Stick, o desde tu ordenador, móvil o Tablet.
            </p>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#" className="inline-block">
                <Image
                  src="/images/download-on-the-app-store-badge-es-rgb-blk-100217-copy-8.svg"
                  alt="Descargar en App Store"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
              <a href="#" className="inline-block">
                <Image
                  src="/images/GooglePlay.svg"
                  alt="Descargar en Google Play"
                  width={150}
                  height={50}
                  className="h-12 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Right Content - Multidispositivo Image */}
          <div className="order-1 md:order-2 flex justify-center">
            <Image
              src="/images/yoigo_multidispositivo.webp"
              alt="Yoigo Multidispositivo"
              width={500}
              height={400}
              className="w-full max-w-[500px] h-auto object-cover rounded-lg"
            />
          </div>

        </div>
      </div>
    </section>
  );
} 