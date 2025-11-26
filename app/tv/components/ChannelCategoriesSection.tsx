import React from 'react';
import Image from 'next/image';

export default function ChannelCategoriesSection() {
  return (
    <section className="flex flex-col pt-14 pb-14 px-4 items-center w-full bg-white">
      <div className="flex flex-col items-center max-w-6xl w-full bg-transparent p-0 rounded-none shadow-none bg-cover bg-center">
        
        {/* Title */}
        <div className="text-center mb-12">
          <h2 className="font-roboto-condensed text-2xl font-semibold leading-tight text-center mb-4 md:text-3xl md:leading-tight">
            MÁS DE 90 CANALES PARA TODA LA FAMILIA
          </h2>
        </div>

        {/* Categories Content */}
        <div className="w-full max-w-full">
          <div className="space-y-12">
            
            {/* Deportes y Gaming */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="deportes-y-gaming">Deportes y Gaming</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/yoigo_deportes_1.svg" alt="yoigo nueva tv Deportes 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/yoigo_deportes_2_1_.svg" alt="yoigo nueva tv Deportes 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/DeportesyGaming_3.svg" alt="yoigo nueva tv Deportes 3" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/DeportesyGaming_4.svg" alt="yoigo nueva tv Deportes 4" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/DeportesyGaming_5.svg" alt="yoigo nueva tv Deportes 5" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Infantil y Anime */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="infantil-y-anime">Infantil y Anime</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/infantil_1.svg" alt="yoigo nueva tv Infantil 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/infantil_2.svg" alt="yoigo nueva tv Infantil 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/infantil_3.svg" alt="yoigo nueva tv Infantil 3" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Documentales */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="documentales">Documentales</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/Frame_40498__1_.svg" alt="Documentales 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/Frame_40499__1_.svg" alt="Documentales 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/Frame_40500__1_.svg" alt="Documentales 3" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/Frame_40501__1_.svg" alt="Documentales 4" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Estilo de vida */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="estilo-de-vida">Estilo de vida</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/estilo_vida_1.svg" alt="Estilo de vida 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/estilo_vida_2.svg" alt="Estilo de vida 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/estilo_vida_3.svg" alt="Estilo de vida 3" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Música */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="musica">Música</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/Frame_40498__1_.svg" alt="Musica 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/musica_2.svg" alt="Musica 2" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Generalistas */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="generalistas">Generalistas</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/generalista_1.svg" alt="Generalistas 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/generalista_2.svg" alt="Generalistas 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/generalista_3.svg" alt="Generalistas 3" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

            {/* Noticias e internacional */}
            <div>
              <h3 className="text-2xl font-bold mb-6 text-center" id="noticias-e-internacional">Noticias e internacional</h3>
              <div className="flex flex-wrap justify-center gap-6 mb-4">
                <Image src="/images/noticias_1.svg" alt="Noticias e internacional 1" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/noticias_2.svg" alt="Noticias e internacional 2" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/noticias_3.svg" alt="Noticias e internacional 3" width={120} height={60} className="h-12 w-auto md:h-16" />
                <Image src="/images/noticias_4.svg" alt="Noticias e internacional 4" width={120} height={60} className="h-12 w-auto md:h-16" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
