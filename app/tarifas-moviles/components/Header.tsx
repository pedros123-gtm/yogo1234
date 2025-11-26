'use client';

import React from 'react';
import Image from 'next/image';

export default function Header() {
  return (
    <>
      {/* Top Header */}
      <header className="yoigo-gradient text-white py-2">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <div className="hidden md:flex space-x-4">
            <span>Particulares</span>
            <span>Autónomos y empresas</span>
          </div>
          <div className="flex items-center space-x-2 md:space-x-4 text-xs md:text-sm">
            <span className="hidden sm:inline"><i className="fas fa-phone"></i> Llámanos al 900 622 220</span>
            <span className="hidden sm:inline"><i className="fas fa-phone"></i> Te llamamos</span>
            <span>ES</span>
            <span>EU</span>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <Image 
                src="/images/Frame_10.svg" 
                alt="Yoigo" 
                width={120}
                height={40}
                className="h-8 md:h-10 w-auto"
              />
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden lg:flex space-x-8">
              <a href="/fibra-optica" className="nav-link text-gray-700">Fibra y móvil</a>
              <a href="/tarifas-moviles" className="nav-link text-gray-700">Tarifas móvil</a>
              <a href="#" className="nav-link text-gray-700">Móviles y más</a>
              <a href="#" className="nav-link text-gray-700">Fibra y fijo</a>
              <a href="/tv" className="nav-link text-gray-700">Yoigo TV</a>
              <a href="#" className="nav-link text-gray-700">Nuevos servicios</a>
            </div>
            
            {/* Mobile Menu Button */}
            <div className="lg:hidden">
              <button className="text-gray-700 hover:text-pink-600">
                <i className="fas fa-bars text-xl"></i>
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="btn-ayuda">
                <i className="fas fa-question-circle"></i>
                <span>Ayuda</span>
              </button>
              <button className="btn-yoigo">
                <i className="fas fa-user"></i>
                <span>Soy cliente</span>
              </button>
            </div>
          </div>
        </div>
        
        {/* Sub Navigation */}
        <div className="bg-gray-100 py-2">
          <div className="container mx-auto px-4">
            <div className="flex space-x-4 md:space-x-6 text-sm overflow-x-auto">
              <a href="/tarifas-moviles" className="nav-link text-gray-700 whitespace-nowrap">Tarifas móvil</a>
              <a href="/fibra-optica" className="nav-link text-gray-700 whitespace-nowrap">Fibra y móvil</a>
              <a href="#" className="nav-link text-gray-700 whitespace-nowrap">Tarifas prepago</a>
              <a href="#" className="nav-link text-gray-700 whitespace-nowrap">Recargas</a>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
} 