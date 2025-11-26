import React, { useState } from 'react';
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import { applyGlobalDiscount } from '../../../utils/discount';

const TariffTable: React.FC = () => {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { addToCart } = useCart();
  const router = useRouter();

  const tariffs = [
    // 1Gb + GB infinitos тарифы
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '59,00',
      priceSubtext: '3 meses, luego 74,00',
      href: '/fibra-optica/fibra-1gbps-movil-infinito',
      category: 'infinito'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '59,00',
      priceSubtext: '3 meses, luego 79,00',
      href: '/fibra-optica/tarifa-fibra-1gb-netflix',
      category: 'infinito'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix', 'Prime', 'YoigoTV'],
      price: '63,00',
      priceSubtext: '3 meses, luego 83,00',
      href: '/fibra-optica/mejor-oferta-amazon-prime-netflix-tv',
      category: 'premium'
    },
    
    // 600Mb + GB infinitos тарифы
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '59,00',
      priceSubtext: '3 meses, luego 64,00',
      href: '/fibra-optica/fibra-600mb-netflix-gratis',
      category: 'infinito'
    },
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '59,00',
      priceSubtext: null,
      href: '/fibra-optica/mejor-oferta-fibra',
      category: 'infinito'
    },
    
    // 600Mb + 35 GB тарифы
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '35 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '47,00',
      priceSubtext: '3 meses, luego 52,00',
      href: '/fibra-optica/mejor-oferta-fibra-movil-netflix',
      category: 'limitado'
    },
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '35 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix', 'Prime'],
      price: '51,00',
      priceSubtext: '3 meses, luego 56,00',
      href: '/fibra-optica/oferta-fibra-movil-prime-netflix',
      category: 'limitado'
    },
    
    // 600Mb + 55 GB тарифы
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '55 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '51,00',
      priceSubtext: '3 meses, luego 56,00',
      href: '/fibra-optica/fibra-movil-600mb-netflix',
      category: 'limitado'
    },
    
    // 1Gb + 35 GB тарифы
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '35 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '47,00',
      priceSubtext: '3 meses, luego 67,00',
      href: '/fibra-optica/oferta-fibra-1gb-netflix',
      category: 'limitado'
    },
    
    // 1Gb + 55 GB тарифы
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '55 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '51,00',
      priceSubtext: '3 meses, luego 71,00',
      href: '/fibra-optica/fibra-1gb-mas-netflix',
      category: 'limitado'
    },
    
    // Дополнительные тарифы на основе оригинального HTML
    // 300Mb тарифы
    {
      fibra: '300Mb',
      fibraSubtext: '+ Fijo',
      movil: '25 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '39,00',
      priceSubtext: '3 meses, luego 44,00',
      href: '/fibra-optica/fibra-300mb-25gb',
      category: 'basico'
    },
    {
      fibra: '300Mb',
      fibraSubtext: '+ Fijo',
      movil: '25 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '43,00',
      priceSubtext: '3 meses, luego 48,00',
      href: '/fibra-optica/fibra-300mb-25gb-netflix',
      category: 'basico'
    },
    
    // 600Mb + 20 GB тарифы
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '20 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '42,00',
      priceSubtext: '3 meses, luego 47,00',
      href: '/fibra-optica/fibra-600mb-20gb',
      category: 'basico'
    },
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '20 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '46,00',
      priceSubtext: '3 meses, luego 51,00',
      href: '/fibra-optica/fibra-600mb-20gb-netflix',
      category: 'basico'
    },
    
    // 1Gb + 20 GB тарифы
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '20 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '44,00',
      priceSubtext: '3 meses, luego 59,00',
      href: '/fibra-optica/fibra-1gb-20gb',
      category: 'basico'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '20 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '48,00',
      priceSubtext: '3 meses, luego 63,00',
      href: '/fibra-optica/fibra-1gb-20gb-netflix',
      category: 'basico'
    },
    
    // 1Gb + 25 GB тарифы
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '25 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: null,
      price: '45,00',
      priceSubtext: '3 meses, luego 60,00',
      href: '/fibra-optica/fibra-1gb-25gb',
      category: 'basico'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '25 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix'],
      price: '49,00',
      priceSubtext: '3 meses, luego 64,00',
      href: '/fibra-optica/fibra-1gb-25gb-netflix',
      category: 'basico'
    },
    
    // Дополнительные комбинации с Disney+
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: '35 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix', 'Disney'],
      price: '49,00',
      priceSubtext: '3 meses, luego 54,00',
      href: '/fibra-optica/fibra-600mb-35gb-netflix-disney',
      category: 'limitado'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: '35 GB',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix', 'Disney'],
      price: '49,00',
      priceSubtext: '3 meses, luego 69,00',
      href: '/fibra-optica/fibra-1gb-35gb-netflix-disney',
      category: 'limitado'
    },
    
    // Максимальные тарифы с всеми сервисами
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: 'GB infinitos',
      movilSubtext: '+ llamadas infinitas',
      ocioTv: ['Netflix', 'Prime', 'Disney', 'YoigoTV'],
      price: '69,00',
      priceSubtext: '3 meses, luego 89,00',
      href: '/fibra-optica/fibra-1gb-infinito-todo-incluido',
      category: 'premium'
    },
    
    // Только фибра тарифы (без мобильного)
    {
      fibra: '300Mb',
      fibraSubtext: '+ Fijo',
      movil: 'Solo Fibra',
      movilSubtext: 'Sin móvil',
      ocioTv: null,
      price: '29,00',
      priceSubtext: '3 meses, luego 34,00',
      href: '/fibra-optica/solo-fibra-300mb',
      category: 'solo-fibra'
    },
    {
      fibra: '600Mb',
      fibraSubtext: '+ Fijo',
      movil: 'Solo Fibra',
      movilSubtext: 'Sin móvil',
      ocioTv: null,
      price: '34,00',
      priceSubtext: '3 meses, luego 39,00',
      href: '/fibra-optica/solo-fibra-600mb',
      category: 'solo-fibra'
    },
    {
      fibra: '1Gb',
      fibraSubtext: '+ Fijo',
      movil: 'Solo Fibra',
      movilSubtext: 'Sin móvil',
      ocioTv: null,
      price: '39,00',
      priceSubtext: '3 meses, luego 44,00',
      href: '/fibra-optica/solo-fibra-1gb',
      category: 'solo-fibra'
    }
  ];

  const filterOptions = [
    { value: 'all', label: 'Todas las tarifas', count: tariffs.length },
    { value: 'infinito', label: 'GB infinitos', count: tariffs.filter(t => t.category === 'infinito').length },
    { value: 'limitado', label: 'GB limitados', count: tariffs.filter(t => t.category === 'limitado').length },
    { value: 'basico', label: 'Tarifas básicas', count: tariffs.filter(t => t.category === 'basico').length },
    { value: 'premium', label: 'Premium (TV)', count: tariffs.filter(t => t.category === 'premium').length },
    { value: 'solo-fibra', label: 'Solo Fibra', count: tariffs.filter(t => t.category === 'solo-fibra').length },
  ];

  const filteredTariffs = selectedFilter === 'all' 
    ? tariffs 
    : tariffs.filter(tariff => tariff.category === selectedFilter);

  // Netflix SVG component
  const NetflixIcon = () => (
    <svg width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="Netflix_2015_N_logo">
        <path id="path6055" d="M0.427002 0.5L0.500368 21.5C2.05517 21.2048 3.27783 21.237 4.65777 21.1142V0.52411L0.427002 0.5Z" fill="url(#paint0_linear_717_17450)"></path>
        <path id="path678" d="M7.96 0.524414H12.1908L12.2397 21.4521L7.93555 20.7529L7.96 0.524414Z" fill="url(#paint1_linear_717_17450)"></path>
        <path id="path362" d="M0.476562 0.524414C0.574384 0.765516 7.81315 21.0663 7.81315 21.0663C9.00262 21.0579 10.5975 21.2494 12.1662 21.428L4.63396 0.524414H0.476562Z" fill="#E50914"></path>
      </g>
      <defs>
        <linearGradient id="paint0_linear_717_17450" x1="2.23519" y1="16.9427" x2="5.29794" y2="16.8926" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B1060F"></stop>
          <stop offset="0.546072" stopColor="#7B010C"></stop>
          <stop offset="1" stopColor="#E50914" stopOpacity="0.01"></stop>
        </linearGradient>
        <linearGradient id="paint1_linear_717_17450" x1="10.0028" y1="3.86824" x2="6.8683" y2="3.92343" gradientUnits="userSpaceOnUse">
          <stop stopColor="#B1060F"></stop>
          <stop offset="0.625007" stopColor="#7B010C"></stop>
          <stop offset="1" stopColor="#B1060F" stopOpacity="0.01"></stop>
        </linearGradient>
      </defs>
    </svg>
  );

  // Prime SVG component
  const PrimeIcon = () => (
    <svg width="51" height="32" viewBox="0 0 51 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M7.00417 11.9556C7.34376 11.4581 7.51355 10.6725 7.51355 9.59897C7.51355 8.51303 7.34688 7.72129 7.01355 7.22477C6.68021 6.72723 6.15001 6.47845 5.42084 6.47845C4.75521 6.47845 4.12813 6.65394 3.53959 7.008V12.1714C4.10209 12.5244 4.73022 12.7009 5.42084 12.7009C6.13751 12.7009 6.66563 12.4532 7.00417 11.9556ZM0.852091 18.5796C0.775007 18.5074 0.737507 18.3804 0.737507 18.1977V5.10348C0.737507 4.92077 0.775007 4.79381 0.852091 4.72155C0.929174 4.64929 1.05001 4.61316 1.21667 4.61316H2.59897C2.89376 4.61316 3.07292 4.75768 3.13647 5.04465L3.27084 5.55561C3.66981 5.1662 4.14285 4.85919 4.66251 4.65239C5.18839 4.43386 5.75268 4.32055 6.32292 4.31897C7.56459 4.31897 8.54688 4.78348 9.2698 5.71252C9.99271 6.64155 10.3542 7.89781 10.3542 9.48129C10.3542 10.5683 10.175 11.5169 9.81667 12.3283C9.45834 13.1396 8.97292 13.7641 8.35834 14.2028C7.74386 14.6415 7.00304 14.872 6.24584 14.8604C5.73568 14.8627 5.22905 14.7764 4.74897 14.6054C4.30269 14.4511 3.89166 14.2108 3.53959 13.8983V18.1977C3.53959 18.3804 3.50417 18.5074 3.43438 18.5796C3.36355 18.6519 3.23855 18.688 3.05938 18.688H1.21667C1.05001 18.688 0.929174 18.6519 0.852091 18.5796ZM12.349 14.527C12.2719 14.4475 12.2344 14.3236 12.2344 14.1533V5.10348C12.2344 4.92077 12.2719 4.79381 12.349 4.72155C12.426 4.64929 12.5469 4.61316 12.7135 4.61316H14.0958C14.3906 4.61316 14.5688 4.75768 14.6333 5.04465L14.8833 6.10477C15.3938 5.52877 15.8771 5.12 16.3313 4.87845C16.7865 4.63587 17.2688 4.5151 17.7813 4.5151H18.05C18.2292 4.5151 18.3573 4.55123 18.4344 4.62245C18.5115 4.69471 18.549 4.82271 18.549 5.00542V6.65497C18.549 6.82529 18.5135 6.94916 18.4438 7.02658C18.3729 7.10606 18.249 7.14529 18.0688 7.14529C17.9802 7.14529 17.8646 7.1391 17.724 7.12465C17.5452 7.11061 17.3658 7.10441 17.1865 7.10606C16.8917 7.10606 16.5344 7.14942 16.1115 7.23406C15.6896 7.31871 15.3302 7.4271 15.0365 7.55716V14.1533C15.0365 14.3236 15.001 14.4475 14.9313 14.527C14.8604 14.6054 14.7354 14.6446 14.5563 14.6446H12.7135C12.5469 14.6446 12.426 14.6054 12.349 14.527ZM20.0198 14.527C19.9427 14.4475 19.9052 14.3236 19.9052 14.1533V5.10348C19.9052 4.92077 19.9427 4.79381 20.0198 4.72155C20.0969 4.64929 20.2177 4.61316 20.3844 4.61316H22.2281C22.4052 4.61316 22.5302 4.64929 22.601 4.72155C22.6719 4.79381 22.7073 4.92077 22.7073 5.10348V14.1533C22.7073 14.3236 22.6719 14.4475 22.601 14.527C22.5313 14.6054 22.4063 14.6446 22.2271 14.6446H20.3833C20.2177 14.6446 20.0969 14.6054 20.0198 14.527ZM21.3063 3.06271C20.8188 3.06271 20.4292 2.92542 20.1354 2.64981C19.8406 2.37523 19.6938 2.00258 19.6938 1.53084C19.6938 1.06013 19.8396 0.686452 20.1354 0.411871C20.4292 0.13729 20.8188 0 21.3063 0C21.7917 0 22.1823 0.13729 22.4771 0.412903C22.7708 0.686452 22.9188 1.06013 22.9188 1.53084C22.9188 2.00258 22.7708 2.37523 22.4771 2.64981C22.1823 2.92542 21.7917 3.06271 21.3063 3.06271ZM25.199 14.527C25.1219 14.4475 25.0844 14.3236 25.0844 14.1533V5.10348C25.0844 4.92077 25.1219 4.79381 25.199 4.72155C25.276 4.64929 25.3969 4.61316 25.5635 4.61316H26.9458C27.2406 4.61316 27.4198 4.75768 27.4833 5.04465L27.6375 5.57523C28.3146 5.1169 28.926 4.79381 29.4708 4.60387C30.0101 4.41477 30.578 4.31841 31.15 4.31894C32.3021 4.31894 33.1146 4.73806 33.5875 5.57523C34.2406 5.13032 34.8552 4.80929 35.4313 4.61316C36.0057 4.41705 36.6091 4.31762 37.2167 4.31894C38.1125 4.31894 38.8063 4.57394 39.299 5.08387C39.7917 5.59484 40.0385 6.30813 40.0385 7.22374V14.1533C40.0385 14.3236 40.0021 14.4475 39.9323 14.527C39.8625 14.6054 39.7375 14.6446 39.5573 14.6446H37.7156C37.549 14.6446 37.4271 14.6054 37.351 14.527C37.274 14.4475 37.2354 14.3236 37.2354 14.1533V7.85239C37.2354 6.96258 36.8448 6.51768 36.0646 6.51768C35.3729 6.51768 34.675 6.68697 33.9708 7.02761V14.1533C33.9708 14.3236 33.9365 14.4475 33.8667 14.527C33.7958 14.6054 33.6708 14.6446 33.4917 14.6446H31.6479C31.4823 14.6446 31.3615 14.6054 31.2833 14.527C31.2073 14.4475 31.1688 14.3236 31.1688 14.1533V7.85239C31.1688 6.96258 30.7781 6.51768 29.9979 6.51768C29.2613 6.52269 28.5368 6.70438 27.8865 7.04723V14.1533C27.8865 14.3236 27.851 14.4475 27.7813 14.527C27.7104 14.6054 27.5854 14.6446 27.4063 14.6446H25.5635C25.3969 14.6446 25.276 14.6054 25.199 14.527ZM46.0656 8.77419C46.7177 8.77419 47.1917 8.672 47.4865 8.46968C47.7802 8.26632 47.9271 7.95561 47.9271 7.53755C47.9271 6.71174 47.4479 6.29987 46.4875 6.29987C45.2583 6.29987 44.549 7.07303 44.3573 8.61729C44.9199 8.72686 45.4923 8.77943 46.0656 8.77419ZM43.0427 13.6031C42.1906 12.7133 41.7656 11.4374 41.7656 9.77548C41.7656 8.07432 42.2 6.73858 43.0708 5.77032C43.9406 4.80206 45.15 4.31794 46.699 4.31794C47.8896 4.31794 48.8198 4.61213 49.4917 5.20052C50.1635 5.78994 50.5 6.57548 50.5 7.55613C50.5 8.53781 50.1385 9.28103 49.4156 9.78581C48.6917 10.2885 47.6271 10.5404 46.2188 10.5404C45.4896 10.5404 44.8563 10.4681 44.3188 10.3246C44.3948 11.2021 44.6542 11.8297 45.0958 12.2085C45.5375 12.5894 46.2063 12.7783 47.1021 12.7783C47.4604 12.7783 47.8094 12.7556 48.149 12.7092C48.4875 12.6637 48.9573 12.5626 49.5594 12.4057C49.6277 12.3832 49.6989 12.37 49.7708 12.3665C49.9875 12.3665 50.0969 12.5172 50.0969 12.8175V13.7208C50.0969 13.9303 50.0677 14.0769 50.0104 14.1626C49.9531 14.2472 49.8406 14.3226 49.674 14.3886C48.7265 14.7573 47.7168 14.9436 46.699 14.9378C45.1115 14.9368 43.8927 14.4929 43.0427 13.6031ZM26.026 28.3128C32.0927 28.3128 38.7615 27.0245 44.899 24.3634C45.824 23.9618 46.6 24.9868 45.6948 25.6712C40.2188 29.8034 32.2844 32 25.45 32C15.8729 32 7.24792 28.3799 0.720841 22.3535C0.209382 21.8797 0.665632 21.2335 1.2823 21.6C8.32396 25.7899 17.0323 28.3128 26.026 28.3128ZM47.2146 29.7249C46.7625 30.111 46.3323 29.9045 46.5333 29.3946C47.1937 27.7068 48.6729 23.9288 47.9719 23.0111C47.2719 22.0955 43.3448 22.5775 41.5792 22.7943C41.0448 22.8594 40.9615 22.3814 41.4438 22.0356C44.5771 19.7853 49.7115 20.4356 50.3083 21.1881C50.9094 21.9479 50.15 27.2124 47.2146 29.7249Z" fill="#1A98FF"></path>
    </svg>
  );

  // Fiber icon SVG
  const FiberIcon = () => (
    <svg width="24" height="18" viewBox="0 0 24 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M23.8392 4.63281C20.6039 1.64502 16.3993 0 11.9999 0C7.60045 0 3.39586 1.64502 0.16051 4.63281C-0.0421267 4.81982 -0.054822 5.13574 0.131701 5.33838L11.6317 17.8384C11.7264 17.9414 11.8602 18 11.9999 18C12.1395 18 12.2733 17.9414 12.368 17.8384L23.868 5.33838C24.0546 5.13574 24.0419 4.81982 23.8392 4.63281ZM11.9998 7.99995C9.79088 7.99995 7.67479 8.78956 5.97893 10.2171L3.96733 8.03047C6.21434 6.07966 9.04491 4.99995 11.9998 4.99995C14.9542 4.99995 17.7846 6.0796 20.0325 8.03029L18.0207 10.2171C16.3248 8.78962 14.2087 7.99995 11.9998 7.99995ZM17.3439 10.9528L15.2952 13.1797C14.3431 12.4291 13.1972 12 11.9998 12C10.802 12 9.65618 12.4291 8.70433 13.1796L6.65569 10.9528C8.16582 9.69513 10.0425 9 11.9998 9C13.9571 9 15.8338 9.69513 17.3439 10.9528ZM11.9998 16.7617L9.38308 13.9174C10.9188 12.7708 13.08 12.7701 14.6165 13.9174L11.9998 16.7617ZM20.7092 7.29485C18.2761 5.17412 15.2063 4.00005 11.9999 4.00005C8.79307 4.00005 5.7233 5.17418 3.29026 7.29461L1.21079 5.03423C4.20737 2.42925 8.0189 1.00005 11.9999 1.00005C15.9808 1.00005 19.7923 2.42925 22.7889 5.03423L20.7092 7.29485Z" fill="#2E2E2E"></path>
    </svg>
  );

  // Mobile icon SVG
  const MobileIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g id="ic_mobile">
        <g id="Vector">
          <path d="M11.5 1.99995H12.5C12.7764 1.99995 13 2.22358 13 2.49995C13 2.74561 12.8233 2.9496 12.59 2.9919L12.5 2.99995H11.5C11.2237 2.99995 11 2.77632 11 2.49995C11 2.25429 11.1767 2.0503 11.4101 2.008L11.5 1.99995Z" fill="#2E2E2E"></path>
          <path d="M17.5 1.99995C17.7762 1.99995 18 2.22381 18 2.49995C18 2.77609 17.7762 2.99995 17.5 2.99995C17.2239 2.99995 17 2.77609 17 2.49995C17 2.22381 17.2239 1.99995 17.5 1.99995Z" fill="#2E2E2E"></path>
          <path d="M11.6988 8.0833V9.03293H9.17448V10.282C9.4911 10.0574 9.8244 9.91583 10.2659 9.91583C11.5491 9.91583 11.9906 10.7153 11.9906 11.9481C11.9906 13.3392 11.4156 14.1806 9.97457 14.1806C8.47494 14.1806 8.00002 13.281 8.00002 12.3729H9.09961C9.07479 12.9311 9.41622 13.2305 9.95789 13.2305C10.6741 13.2305 10.891 12.7643 10.891 11.9233C10.891 11.1816 10.6407 10.7654 10.0161 10.7654C9.64127 10.7654 9.34135 10.9484 9.13298 11.232H8.22508V8.0833H11.6988Z" fill="#2E2E2E"></path>
          <path d="M16.1701 10.0408C16.1286 8.67453 15.4953 7.99995 14.3205 7.99995C13.2042 7.99995 12.4212 8.53294 12.4212 10.0156V12.1646C12.4212 13.6473 13.2042 14.1802 14.3205 14.1802C14.7539 14.1802 15.0872 13.9471 15.3952 13.5972L15.5702 14.0968H16.1701V11.0152H14.2122V11.9649H15.0204V12.3315C15.0204 12.8478 14.7539 13.1639 14.3205 13.1639C13.8622 13.1639 13.5709 12.9808 13.5709 12.3144V9.86542C13.5709 9.19939 13.8622 9.01631 14.3205 9.01631C14.7372 9.01631 15.0204 9.26612 15.0204 10.0408H16.1701Z" fill="#2E2E2E"></path>
          <path d="M13.5 21H10.5C10.2236 21 10 21.2236 10 21.5C10 21.7764 10.2236 22 10.5 22H13.5C13.7764 22 14 21.7764 14 21.5C14 21.2236 13.7764 21 13.5 21Z" fill="#2E2E2E"></path>
          <path fillRule="evenodd" clipRule="evenodd" d="M18 0H6C4.89697 0 4 0.896973 4 2V22C4 23.103 4.89697 24 6 24H18C19.103 24 20 23.103 20 22V2C20 0.896973 19.103 0 18 0ZM6.00002 1.00005H18C18.5513 1.00005 19 1.44878 19 2.00005V19H5.00002V2.00005C5.00002 1.44878 5.44876 1.00005 6.00002 1.00005ZM19 20V22C19 22.5512 18.5513 23 18 23H6.00002C5.44876 23 5.00002 22.5512 5.00002 22V20H19Z" fill="#2E2E2E"></path>
        </g>
      </g>
    </svg>
  );

  // TV icon SVG
  const TVIcon = () => (
    <svg width="24" height="20" viewBox="0 0 24 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path fillRule="evenodd" clipRule="evenodd" d="M22 4.50012H22.2857C23.2325 4.50012 24 5.24364 24 6.16082V18.3393C24 19.2565 23.2325 20 22.2857 20H17.7143C16.8674 20 16.164 19.4051 16.025 18.6232C14.8288 18.3438 12.9588 17.9999 11 17.9999C7.71045 17.9999 4.68408 18.9657 4.65381 18.9754C4.60254 18.992 4.55078 18.9999 4.5 18.9999C4.28906 18.9999 4.09277 18.8651 4.02441 18.6537C3.93945 18.391 4.0835 18.1092 4.34619 18.0243C4.4693 17.9844 7.26245 17.0953 10.5 17.0085V15.9999H2C0.896973 15.9999 0 15.1029 0 13.9999V1.99998C0 0.896966 0.896973 0 2 0H20C21.103 0 22 0.896966 22 1.99998V4.50012ZM16 15.9999H11.5V17.0085C13.2454 17.0552 14.8617 17.3352 16 17.5896V15.9999ZM16 14.9999V6.16083C16 5.24365 16.7675 4.50013 17.7143 4.50013H21V1.99999C21 1.44873 20.5513 1 20 1H2.00001C1.44874 1 1.00001 1.44873 1.00001 1.99999V13.9999C1.00001 14.5512 1.44874 14.9999 2.00001 14.9999H16ZM17.6 5.5C17.2686 5.5 17 5.75184 17 6.0625V18.4374C17 18.7481 17.2686 18.9999 17.6 18.9999H22.4C22.7314 18.9999 23 18.7481 23 18.4374V6.0625C23 5.75184 22.7314 5.5 22.4 5.5H17.6ZM20 10.5C18.8954 10.5 18 9.6046 18 8.50003C18 7.39547 18.8954 6.50005 20 6.50005C21.1046 6.50005 22 7.39547 22 8.50003C22 9.6046 21.1046 10.5 20 10.5ZM20 9.50008C20.5523 9.50008 21 9.05237 21 8.50009C21 7.94781 20.5523 7.5001 20 7.5001C19.4477 7.5001 19 7.94781 19 8.50009C19 9.05237 19.4477 9.50008 20 9.50008ZM19 12.5C18.7238 12.5 18.5 12.2761 18.5 12C18.5 11.7239 18.7238 11.5 19 11.5C19.2761 11.5 19.5 11.7239 19.5 12C19.5 12.2761 19.2761 12.5 19 12.5ZM21 12.5C20.7239 12.5 20.5 12.2761 20.5 12C20.5 11.7239 20.7239 11.5 21 11.5C21.2762 11.5 21.5 11.7239 21.5 12C21.5 12.2761 21.2762 12.5 21 12.5Z" fill="#2E2E2E"></path>
    </svg>
  );

  const renderOcioTv = (ocioTv: string[] | null) => {
    if (!ocioTv) {
      return <span className="text-gray-400 font-bold">-</span>;
    }
    
    const services = [];
    
    if (ocioTv.includes('Netflix')) {
      services.push(
        <div key="netflix" className="flex items-center space-x-1">
          <NetflixIcon />
          <span className="font-medium text-sm">Netflix</span>
        </div>
      );
    }
    
    if (ocioTv.includes('Prime')) {
      services.push(
        <div key="prime" className="flex items-center">
          <PrimeIcon />
        </div>
      );
    }
    
    if (ocioTv.includes('YoigoTV')) {
      services.push(
        <span key="yoigo-tv" className="text-sm text-gray-600">y Yoigo TV</span>
      );
    }
    
    return (
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-2">
          {services.slice(0, 2)}
        </div>
        {services.length > 2 && (
          <div>{services[2]}</div>
        )}
      </div>
    );
  };

  const handleBuyTariff = (tariff: any) => {
    // Применяем глобальную скидку к цене
    const originalPrice = parseFloat(tariff.price.replace(',', '.'));
    const priceData = applyGlobalDiscount(originalPrice);
    
    // Создаем объект плана для корзины
    const fibraPlan = {
      id: tariff.href.replace('/fibra-optica/', ''),
      name: `${tariff.fibra} + ${tariff.movil}`,
      description: tariff.ocioTv ? `Incluye: ${tariff.ocioTv.join(', ')}` : 'Sin servicios adicionales',
      speed: tariff.fibra,
      mobile: tariff.movil,
      price: priceData.discountedPrice,
      originalPrice: priceData.hasDiscount ? originalPrice : (tariff.priceSubtext && tariff.priceSubtext.includes('luego') 
        ? parseFloat(tariff.priceSubtext.match(/luego (\d+,\d+)/)?.[1]?.replace(',', '.') || tariff.price.replace(',', '.'))
        : parseFloat(tariff.price.replace(',', '.'))),
      promoMonths: tariff.priceSubtext && tariff.priceSubtext.includes('3 meses') ? 3 : 0,
      badge: tariff.category === 'infinito' ? '∞' : tariff.movil.includes('GB') ? tariff.movil.replace(' GB', '') : '',
      badgeColor: tariff.category === 'infinito' ? 'green' : tariff.category === 'premium' ? 'purple' : 'orange',
      services: tariff.ocioTv || [],
      features: [
        `Fibra ${tariff.fibra}`,
        tariff.movil !== 'Solo Fibra' ? `Móvil ${tariff.movil}` : 'Sin móvil',
        tariff.fibraSubtext,
        tariff.movilSubtext !== 'Sin móvil' ? tariff.movilSubtext : ''
      ].filter(Boolean),
      addLine: tariff.category === 'solo-fibra' ? 'Añadir línea móvil desde 15€/mes' : 'Añadir línea adicional desde 10€/mes',
      specialOffer: tariff.priceSubtext || undefined,
      bestSeller: tariff.category === 'infinito' && tariff.ocioTv?.includes('Netflix')
    };

    addToCart(fibraPlan);
    router.push('/cart');
  };

  const renderPrice = (price: string) => {
    const originalPrice = parseFloat(price.replace(',', '.'));
    const priceData = applyGlobalDiscount(originalPrice);
    
    return (
      <div>
        <div className="font-bold text-lg text-gray-800">{priceData.formattedDiscounted}</div>
        {priceData.hasDiscount && (
          <div className="text-sm text-gray-400 line-through">{priceData.formattedOriginal}</div>
        )}
      </div>
    );
  };

  return (
    <section className="bg-white rounded-lg shadow-lg overflow-hidden mb-12">
      {/* Filter Dropdown */}
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Comparar tarifas</h2>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <span>{filterOptions.find(option => option.value === selectedFilter)?.label}</span>
              <svg className={`w-5 h-5 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setSelectedFilter(option.value);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 flex items-center justify-between ${
                      selectedFilter === option.value ? 'bg-pink-50 text-pink-600 font-medium' : 'text-gray-700'
                    }`}
                  >
                    <span>{option.label}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      selectedFilter === option.value ? 'bg-pink-100 text-pink-600' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {option.count}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Mostrando {filteredTariffs.length} de {tariffs.length} tarifas
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b">
              <th className="text-left p-4 font-bold text-gray-800 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <FiberIcon />
                  <span className="text-lg">FIBRA</span>
                </div>
              </th>
              <th className="text-left p-4 font-bold text-gray-800 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <MobileIcon />
                  <span className="text-lg">MÓVIL</span>
                </div>
              </th>
              <th className="text-left p-4 font-bold text-gray-800 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <span className="text-lg"></span>
                </div>
              </th>
              <th className="text-left p-4 font-bold text-gray-800 border-r border-gray-200">
                <div className="flex items-center space-x-2">
                  <TVIcon />
                  <span className="text-lg">OCIO Y TV</span>
                </div>
              </th>
              <th className="text-left p-4 font-bold text-gray-800 border-r border-gray-200">
                <span className="text-lg">€/mes</span>
              </th>
              <th className="text-center p-4 font-bold text-gray-800">
                <span className="text-lg"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTariffs.map((tariff, index) => (
              <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="p-4 border-r border-gray-100">
                  <div className="font-bold text-gray-800">{tariff.fibra}</div>
                  <div className="text-sm text-gray-600">{tariff.fibraSubtext}</div>
                </td>
                <td className="p-4 border-r border-gray-100">
                  <div className="font-bold text-gray-800">{tariff.movil}</div>
                  <div className="text-sm text-gray-600">{tariff.movilSubtext}</div>
                </td>
                <td className="p-4 border-r border-gray-100">
                  {/* Empty column */}
                </td>
                <td className="p-4 border-r border-gray-100">
                  {renderOcioTv(tariff.ocioTv)}
                </td>
                <td className="p-4 border-r border-gray-100">
                  {renderPrice(tariff.price)}
                  {tariff.priceSubtext && (
                    <div className="text-sm text-gray-500">{tariff.priceSubtext}</div>
                  )}
                </td>
                <td className="p-2 md:p-4 text-center">
                  <button 
                    className="btn-green text-xs md:text-sm w-full"
                    onClick={() => handleBuyTariff(tariff)}
                  >
                    VER TARIFA
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default TariffTable; 