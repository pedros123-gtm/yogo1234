'use client';

import { useState } from 'react';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "¿Qué necesito para contratar Yoigo TV?",
      answer: "Para contratar Yoigo TV necesitas tener una línea de fibra de Yoigo. El servicio incluye el decodificador 4K, instalación gratuita y acceso a más de 90 canales."
    },
    {
      question: "¿Puedo ver Yoigo TV en varios dispositivos?",
      answer: "Sí, con Yoigo TV puedes conectar hasta 5 dispositivos diferentes: Smart TV, móvil, tablet, ordenador, Chromecast y Fire TV Stick."
    },
    {
      question: "¿Qué canales incluye Yoigo TV?",
      answer: "Yoigo TV incluye más de 90 canales con contenido generalista, deportivo, infantil, documentales, música y noticias. También tienes acceso a 50.000 contenidos a la carta."
    },
    {
      question: "¿Puedo añadir Netflix, HBO Max o Amazon Prime?",
      answer: "Sí, puedes añadir Netflix, HBO Max, Amazon Prime Video y otros servicios premium a tu paquete de Yoigo TV con descuentos especiales."
    },
    {
      question: "¿Hay permanencia con Yoigo TV?",
      answer: "No, Yoigo TV no tiene permanencia. Puedes darte de baja cuando quieras sin penalizaciones."
    },
    {
      question: "¿Cómo funciona la grabación en la nube?",
      answer: "Con Yoigo TV puedes grabar tus programas favoritos en la nube y verlos cuando quieras desde cualquier dispositivo conectado."
    }
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="flex flex-col pt-14 pb-14 px-4 items-center w-full bg-gray-100">
      <div className="flex flex-col items-center max-w-6xl w-full bg-transparent p-0 rounded-none shadow-none bg-cover bg-center">
        
        {/* Title */}
        <div className="text-center mb-2">
          <h2 className="font-roboto-condensed text-2xl font-semibold leading-tight text-center mb-2 md:text-3xl md:leading-tight">
            PREGUNTAS FRECUENTES
          </h2>
          <h2 className="font-roboto-condensed text-2xl font-semibold leading-tight text-center block md:text-3xl md:leading-tight">
            SOBRE YOIGO TV
          </h2>
        </div>

        {/* FAQ Grid */}
        <div className="w-full max-w-full block">
          <div className="mt-2 mb-2 flex-1 flex flex-col">
            <div className="box-border flex flex-wrap w-full pt-3 pb-3 h-full justify-center items-stretch">
              
              {faqs.map((faq, index) => (
                <div key={index} className="box-border m-0 flex-basis-full flex-grow-0 max-w-full flex flex-col items-center">
                  <div className="flex flex-col w-full flex-1 rounded-none p-0">
                    
                    {/* FAQ Item */}
                    <div className="bg-white rounded shadow-md overflow-hidden shadow-none relative transition-all duration-150 overflow-visible rounded-none mb-4 rounded-sm shadow-md border-none relative">
                      
                      {/* Question Button */}
                      <button 
                        className="inline-flex items-center justify-center relative box-border bg-transparent outline-0 border-0 m-0 rounded-none p-0 cursor-pointer select-none align-middle appearance-none no-underline text-inherit flex min-h-12 px-2 transition-all duration-150 pl-4 pr-7"
                        onClick={() => toggleFAQ(index)}
                      >
                        <div className="flex flex-grow my-3">
                          <h3 className="font-roboto text-base font-bold leading-snug">
                            {faq.question}
                          </h3>
                        </div>
                        <div className="flex text-gray-600 transform rotate-0 transition-transform duration-150" style={{transform: openIndex === index ? 'rotate(180deg)' : 'rotate(0deg)'}}>
                          <svg className="w-6 h-6 block text-black" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"/>
                          </svg>
                        </div>
                      </button>

                      {/* Answer */}
                      <div className={`${openIndex === index ? 'h-auto overflow-visible transition-all duration-300 visible' : 'h-0 overflow-hidden transition-all duration-300 invisible'}`}>
                        <div className="flex w-full">
                          <div className="w-full">
                            <div className="py-1 px-2 pl-4 pr-4 pb-4">
                              <div className="mt-2 mb-2 block break-words whitespace-normal">
                                {faq.answer}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
