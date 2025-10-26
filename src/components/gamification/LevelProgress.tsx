import React from 'react';
import { motion } from 'framer-motion';
import { Star, Award, Crown, Sparkles } from 'lucide-react';

interface LevelProgressProps {
  level: number;
  currentXP: number;
  xpToNextLevel: number;
  totalXP: number;
  prestige?: number;
}

const LevelProgress: React.FC<LevelProgressProps> = ({
  level,
  currentXP,
  xpToNextLevel,
  totalXP,
  prestige = 0
}) => {
  // Calcola la percentuale di progresso
  const progress = (currentXP / xpToNextLevel) * 100;

  // Determina il titolo in base al livello
  const getLevelTitle = (level: number) => {
    if (level >= 100) return 'Leggenda di Nuvolino';
    if (level >= 75) return 'Maestro della Nuvola';
    if (level >= 50) return 'Esperto Nuvolino';
    if (level >= 25) return 'Amico di Nuvolino';
    if (level >= 10) return 'Nuvolino Apprendista';
    return 'Nuvolino Novizio';
  };

  // Determina il colore in base al livello
  const getLevelColor = (level: number) => {
    if (level >= 100) return 'from-purple-500 to-pink-500';
    if (level >= 75) return 'from-yellow-400 to-orange-500';
    if (level >= 50) return 'from-blue-400 to-cyan-500';
    if (level >= 25) return 'from-green-400 to-emerald-500';
    if (level >= 10) return 'from-sky-400 to-blue-500';
    return 'from-gray-400 to-gray-500';
  };

  // Determina l'icona in base al livello
  const getLevelIcon = (level: number) => {
    if (level >= 100) return <Crown className="w-6 h-6" />;
    if (level >= 75) return <Sparkles className="w-6 h-6" />;
    if (level >= 50) return <Award className="w-6 h-6" />;
    return <Star className="w-6 h-6" />;
  };

  const levelTitle = getLevelTitle(level);
  const levelColor = getLevelColor(level);
  const levelIcon = getLevelIcon(level);

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-lg border border-nuvolino-200">
      {/* Header con Livello e Titolo */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            className={`bg-gradient-to-br ${levelColor} p-3 rounded-xl text-white shadow-lg`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            {levelIcon}
          </motion.div>
          <div>
            <h3 className="text-2xl font-bold text-gray-800">
              Livello {level}
            </h3>
            <p className="text-sm text-gray-600">{levelTitle}</p>
          </div>
        </div>

        {/* Prestige Badge (se presente) */}
        {prestige > 0 && (
          <motion.div
            className="bg-gradient-to-br from-amber-400 to-orange-500 px-4 py-2 rounded-full text-white font-semibold shadow-lg"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 200 }}
          >
            ⭐ Prestigio {prestige}
          </motion.div>
        )}
      </div>

      {/* Barra di Progresso */}
      <div className="mb-3">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span className="font-medium">
            {currentXP.toLocaleString()} XP
          </span>
          <span className="font-medium">
            {xpToNextLevel.toLocaleString()} XP
          </span>
        </div>

        <div className="relative h-8 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          {/* Barra di progresso animata */}
          <motion.div
            className={`absolute inset-0 bg-gradient-to-r ${levelColor} rounded-full`}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          >
            {/* Effetto luccichio */}
            <motion.div
              className="absolute inset-0 bg-white/30"
              animate={{
                x: ['-100%', '200%'],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>

          {/* Percentuale al centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-sm font-bold text-white drop-shadow-lg">
              {Math.round(progress)}%
            </span>
          </div>
        </div>
      </div>

      {/* XP Rimanenti */}
      <div className="text-center">
        <p className="text-xs text-gray-500">
          {(xpToNextLevel - currentXP).toLocaleString()} XP al prossimo livello
        </p>
        <p className="text-xs text-gray-400 mt-1">
          XP Totale: {totalXP.toLocaleString()}
        </p>
      </div>

      {/* Milestone successiva */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Sparkles className="w-4 h-4 text-nuvolino-400" />
          <span>
            {level < 10 && "Prossima milestone: Livello 10"}
            {level >= 10 && level < 25 && "Prossima milestone: Livello 25"}
            {level >= 25 && level < 50 && "Prossima milestone: Livello 50"}
            {level >= 50 && level < 75 && "Prossima milestone: Livello 75"}
            {level >= 75 && level < 100 && "Prossima milestone: Livello 100"}
            {level >= 100 && "Hai raggiunto il livello massimo! 🎉"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LevelProgress;