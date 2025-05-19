import { useState } from 'react';

function App() {
  const [birthDate, setBirthDate] = useState('');
  const [weeksData, setWeeksData] = useState(null);

  const calculateWeeks = () => {
    if (!birthDate) {
      alert('Пожалуйста, введите дату рождения.');
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const livedWeeks = Math.floor((today - birth) / oneWeek);

    if (livedWeeks < 0) {
      alert('Дата рождения не может быть в будущем!');
      return;
    }

    const totalWeeks = 80 * 52;
    const livedPercent = Math.min((livedWeeks / totalWeeks) * 100, 100);
    const remainPercent = 100 - livedPercent;

    const weeks = Array.from({ length: 80 }, (_, y) =>
      Array.from({ length: 52 }, (_, w) => y * 52 + w < livedWeeks)
    );

    setWeeksData({
      weeks,
      livedPercent: livedPercent.toFixed(2),
      remainPercent: remainPercent.toFixed(2),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-700 via-purple-600 to-pink-500 text-white p-4">
      <h1 className="text-3xl text-center font-bold mb-6">Подсчет прожитых недель</h1>
      <div className="max-w-md mx-auto bg-white/10 p-6 rounded-xl backdrop-blur-md">
        <div className="mb-4">
          <label htmlFor="birthdate" className="block mb-2 font-medium">Дата рождения</label>
          <input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full bg-white/20 p-2 rounded text-gray-800"
          />
        </div>
        <button
          className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
          onClick={calculateWeeks}
        >
          Показать результат
        </button>
      </div>

      {weeksData && (
        <div className="mt-8 bg-white/10 p-4 rounded-xl backdrop-blur-md">
          <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
            {weeksData.weeks.map((row, year) => (
              <div key={year} className="flex items-center">
                <span className="w-10 text-right mr-2 text-sm opacity-80">{year + 1}</span>
                <div className="grid grid-cols-52 gap-[2px]">
                  {row.map((lived, i) => (
                    <div
                      key={i}
                      className={`w-3 h-3 rounded-full ${lived ? 'bg-gray-200' : 'bg-gray-500'}`}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <p className="text-center font-semibold mt-4">
            Прожито: {weeksData.livedPercent}% | Осталось: {weeksData.remainPercent}% (до 80 лет)
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
