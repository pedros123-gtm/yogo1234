'use client';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image - full visibility */}
      <div className="absolute inset-0 z-0">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/Hero.jpg')"
          }}
        />
      </div>

      {/* Light overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/10 z-10" />

      {/* Content */}
      <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
        {/* Video player only */}
        <div className="flex justify-center">
          <div className="bg-black rounded-lg overflow-hidden shadow-2xl border-4 border-black" style={{ width: '480px', height: '270px' }}>
            <video
              className="w-full h-full object-cover"
              controls
              autoPlay
              muted
              loop
              preload="metadata"
              poster="/images/television-yoigo.webp"
            >
              <source 
                src="https://videos.ctfassets.net/ysrgozgyxrl6/1LNevWroGrfw7jvcfOUlYi/54bd2997da54dc8dfdfeedb8f782cc6c/bienvenida_yoigotv_web_v6__1080p_.mp4" 
                type="video/mp4" 
              />
              Tu navegador no soporta el elemento de video.
            </video>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent z-15" />
    </section>
  );
} 