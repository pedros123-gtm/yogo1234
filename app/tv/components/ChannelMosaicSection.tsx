import React from 'react';
import Image from 'next/image';

export default function ChannelMosaicSection() {
  return (
    <section className="flex flex-col w-full h-auto items-center bg-cover bg-center" style={{backgroundImage: 'url(/images/image.svg)'}}>
      <div className="w-full max-w-5xl mx-auto px-2 h-full">
        <div className="h-full grid pt-6 pb-6 row-gap-6 grid-cols-1 md:pt-6 md:pb-6 md:row-gap-5 lg:pt-10 lg:pb-10 lg:row-gap-6">
          
          {/* Title */}
          <div className="w-full h-full">
            <div className="w-full h-full">
              <div className="w-full h-full shadow-none rounded-none">
                <h2 className="font-roboto-condensed text-2xl font-semibold leading-tight text-center mb-4 md:text-3xl md:leading-tight">
                  ACCESO MULTIDISPOSITIVO
                </h2>
              </div>
            </div>
          </div>

          {/* Three Mosaic Images */}
          <div className="h-full grid pb-6 pr-3 row-gap-6 column-gap-6 grid-cols-1 md:pb-5 md:pr-3 md:row-gap-5 md:column-gap-5 md:grid-cols-3 lg:pb-6 lg:pr-3 lg:row-gap-6 lg:column-gap-6 lg:grid-cols-3">
            
            {/* First Mosaic Image */}
            <div className="flex flex-col h-full w-full flex-1 justify-center items-center">
              <div className="flex flex-col w-full max-w-[370px] h-full items-center rounded">
                <div className="bg-white rounded shadow-md overflow-hidden shadow-none bg-transparent">
                  <div className="relative flex-shrink-0 justify-self-center max-w-[554px] max-h-[779px] md:max-w-[554px] md:max-h-[779px] lg:max-w-[656px] lg:max-h-[929px]">
                    <Image
                      src="/images/tv-mosaic-1__6_.png"
                      alt="TV Mosaic 1"
                      width={656}
                      height={929}
                      className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second Mosaic Image */}
            <div className="flex flex-col h-full w-full flex-1 justify-center items-center">
              <div className="flex flex-col w-full max-w-[370px] h-full items-center rounded">
                <div className="bg-white rounded shadow-md overflow-hidden shadow-none bg-transparent">
                  <div className="relative flex-shrink-0 justify-self-center max-w-[656px] max-h-[447px] md:max-w-[656px] md:max-h-[447px] lg:max-w-[1144px] lg:max-h-[779px]">
                    <Image
                      src="/images/tv-mosaic-2__9_.png"
                      alt="TV Mosaic 2"
                      width={1144}
                      height={779}
                      className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Third Mosaic Image */}
            <div className="flex flex-col h-full w-full flex-1 justify-center items-center">
              <div className="flex flex-col w-full max-w-[370px] h-full items-center rounded">
                <div className="bg-white rounded shadow-md overflow-hidden shadow-none bg-transparent">
                  <div className="relative flex-shrink-0 justify-self-center max-w-[1142px] max-h-[702px]">
                    <Image
                      src="/images/tv-mosaic-3__6_.png"
                      alt="TV Mosaic 3"
                      width={1142}
                      height={702}
                      className="block bg-cover bg-no-repeat bg-center w-full object-cover"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
} 