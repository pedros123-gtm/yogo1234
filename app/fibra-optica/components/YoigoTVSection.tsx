'use client';

import React from 'react';

const YoigoTVSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-custom p-6 md:p-8 mb-12 relative overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-800 text-shadow">
            YOIGO TV: ¡VIVA LA TELE DE LA GENTE!
          </h2>
          <p className="mb-6 text-gray-700 text-lg leading-relaxed">
            Accede a la TV con los mejores contenidos para toda la familia: cine, series, 
            documentales, etc. Y si quieres, también Netflix, Prime o Max.
          </p>
          <button className="bg-white text-gray-800 px-6 py-3 rounded-full font-bold hover:bg-gray-100 transition-colors shadow-lg">
            <i className="fas fa-tv mr-2"></i>
            VER DETALLES
          </button>
        </div>
        
        <div className="relative">
          <div className="absolute top-0 right-0 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg z-10">
            <div className="text-lg font-bold">6 €/mes</div>
            <div className="text-sm">Con Fibra + Móvil</div>
          </div>
          
          {/* TV Channels Grid */}
          <div className="grid grid-cols-3 gap-3 mt-8">
            <div className="bg-black rounded-lg p-4 text-white text-center font-bold hover:bg-gray-800 transition-colors cursor-pointer">
              TRACKER
            </div>
            <div className="bg-gray-800 rounded-lg p-4 flex items-center justify-center hover:bg-gray-700 transition-colors cursor-pointer">
              <i className="fas fa-play text-white text-2xl"></i>
            </div>
            <div className="bg-blue-600 rounded-lg p-4 text-white text-center font-bold hover:bg-blue-700 transition-colors cursor-pointer">
              MAX
            </div>
            <div className="bg-red-600 rounded-lg p-4 text-white text-center font-bold hover:bg-red-700 transition-colors cursor-pointer">
              CINE
            </div>
            <div className="bg-green-600 rounded-lg p-4 text-white text-center font-bold hover:bg-green-700 transition-colors cursor-pointer">
              SPORT
            </div>
            <div className="bg-purple-600 rounded-lg p-4 text-white text-center font-bold hover:bg-purple-700 transition-colors cursor-pointer">
              KIDS
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YoigoTVSection; 