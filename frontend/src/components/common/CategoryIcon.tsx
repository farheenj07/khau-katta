import React from 'react';
import {
  Coffee,
  Utensils,
  Cake,
  Gem,
  Shirt,
  Gamepad2,
  Gift,
  Watch,
  Store,
  Sparkles
} from 'lucide-react';

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ name, className = '', size = 20 }) => {
  const normalized = name.toLowerCase();

  if (normalized.includes('coffee') || normalized.includes('beverage') || normalized.includes('drink')) {
    return <Coffee size={size} className={className} />;
  }
  if (normalized.includes('utensil') || normalized.includes('fast') || normalized.includes('snack')) {
    return <Utensils size={size} className={className} />;
  }
  if (normalized.includes('cake') || normalized.includes('dessert') || normalized.includes('sweet') || normalized.includes('kunda')) {
    return <Cake size={size} className={className} />;
  }
  if (normalized.includes('gem') || normalized.includes('jewel') || normalized.includes('silver')) {
    return <Gem size={size} className={className} />;
  }
  if (normalized.includes('shirt') || normalized.includes('cloth') || normalized.includes('handloom')) {
    return <Shirt size={size} className={className} />;
  }
  if (normalized.includes('game') || normalized.includes('toy') || normalized.includes('puzzle')) {
    return <Gamepad2 size={size} className={className} />;
  }
  if (normalized.includes('gift') || normalized.includes('brass')) {
    return <Gift size={size} className={className} />;
  }
  if (normalized.includes('watch') || normalized.includes('access') || normalized.includes('leather')) {
    return <Watch size={size} className={className} />;
  }
  if (normalized.includes('store') || normalized.includes('other') || normalized.includes('spice')) {
    return <Store size={size} className={className} />;
  }

  return <Sparkles size={size} className={className} />;
};
