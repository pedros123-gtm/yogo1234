import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';
import HeroSection from './components/HeroSection';
import TariffInfoSection from './components/TariffInfoSection';
import TVPackagesSection from './components/TVPackagesSection';
import ChannelMosaicSection from './components/ChannelMosaicSection';
import AppDownloadSection from './components/AppDownloadSection';
import MobileTariffConfiguratorSection from './components/MobileTariffConfiguratorSection';
import ChannelCategoriesSection from './components/ChannelCategoriesSection';
import AppSection from './components/AppSection';
import FAQSection from './components/FAQSection';
export const dynamic = 'force-dynamic';

export default function TVPage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="pt-0">
        <div className="bg-white">
          {/* Hero Section */}
          <HeroSection />
          <TariffInfoSection />
          
          {/* TV Packages/Cards Section */}
          <TVPackagesSection />
          
          {/* Multi-device Access Section */}
          <ChannelMosaicSection />
          
          {/* App Download Section */}
          <AppDownloadSection />
          
          {/* Mobile Tariff Configurator Section */}
          <MobileTariffConfiguratorSection />
          
          {/* Channel Categories Section */}
          <ChannelCategoriesSection />
          
          {/* App Section */}
          <AppSection />
          
          {/* FAQ Section */}
          <FAQSection />
        </div>
      </div>
      <Footer />
    </main>
  );
} 