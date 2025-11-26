'use client';

import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8 md:py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          <div>
            <Image 
              src="/images/Frame_10.svg" 
              alt="Yoigo" 
              width={100}
              height={30}
              className="h-6 md:h-8 w-auto mb-4"
            />
            <p className="text-gray-400 text-sm md:text-base">Tu operadora de confianza</p>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm md:text-base">Servicios</h4>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Móvil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fibra</a></li>
              <li><a href="#" className="hover:text-white transition-colors">TV</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm md:text-base">Ayuda</h4>
            <ul className="space-y-2 text-gray-400 text-sm md:text-base">
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cobertura</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4 text-sm md:text-base">Síguenos</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><i className="fab fa-facebook"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-xl"><i className="fab fa-instagram"></i></a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
} 