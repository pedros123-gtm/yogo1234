'use client';

import React from 'react';

interface Feature {
  icon: string;
  title: string;
  description: string;
  fallbackIcon: string;
}

interface FeaturesSectionProps {
  title: string;
  features: Feature[];
}

export default function FeaturesSection({ title, features }: FeaturesSectionProps) {
  return (
    <div>
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">{title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
        {features.map((feature, index) => (
          <div key={index} className="text-center">
            <img 
              src={feature.icon} 
              alt={feature.title} 
              className="feature-icon"
              onError={(e) => {
                e.currentTarget.src = feature.fallbackIcon;
              }}
            />
            <h3 className="text-lg md:text-xl font-bold mb-3">{feature.title}</h3>
            <p className="text-gray-600 text-sm md:text-base">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 