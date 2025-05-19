import { useState, useEffect } from 'react';

const modeConfig = {
  years: { label: 'Годы', unitsPerYear: 1, total: 80 },
  months: { label: 'Месяцы', unitsPerYear: 12, total: 80 * 12 },
  weeks: { label: 'Недели', unitsPerYear: 52, total: 80 * 52 },
};

export default function App() {
  const [birthDate, setBirthDate] = useState('');
  const [mode, setMode] = useState('weeks');
  const [lifeData, setLifeData] = useState(null);

  const calculate = () => {
    if (!birthDate) {
      alert('Пожалуйста, введите дату рождения.');
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    const diff = today - birth;
    if (diff < 0) {
      alert('Дата рождения не может быть в будущем!');
      return;
    }

    const WEEK = 1000 * 60 * 60 * 24 * 7;
    const MONTH = WEEK * 4.34812; // средняя длина месяца
    const YEAR = WEEK * 52;

    const livedWeeks = Math.floor(diff / WEEK);
    const livedMonths = Math.floor(diff / MONTH);
    const livedYears = Math.floor(diff / YEAR);

    const unitMap = {
      weeks: livedWeeks,
      months: livedMonths,
      years: livedYears,
    };

    const { unitsPerYear, total } = modeConfig[mode];
    const livedUnits = unitMap[mode];
    const percent = Math.min((livedUnits / total) * 100, 100);

    const grid = Array.from({ length: 80 }, (_, y) =>
      Array.from({ length: unitsPerYear }, (_, i) => y * unitsPerYear + i < livedUnits)
    );

    const ageYears = livedYears;
    const ageMonths = Math.floor((diff - ageYears * YEAR) / MONTH);
    const ageWeeks = Math.floor((diff - ageYears * YEAR - ageMonths * MONTH) / WEEK);

    setLifeData({
      grid,
      percent: percent.toFixed(2),
      ageYears,
      ageMonths,
      ageWeeks,
    });
  };

  useEffect(() => {
    if (lifeData) {
      calculate();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-800 via-indigo-800 to-purple-900 text-white p-4">
      <h1 className="text-4xl text-center font-bold mb-6">Календарь жизни</h1>
      <div className="max-w-md mx-auto bg-white/10 p-6 rounded-xl backdrop-blur-md">
        <label htmlFor="birthdate" className="block mb-2 font-medium text-white/90">Дата рождения</label>
        <input
          type="date"
          id="birthdate"
          value={birthDate}
          onChange={(e) => setBirthDate(e.target.value)}
          className="w-full bg-white/20 p-2 rounded text-gray-800"
        />
        <div className="flex justify-center gap-2 mt-4">
          {Object.entries(modeConfig).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setMode(key)}
              className={`px-3 py-1 rounded-full text-sm ${mode === key ? 'bg-green-500 text-white' : 'bg-white text-gray-800'}`}
            >
              {cfg.label}
            </button>
          ))}
        </div>
        <button
          className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded mt-4"
          onClick={calculate}
        >
          Показать результат
        </button>
      </div>
      {lifeData && (
        <div className="mt-8 bg-white/10 p-4 rounded-xl backdrop-blur-md max-w-2xl mx-auto">
          <p className="text-center text-lg mb-4">
            Вам {lifeData.ageYears} лет {lifeData.ageMonths} мес. {lifeData.ageWeeks} нед.
          </p>
          <div className="h-4 bg-gray-300 rounded overflow-hidden mb-4">
            <div className="h-full bg-green-500" style={{ width: `${lifeData.percent}%` }} />
          </div>
          <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
            {lifeData.grid.map((row, year) => (
              <div key={year} className="flex items-center">
                <span className="w-10 text-right mr-2 text-sm opacity-80">{year + 1}</span>
                <div
                  className="grid gap-[2px]"
                  style={{ gridTemplateColumns: `repeat(${modeConfig[mode].unitsPerYear}, minmax(0, 1fr))` }}
                >
                  {row.map((lived, i) => (
                    <div
                      key={i}
                      className={`w-4 h-4 rounded-full ${lived ? 'bg-gray-200' : 'bg-gray-600'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center font-semibold mt-4">
            Прожито: {lifeData.percent}% (до 80 лет)
          </p>
        </div>
      )}
    </div>
  );
}
