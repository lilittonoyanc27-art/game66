import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShoppingBasket, 
  RotateCcw, 
  Star, 
  Trophy, 
  ArrowRight,
  Heart,
  Zap,
  BookOpen
} from 'lucide-react';

// --- Types ---
interface Word {
  text: string;
  gender: 'el' | 'la';
  translation: string;
}

// --- Data ---
const WORDS: Word[] = [
  { text: "Libro", gender: "el", translation: "Գիրք" },
  { text: "Mesa", gender: "la", translation: "Սեղան" },
  { text: "Perro", gender: "el", translation: "Շուն" },
  { text: "Gato", gender: "el", translation: "Կատու" },
  { text: "Casa", gender: "la", translation: "Տուն" },
  { text: "Problema", gender: "el", translation: "Խնդիր" },
  { text: "Mano", gender: "la", translation: "Ձեռք" },
  { text: "Día", gender: "el", translation: "Օր" },
  { text: "Flor", gender: "la", translation: "Ծաղիկ" },
  { text: "Mapa", gender: "el", translation: "Քարտեզ" },
  { text: "Sistema", gender: "el", translation: "Համակարգ" },
  { text: "Idioma", gender: "el", translation: "Լեզու" },
  { text: "Sofá", gender: "el", translation: "Բազմոց" },
  { text: "Radio", gender: "la", translation: "Ռադիո" },
  { text: "Planeta", gender: "el", translation: "Մոլորակ" },
  { text: "Foto", gender: "la", translation: "Լուսանկար" },
  { text: "Coche", gender: "el", translation: "Մեքենա" },
  { text: "Noche", gender: "la", translation: "Գիշեր" },
  { text: "Sol", gender: "el", translation: "Արև" },
  { text: "Luna", gender: "la", translation: "Լուսին" },
];

export default function SpanishGenderBasketGame() {
  const [view, setView] = useState<'menu' | 'game' | 'result'>('menu');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [basketPos, setBasketPos] = useState<'el' | 'la' | null>(null);
  const [fallingWord, setFallingWord] = useState<Word | null>(null);
  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  useEffect(() => {
    if (view === 'game' && currentIndex < WORDS.length) {
      setFallingWord(WORDS[currentIndex]);
    }
  }, [view, currentIndex]);

  const handleChoice = (choice: 'el' | 'la') => {
    if (feedback) return;
    
    setBasketPos(choice);
    const isCorrect = choice === fallingWord?.gender;

    if (isCorrect) {
      setScore(s => s + 1);
      setFeedback('correct');
    } else {
      setLives(l => l - 1);
      setFeedback('wrong');
    }

    setTimeout(() => {
      setFeedback(null);
      setBasketPos(null);
      if (currentIndex < WORDS.length - 1 && lives > (isCorrect ? 0 : 1)) {
        setCurrentIndex(prev => prev + 1);
      } else {
        setView('result');
      }
    }, 1000);
  };

  const reset = () => {
    setView('menu');
    setCurrentIndex(0);
    setScore(0);
    setLives(3);
    setFeedback(null);
    setBasketPos(null);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-white font-sans overflow-hidden flex flex-col items-center justify-center p-4">
      
      <AnimatePresence mode="wait">
        {view === 'menu' && (
          <motion.div 
            key="menu"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="max-w-xl w-full text-center space-y-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotateY: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(234,179,8,0.3)]"
              >
                <ShoppingBasket className="w-16 h-16 text-white" />
              </motion.div>
              <motion.div 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute -top-4 -right-4 bg-pink-500 p-3 rounded-full shadow-lg"
              >
                <Zap className="w-6 h-6" />
              </motion.div>
            </div>

            <div className="space-y-4">
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none italic">
                GENDER <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">BASKET</span>
              </h1>
              <p className="text-slate-400 font-bold text-lg italic">
                Հավաքիր բառերը ճիշտ զամբյուղի մեջ: 20 բառ՝ արական և իգական:
              </p>
            </div>

            <button 
              onClick={() => setView('game')}
              className="group relative px-12 py-6 bg-white text-slate-900 rounded-full font-black text-2xl uppercase tracking-widest hover:scale-105 transition-all active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] flex items-center justify-center gap-4 mx-auto"
            >
              Սկսել Խաղը
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        )}

        {view === 'game' && (
          <motion.div 
            key="game"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-4xl h-[80vh] relative flex flex-col items-center"
          >
            {/* HUD */}
            <div className="w-full flex justify-between items-center px-8 py-4 bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 mb-8">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                  <span className="text-2xl font-black">{score}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <Heart 
                      key={i} 
                      className={`w-6 h-6 ${i < lives ? 'text-pink-500 fill-pink-500' : 'text-white/10'}`} 
                    />
                  ))}
                </div>
              </div>
              <div className="text-slate-400 font-black tracking-widest uppercase text-sm">
                Word {currentIndex + 1} / {WORDS.length}
              </div>
            </div>

            {/* Game Area */}
            <div className="flex-1 w-full relative perspective-1000">
              {/* Falling Word */}
              <AnimatePresence mode="wait">
                {fallingWord && !feedback && (
                  <motion.div
                    key={fallingWord.text}
                    initial={{ y: -100, opacity: 0, scale: 0.5 }}
                    animate={{ y: 150, opacity: 1, scale: 1 }}
                    exit={{ 
                      y: basketPos ? 400 : 150, 
                      opacity: 0, 
                      scale: basketPos ? 0.2 : 1,
                      x: basketPos === 'el' ? -200 : basketPos === 'la' ? 200 : 0
                    }}
                    transition={{ duration: 0.8, type: "spring" }}
                    className="absolute left-1/2 -translate-x-1/2 z-20"
                  >
                    <div className="bg-white text-slate-900 px-12 py-6 rounded-[2rem] shadow-[0_20px_60px_rgba(255,255,255,0.2)] border-b-8 border-slate-200 text-center">
                      <h2 className="text-5xl font-black italic tracking-tighter">{fallingWord.text}</h2>
                      <p className="text-slate-400 font-bold uppercase text-xs tracking-widest mt-2">{fallingWord.translation}</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Baskets (3D-ish) */}
              <div className="absolute bottom-0 w-full flex justify-around items-end pb-12">
                {/* EL Basket */}
                <motion.button
                  onClick={() => handleChoice('el')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: basketPos === 'el' ? -20 : 0,
                    borderColor: feedback === 'correct' && basketPos === 'el' ? '#10b981' : feedback === 'wrong' && basketPos === 'el' ? '#f43f5e' : 'rgba(255,255,255,0.1)'
                  }}
                  className="relative group w-48 h-48 bg-blue-600/20 rounded-[3rem] border-4 flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ShoppingBasket className="w-16 h-16 text-blue-400 relative z-10" />
                  <span className="text-3xl font-black text-blue-400 relative z-10">EL</span>
                </motion.button>

                {/* LA Basket */}
                <motion.button
                  onClick={() => handleChoice('la')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{ 
                    y: basketPos === 'la' ? -20 : 0,
                    borderColor: feedback === 'correct' && basketPos === 'la' ? '#10b981' : feedback === 'wrong' && basketPos === 'la' ? '#f43f5e' : 'rgba(255,255,255,0.1)'
                  }}
                  className="relative group w-48 h-48 bg-pink-600/20 rounded-[3rem] border-4 flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-pink-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <ShoppingBasket className="w-16 h-16 text-pink-400 relative z-10" />
                  <span className="text-3xl font-black text-pink-400 relative z-10">LA</span>
                </motion.button>
              </div>

              {/* Feedback Overlay */}
              <AnimatePresence>
                {feedback && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.5 }}
                    className={`absolute inset-0 flex items-center justify-center z-50 pointer-events-none`}
                  >
                    <div className={`px-12 py-6 rounded-full font-black text-4xl uppercase tracking-widest shadow-2xl ${
                      feedback === 'correct' ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'
                    }`}>
                      {feedback === 'correct' ? 'Ճիշտ է!' : 'Սխալ է!'}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {view === 'result' && (
          <motion.div 
            key="result"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white text-slate-900 rounded-[4rem] p-12 text-center shadow-[0_0_100px_rgba(255,255,255,0.1)]"
          >
            <div className="w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-8 shadow-xl">
              <Trophy className="w-12 h-12 text-slate-900" />
            </div>
            <h2 className="text-5xl font-black uppercase tracking-tighter mb-2">ԱՎԱՐՏ!</h2>
            <p className="text-slate-400 font-bold mb-10 italic">Դուք հավաքեցիք զամբյուղը:</p>
            
            <div className="bg-slate-50 rounded-[2.5rem] p-10 mb-10 border-2 border-slate-100">
              <span className="text-slate-300 font-black uppercase text-xs tracking-widest block mb-2">Միավորներ</span>
              <div className="text-8xl font-black text-slate-900 tracking-tighter">
                {score}<span className="text-3xl text-slate-300">/{WORDS.length}</span>
              </div>
            </div>

            <button 
              onClick={reset}
              className="w-full py-6 bg-slate-900 text-white rounded-full font-black text-xl uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-4 shadow-xl"
            >
              <RotateCcw className="w-6 h-6" />
              Նորից Խաղալ
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-6 text-white/20 text-[10px] font-black uppercase tracking-[0.5em]">
        Spanish Learning • Gender Basket 3D
      </footer>

      <style dangerouslySetInnerHTML={{ __html: `
        .perspective-1000 {
          perspective: 1000px;
        }
      `}} />
    </div>
  );
}
