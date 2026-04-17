import React, { useState, useEffect, useRef } from 'react';
import { Trophy, Star, ArrowRight, Home, Play, User, CheckCircle, Target } from 'lucide-react';

const TOTAL_LEVELS = 10;

// Konfigurasi baris dan kolom untuk setiap level
const LEVEL_CONFIG = [
  { rows: 1, cols: 10 },  // Level 1: 1 baris, 10 soal ke kanan
  { rows: 2, cols: 10 },  // Level 2: 2 baris, 10 soal ke kanan
  { rows: 3, cols: 10 },  // Level 3: 3 baris, 10 soal ke kanan
  { rows: 4, cols: 10 },  // Level 4: 4 baris, 10 soal ke kanan
  { rows: 5, cols: 10 },  // Level 5: 5 baris, 10 soal ke kanan
  { rows: 6, cols: 10 },  // Level 6: 6 baris, 10 soal ke kanan
  { rows: 7, cols: 10 },  // Level 7: 7 baris, 10 soal ke kanan
  { rows: 8, cols: 10 },  // Level 8: 8 baris, 10 soal ke kanan
  { rows: 9, cols: 10 },  // Level 9: 9 baris, 10 soal ke kanan
  { rows: 10, cols: 10 }  // Level 10: 10 baris, 10 soal ke kanan
];

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('LOGIN'); // LOGIN, MENU, GAME, RESULT
  const [playerName, setPlayerName] = useState('');
  const [unlockedLevel, setUnlockedLevel] = useState(1);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gridData, setGridData] = useState([]);
  const [score, setScore] = useState({ filled: 0, correct: 0 });
  const [showAppreciation, setShowAppreciation] = useState(false);

  // Inisialisasi Papan Game berdasarkan level saat ini
  const generateGrid = (levelTarget) => {
    const config = LEVEL_CONFIG[levelTarget - 1];
    const newGrid = Array.from({ length: config.rows }, () =>
      Array.from({ length: config.cols }, () => {
        const top = Math.floor(Math.random() * 9) + 1; // 1-9
        const bottom = Math.floor(Math.random() * 9) + 1; // 1-9
        return { 
          top, 
          bottom, 
          correctAnswer: (top + bottom) % 10, 
          userInput: '' 
        };
      })
    );
    setGridData(newGrid);
  };

  const handleStartGame = (level) => {
    setCurrentLevel(level);
    generateGrid(level);
    setCurrentScreen('GAME');
  };

  const handleInputChange = (rowIndex, colIndex, value) => {
    // Hanya izinkan angka dan panjang maksimal 1 karakter
    const val = value.replace(/[^0-9]/g, '').slice(-1);
    
    const newGrid = [...gridData];
    newGrid[rowIndex][colIndex].userInput = val;
    setGridData(newGrid);
  };

  const handleSubmit = () => {
    let filledCount = 0;
    let correctCount = 0;

    gridData.forEach(row => {
      row.forEach(cell => {
        if (cell.userInput !== '') {
          filledCount++;
          if (parseInt(cell.userInput) === cell.correctAnswer) {
            correctCount++;
          }
        }
      });
    });

    setScore({ filled: filledCount, correct: correctCount });
    setCurrentScreen('RESULT');
    
    // Buka level selanjutnya jika skor lebih dari 0
    if (correctCount > 0 && currentLevel === unlockedLevel && unlockedLevel < TOTAL_LEVELS) {
      setUnlockedLevel(prev => prev + 1);
    }

    // Tampilkan animasi apresiasi
    setShowAppreciation(true);
    setTimeout(() => setShowAppreciation(false), 3000);
  };

  // --- Tampilan Layar ---

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6 w-full">
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
        <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Trophy className="text-blue-600 w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Tes Koran Web</h1>
        <p className="text-sm sm:text-base text-slate-500 mb-8">Latih kecepatan dan ketelitian berhitung Anda.</p>
        
        <div className="space-y-4">
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Masukkan Nama Anda" 
              className="w-full pl-10 pr-4 py-3 sm:py-4 rounded-xl border border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none text-base"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && playerName.trim() && setCurrentScreen('MENU')}
            />
          </div>
          <button 
            onClick={() => setCurrentScreen('MENU')}
            disabled={!playerName.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-lg"
          >
            Mulai Bermain <Play className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMenu = () => (
    <div className="flex flex-col min-h-screen bg-slate-50 p-4 sm:p-6 w-full">
      <div className="max-w-5xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 bg-white p-4 sm:p-6 rounded-xl shadow-sm gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">Halo, {playerName}!</h2>
            <p className="text-sm sm:text-base text-slate-500 mt-1">Pilih level untuk memulai tes.</p>
          </div>
          <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-2 w-full sm:w-auto justify-center">
            <Star className="text-yellow-500 w-6 h-6 fill-current" />
            <span className="font-bold text-blue-800 text-lg">Level {unlockedLevel}/10</span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {Array.from({ length: TOTAL_LEVELS }).map((_, idx) => {
            const level = idx + 1;
            const isUnlocked = level <= unlockedLevel;
            return (
              <button
                key={level}
                onClick={() => isUnlocked && handleStartGame(level)}
                disabled={!isUnlocked}
                className={`p-4 sm:p-6 rounded-2xl flex flex-col items-center justify-center gap-2 sm:gap-3 transition-all transform w-full ${
                  isUnlocked 
                    ? 'bg-white hover:-translate-y-1 hover:shadow-lg shadow-md cursor-pointer border-2 border-transparent hover:border-blue-100' 
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-lg sm:text-xl font-bold ${
                  isUnlocked ? 'bg-blue-100 text-blue-600' : 'bg-slate-300 text-slate-500'
                }`}>
                  {level}
                </div>
                <span className="font-semibold text-sm sm:text-base">Level {level}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderGame = () => (
    <div className="flex flex-col min-h-screen bg-slate-50 p-2 sm:p-4 md:p-6 w-full">
      <div className="max-w-full mx-auto w-full flex-grow flex flex-col">
        
        {/* Header Game (Responsive untuk HP dan Desktop) */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center mb-4 sm:mb-6 bg-white p-4 rounded-xl shadow-sm gap-4">
          <div className="flex justify-between items-center lg:block">
            <h2 className="text-lg sm:text-xl font-bold text-slate-800">Level {currentLevel}</h2>
            <p className="text-xs sm:text-sm text-slate-500 lg:mt-1">Pemain: <span className="font-semibold text-slate-700">{playerName}</span></p>
          </div>
          
          <div className="text-center px-3 py-2 sm:px-4 sm:py-3 bg-blue-50 rounded-lg border border-blue-100 flex-grow lg:flex-grow-0 lg:max-w-md">
            <p className="text-xs text-blue-600 font-bold mb-1">ATURAN:</p>
            <p className="text-xs sm:text-sm text-slate-700">Jumlahkan 2 angka vertikal & tulis <strong className="text-blue-800">digit terakhirnya</strong> (Cth: 8+7=15, isi 5)</p>
          </div>
          
          <button 
            onClick={handleSubmit}
            className="w-full lg:w-auto bg-green-500 hover:bg-green-600 text-white font-semibold py-3 lg:py-2 px-6 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2 text-base"
          >
            Selesai Tes <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Papan Game (Scroll Horizontal pada HP) */}
        <div className="flex-grow bg-white p-4 sm:p-6 rounded-xl shadow-sm overflow-x-auto border border-slate-200">
          <div className="min-w-max inline-block">
            {gridData.map((row, rowIndex) => (
              <div key={rowIndex} className="flex gap-2 sm:gap-4 mb-4 sm:mb-6 border-b border-slate-100 pb-4 last:border-0">
                <div className="w-6 sm:w-8 flex items-center justify-center text-slate-400 font-bold bg-slate-50 rounded-lg text-sm sm:text-base shrink-0">
                  {rowIndex + 1}
                </div>
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className="flex flex-col items-center justify-center gap-1">
                    <span className="font-semibold text-slate-700 text-sm sm:text-base">{cell.top}</span>
                    <span className="font-semibold text-slate-700 text-sm sm:text-base">{cell.bottom}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cell.userInput}
                      onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                      className="w-9 h-9 sm:w-10 sm:h-10 text-center font-bold text-base sm:text-lg bg-blue-50 border border-blue-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors p-0"
                      autoComplete="off"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );

  const renderResult = () => {
    const config = LEVEL_CONFIG[currentLevel - 1];
    const totalQuestions = config.rows * config.cols;
    const percentage = Math.round((score.correct / totalQuestions) * 100);
    
    let appreciationMsg = "Usaha yang Bagus!";
    if (percentage > 80) appreciationMsg = "Luar Biasa, Jenius!";
    else if (percentage > 50) appreciationMsg = "Hebat! Pertahankan!";

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-4 sm:p-6 w-full">
        
        {/* Animasi Apresiasi Mengambang */}
        {showAppreciation && (
          <div className="fixed inset-0 pointer-events-none flex items-center justify-center z-50 p-4">
            <div className="animate-bounce bg-yellow-400 text-yellow-900 px-6 py-4 sm:px-8 sm:py-6 rounded-full text-2xl sm:text-4xl font-black shadow-2xl transform -rotate-6 border-4 border-white text-center">
              {appreciationMsg} 🎉
            </div>
          </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl w-full max-w-lg text-center relative overflow-hidden">
          {/* Latar Belakang Dekoratif */}
          <div className="absolute top-0 left-0 w-full h-24 sm:h-32 bg-gradient-to-br from-blue-500 to-blue-700 -z-0"></div>
          
          <div className="relative z-10 flex flex-col items-center mt-4 sm:mt-8">
            <div className="bg-white p-4 rounded-full shadow-lg mb-4 sm:mb-6">
              <Trophy className="text-yellow-500 w-12 h-12 sm:w-16 sm:h-16" />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 mb-2">Level {currentLevel} Selesai!</h2>
            <p className="text-sm sm:text-base text-slate-500 mb-6 sm:mb-8">{appreciationMsg}</p>

            <div className="grid grid-cols-2 gap-3 sm:gap-4 w-full mb-6 sm:mb-8">
              <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 flex flex-col items-center">
                <Target className="text-blue-500 w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                <span className="text-2xl sm:text-3xl font-black text-blue-700">{score.filled}</span>
                <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Total Terisi</span>
              </div>
              <div className="bg-green-50 p-4 rounded-2xl border border-green-100 flex flex-col items-center">
                <CheckCircle className="text-green-500 w-6 h-6 sm:w-8 sm:h-8 mb-2" />
                <span className="text-2xl sm:text-3xl font-black text-green-700">{score.correct}</span>
                <span className="text-xs sm:text-sm text-slate-600 font-medium mt-1">Jumlah Benar</span>
              </div>
            </div>

            <div className="flex flex-col gap-3 w-full">
              {currentLevel < TOTAL_LEVELS && (
                <button 
                  onClick={() => handleStartGame(currentLevel + 1)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 sm:py-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2 text-base sm:text-lg"
                >
                  Lanjut Level {currentLevel + 1} <ArrowRight className="w-5 h-5" />
                </button>
              )}
              <button 
                onClick={() => setCurrentScreen('MENU')}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 sm:py-4 rounded-xl transition-colors flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <Home className="w-5 h-5" /> Kembali ke Menu
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Logika Render Utama
  return (
    <div className="font-sans text-slate-800 w-full min-h-screen">
      {currentScreen === 'LOGIN' && renderLogin()}
      {currentScreen === 'MENU' && renderMenu()}
      {currentScreen === 'GAME' && renderGame()}
      {currentScreen === 'RESULT' && renderResult()}
    </div>
  );
}