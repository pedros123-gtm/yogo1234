import React from 'react';
import Image from 'next/image';

export default function AppSection() {
  return (
    <section className="flex flex-col pt-14 pb-14 px-4 items-center w-full bg-gray-100">
      <div className="flex flex-col items-center max-w-6xl w-full bg-transparent p-0 rounded-none shadow-none bg-cover bg-center">
        
        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="font-roboto-condensed text-2xl font-semibold leading-tight text-center mb-4 md:text-3xl md:leading-tight">
            LLEVA YOIGO TV CONTIGO
          </h2>
        </div>

        {/* Content Grid */}
        <div className="w-full max-w-full block">
          <div className="h-full grid row-gap-4 column-gap-10 grid-cols-1 md:row-gap-4 md:column-gap-10 md:grid-cols-[minmax(auto,35%)_minmax(auto,65%)] lg:row-gap-6 lg:column-gap-16 lg:grid-cols-[minmax(auto,30%)_minmax(auto,70%)]">
            
            {/* Left Side - Content */}
            <div className="flex flex-col items-start w-unset max-w-[370px] h-full px-0 pr-0 pb-0 lg:px-6 lg:pr-6 lg:pb-0">
              <div className="flex flex-col w-full h-full justify-center">
                <div className="grid gap-5">
                  <h3 className="font-roboto-condensed text-2xl font-semibold leading-tight text-left md:text-3xl md:leading-tight">
                    Lleva Yoigo TV contigo
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">
                    Con la APP de Yoigo TV podrás conectar hasta 5 dispositivos para acceder a todo el contenido y funcionalidades de Yoigo TV.
                  </p>
                  
                  {/* Features */}
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#ae3f97] rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Hasta 5 dispositivos conectados</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-[#ae3f97] rounded-full flex items-center justify-center mr-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <span className="text-gray-700">Compatible con Smart TV, Chromecast, Fire TV</span>
                    </div>
                  </div>
                  
                  {/* Download Buttons */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="#" className="inline-block">
                      <Image
                        src="/images/download-on-the-app-store-badge-es-rgb-blk-100217-copy-8.svg"
                        alt="Descargar en App Store"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                    <a href="#" className="inline-block">
                      <Image
                        src="/images/GooglePlay.svg"
                        alt="Disponible en Google Play"
                        width={140}
                        height={40}
                        className="h-10 w-auto"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Right Side - TV Apps Image */}
            <div className="relative flex-shrink-0 justify-self-center max-w-[656px] max-h-[447px] md:max-w-[656px] md:max-h-[447px] lg:max-w-[1144px] lg:max-h-[779px]">
              <Image
                src="/images/tv-apps.svg"
                alt="Yoigo TV Apps"
                width={1144}
                height={779}
                className="block bg-cover bg-no-repeat bg-center w-full object-cover"
              />
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
