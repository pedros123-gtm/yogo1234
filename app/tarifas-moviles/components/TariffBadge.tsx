import React from 'react';

interface TariffBadgeProps {
  value: string; // например, '10', '25', '∞'
  color?: 'orange' | 'green' | 'purple';
}

const badgeColors = {
  orange: {
    gradient: 'url(#orangeGradient)',
    text: '#fff',
  },
  green: {
    gradient: 'url(#greenGradient)',
    text: '#fff',
  },
  purple: {
    gradient: 'url(#purpleGradient)',
    text: '#fff',
  },
};

export default function TariffBadge({ value, color = 'purple' }: TariffBadgeProps) {
  const colors = badgeColors[color];
  return (
    <svg width="85" height="30" viewBox="0 0 85 30" fill="none" xmlns="http://www.w3.org/2000/svg" style={{display: 'block'}}>
      <defs>
        <linearGradient id="orangeGradient" x1="0" y1="0" x2="85" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9800"/>
          <stop offset="1" stopColor="#F57C00"/>
        </linearGradient>
        <linearGradient id="greenGradient" x1="0" y1="0" x2="85" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4CAF50"/>
          <stop offset="1" stopColor="#45A049"/>
        </linearGradient>
        <linearGradient id="purpleGradient" x1="0" y1="0" x2="85" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E52E8A"/>
          <stop offset="1" stopColor="#C5197D"/>
        </linearGradient>
      </defs>
      <path fillRule="evenodd" clipRule="evenodd" d="M12.5 0.0775199C18 0.0757826 43.8933 -0.0957233 54 0.0770601C57.5315 0.13685 61.5 0.387459 65 0.387459C67 0.387459 70.3793 0.387459 71.8911 0.387459C74.1188 0.387459 76.5475 0.159366 78.3317 0.651024C79.5178 0.914588 80.5594 2.91455 80.5594 4.42738C80.5594 5.93258 80.5594 9.70648 80.5594 10.4596C80.5594 11.2128 83.4861 10.1698 84 11.2141C84.5139 12.2583 84.7426 14.2321 84.7426 17.2501C84.7426 18.7592 84 20.2682 82.5148 20.2682C82.3172 20.4831 78.3317 20.2682 77.5891 20.2682C77.4855 21.0666 77.9254 22.8958 78.4204 24.4048C79.163 26.6683 78.4204 28.4104 77.5888 28.6857C76.0888 29.1857 75.2891 29.0131 72.5 29.0762C70.2148 29.1284 69 29.0762 66 29.0762C59.4632 29.0762 29.8722 29.1804 20.6259 28.7554C15.8504 28.8707 11.0753 29.0543 6.29987 29.0753C4.78434 29.0823 3.25227 28.826 1.75703 28.3918C0.51751 28.0314 -0.157516 25.5208 0.0313789 23.3732C0.18663 21.6071 0.0313789 20.2669 0.742574 18.0034C1.48515 16.4943 4.45545 17.2489 5.19802 17.2489C4.45545 16.4943 3.65372 16.3741 2.9703 14.9853C2.22772 13.4763 1.6651 8.93446 2.22772 7.44024C2.49016 6.74355 4.45545 6.68573 6.68317 6.68573C5.94059 5.93122 5.19958 3.69725 5.19802 2.91319C5.19583 1.87952 5.19802 1.02692 5.94059 0.649665C7.42574 -0.104844 10.7772 0.0775199 12.5 0.0775199Z" fill={colors.gradient}/>
      <g style={{fontFamily: 'inherit'}}>
        <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" fontWeight="bold" fontSize="16" fill={colors.text}>
          {value}
          <tspan fontSize="9" dy="-6" dx="2" fontWeight="400">GB</tspan>
        </text>
      </g>
    </svg>
  );
} 