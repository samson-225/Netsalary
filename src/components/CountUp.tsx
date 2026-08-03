import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'motion/react';

interface CountUpProps {
  value: number;
  currency?: boolean;
  decimals?: number;
  className?: string;
}

export const CountUp: React.FC<CountUpProps> = ({ value, currency = true, decimals = 2, className }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const spring = useSpring(0, {
    bounce: 0,
    duration: 1500,
  });

  const display = useTransform(spring, (current) => {
    return new Intl.NumberFormat('pt-BR', {
      style: currency ? 'currency' : 'decimal',
      currency: currency ? 'EUR' : undefined,
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(current);
  });

  useEffect(() => {
    spring.set(value);
  }, [spring, value]);

  if (!isClient) {
    return <span className={className}>{new Intl.NumberFormat('pt-BR', { style: currency ? 'currency' : 'decimal', currency: 'EUR', minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(value)}</span>;
  }

  return <motion.span className={className}>{display}</motion.span>;
};
