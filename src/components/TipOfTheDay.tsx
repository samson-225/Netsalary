import React, { useState, useEffect } from 'react';
import { Lightbulb } from 'lucide-react';
import { motion } from 'motion/react';
import { useAppContext } from '../lib/i18n';

export const TipOfTheDay = () => {
  const { t } = useAppContext();
  const [tipKey, setTipKey] = useState<string>('');

  useEffect(() => {
    const keys = ['tip1', 'tip2', 'tip3', 'tip4', 'tip5'];
    const randomKey = keys[Math.floor(Math.random() * keys.length)];
    setTipKey(randomKey);
  }, []);

  if (!tipKey) return null;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/20 border border-amber-200/60 dark:border-amber-800/50 rounded-2xl p-5 sm:p-6 shadow-sm flex gap-4 mt-8 print:hidden"
    >
      <div className="flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-white dark:bg-amber-900/50 flex items-center justify-center text-amber-500 dark:text-amber-400 shadow-sm border border-amber-100 dark:border-amber-800">
          <Lightbulb className="w-6 h-6" />
        </div>
      </div>
      <div className="flex flex-col justify-center">
        <h4 className="text-xs font-bold text-amber-600 dark:text-amber-500 mb-1 uppercase tracking-wider flex items-center gap-2">
          {t('tipTitle')}
        </h4>
        <p className="text-amber-950 dark:text-amber-200 text-sm sm:text-base leading-relaxed font-medium">
          {/* @ts-ignore */}
          {t(tipKey)}
        </p>
      </div>
    </motion.div>
  );
};
