import Link from 'next/link';
import Header from './tarifas-moviles/components/Header';
import Footer from './tarifas-moviles/components/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans min-h-screen">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-md mx-auto text-center">
            <div className="tariff-card p-8">
              <div className="text-6xl mb-6 text-gray-400">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                Página no encontrada
              </h1>
              
              <p className="text-gray-600 mb-6">
                Lo sentimos, la página que buscas no existe.
              </p>

              <Link 
                href="/tarifas-moviles"
                className="btn-yoigo inline-flex items-center gap-2"
              >
                <i className="fas fa-home"></i>
                Volver al inicio
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 