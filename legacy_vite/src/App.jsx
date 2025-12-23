import { useState, useEffect, useMemo } from 'react';

const WEEK_MS = 1000 * 60 * 60 * 24 * 7;
const TOTAL_YEARS = 80;
const WEEKS_IN_YEAR = 52;

// Utility to format date for display
const formatDate = (date) => {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

export default function App() {
  const [birthDate, setBirthDate] = useState('');
  const [lifeData, setLifeData] = useState(null);
  const [error, setError] = useState('');
  const [hoveredCell, setHoveredCell] = useState(null);

  const calculateLifeData = (dateString) => {
    if (!dateString) return;

    const birth = new Date(dateString);
    const today = new Date();
    
    // Reset hours for accurate day calc
    birth.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diff = today - birth;

    if (diff < 0) {
      setError('Вы еще не родились? Введите дату из прошлого.');
      setLifeData(null);
      return;
    }
    setError('');

    const livedWeeks = Math.floor(diff / WEEK_MS);
    const totalWeeks = TOTAL_YEARS * WEEKS_IN_YEAR;
    const percentage = Math.min((livedWeeks / totalWeeks) * 100, 100).toFixed(2);
    
    // Calculate precise age
    let ageYears = today.getFullYear() - birth.getFullYear();
    let m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        ageYears--;
    }
    
    // Generate grid data grouped by decades for better UX
    const decades = [];
    for (let i = 0; i < TOTAL_YEARS; i += 10) {
      const yearsInDecade = [];
      for (let j = 0; j < 10; j++) {
        const yearIndex = i + j;
        const weeksInYear = [];
        for (let w = 0; w < WEEKS_IN_YEAR; w++) {
           const absoluteWeekIndex = yearIndex * WEEKS_IN_YEAR + w;
           weeksInYear.push({
             isLived: absoluteWeekIndex < livedWeeks,
             weekIndex: absoluteWeekIndex,
             yearIndex: yearIndex,
             relWeekIndex: w
           });
        }
        yearsInDecade.push(weeksInYear);
      }
      decades.push(yearsInDecade);
    }

    setLifeData({
      livedWeeks,
      percentage,
      ageYears,
      decades,
      birthDate: birth // Store Date object for tooltip calcs
    });
  };

  const handleDateChange = (e) => {
    const val = e.target.value;
    setBirthDate(val);
    calculateLifeData(val);
  };

  // Tooltip content helper
  const getTooltipContent = () => {
    if (!hoveredCell || !lifeData) return null;
    const { yearIndex, relWeekIndex } = hoveredCell;
    
    // Approximate date of this week
    const cellDate = new Date(lifeData.birthDate);
    cellDate.setDate(cellDate.getDate() + (yearIndex * 52 + relWeekIndex) * 7);
    
    const isPast = hoveredCell.isLived;
    
    return (
      <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-48 bg-gray-800 text-white text-xs rounded-lg shadow-xl p-2 border border-gray-700 pointer-events-none fade-in">
         <div className="font-semibold text-gray-300">
           {isPast ? 'Прожито' : 'Будущее'}
         </div>
         <div className="mt-1 text-gray-400">
           Возраст: <span className="text-white">{yearIndex} лет</span>
         </div>
         <div className="mt-1 text-gray-500">
           {formatDate(cellDate)}
         </div>
         {/* Arrow */}
         <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-8 border-transparent border-t-gray-800"></div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0f172a] text-gray-100 flex flex-col items-center py-10 px-4 font-inter selection:bg-purple-500 selection:text-white">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full animate-pulse-slow"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full animate-pulse-slow" style={{animationDelay: '2s'}}></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl">
        
        {/* Header Section */}
        <header className="text-center mb-12 animate-fade-in-down">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4 drop-shadow-sm">
            Life Calendar
          </h1>
          <p className="text-lg text-gray-400 font-light max-w-xl mx-auto">
            Визуализация вашего времени. Каждая точка — это одна неделя вашей жизни.
          </p>
        </header>

        {/* Input Section */}
        <div className="flex flex-col items-center justify-center mb-12 animate-fade-in-up" style={{animationDelay: '0.1s'}}>
          <div className="relative group w-full max-w-sm">
             <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-100 transition duration-500"></div>
             <input
               type="date"
               value={birthDate}
               onChange={handleDateChange}
               className="relative w-full bg-gray-900 border border-gray-700 text-white text-lg rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent block w-full pl-10 p-4 transition-all outline-none placeholder-gray-500"
               placeholder="Выберите дату рождения"
             />
             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
             </div>
          </div>
          
          {error && (
            <p className="mt-3 text-red-400 text-sm animate-shake">
              {error}
            </p>
          )}

          {lifeData && !error && (
             <div className="mt-6 flex gap-8 text-center animate-fade-in">
                <div>
                   <span className="block text-3xl font-bold text-white">{lifeData.ageYears}</span>
                   <span className="text-xs text-gray-500 uppercase tracking-widest">Лет</span>
                </div>
                <div>
                   <span className="block text-3xl font-bold text-purple-400">{lifeData.percentage}%</span>
                   <span className="text-xs text-gray-500 uppercase tracking-widest">Прожито</span>
                </div>
                <div>
                   <span className="block text-3xl font-bold text-gray-400">{TOTAL_YEARS - lifeData.ageYears}</span>
                   <span className="text-xs text-gray-500 uppercase tracking-widest">Осталось ~</span>
                </div>
             </div>
          )}
        </div>

        {/* Visualization Grid */}
        {lifeData && !error && (
          <div className="w-full animate-fade-in-up" style={{animationDelay: '0.2s'}}>
             {/* Decade Loop */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {lifeData.decades.map((decadeYears, dIndex) => (
                  <div key={dIndex} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50 backdrop-blur-sm hover:border-gray-600 transition-colors duration-300">
                    <h3 className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wider">
                      {dIndex * 10} - {(dIndex * 10) + 9} Лет
                    </h3>
                    
                    <div className="space-y-1">
                      {decadeYears.map((weeks, yIndex) => (
                        <div key={yIndex} className="flex gap-[2px]">
                           {weeks.map((week, wIndex) => (
                              <div 
                                key={wIndex}
                                onMouseEnter={() => setHoveredCell(week)}
                                onMouseLeave={() => setHoveredCell(null)}
                                className="relative group cursor-none"
                              >
                                <div 
                                  className={`w-[3px] h-[3px] sm:w-[4px] sm:h-[4px] rounded-full transition-all duration-500 ${
                                    week.isLived 
                                      ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-[0_0_2px_rgba(168,85,247,0.4)]' 
                                      : 'bg-gray-700 opacity-40'
                                  }`}
                                />
                                {hoveredCell === week && getTooltipContent()}
                              </div>
                           ))}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
             
             <p className="text-center text-gray-600 text-sm mt-12 mb-4">
                Каждая строка — один год. Каждый квадрат — одна неделя.
             </p>
          </div>
        )}
      </div>
      
      <style>{`
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
        .animate-fade-in-down { animation: fadeInDown 0.8s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.8s ease-out forwards; }
        .animate-fade-in { animation: fadeIn 0.5s ease-out forwards; }
        .animate-shake { animation: shake 0.3s ease-in-out; }
        .animate-pulse-slow { animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
      `}</style>
    </div>
  );
}
