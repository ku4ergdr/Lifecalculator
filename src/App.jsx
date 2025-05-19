import { useState } from 'react';
import Tabs from './components/Tabs';
import StatsView from './components/StatsView';

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
      livedPercent,
      remainPercent,
      livedWeeks,
      totalWeeks,
    });
  };

  const gridContent = weeksData && (
    <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
      {weeksData.weeks.map((row, year) => (
        <div key={year} className="flex items-center">
          <span className="w-10 text-right mr-2 text-sm opacity-80">{year + 1}</span>
          <div className="grid grid-cols-52 gap-[2px]">
            {row.map((lived, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full ${lived ? 'bg-green-500' : 'bg-gray-300'}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  const statsContent = weeksData && (
    <StatsView
      weeksLived={weeksData.livedWeeks}
      totalWeeks={weeksData.totalWeeks}
      livedPercent={weeksData.livedPercent}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Life Calculator</h1>
      <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
        <div className="mb-4">
          <label htmlFor="birthdate" className="block mb-2 font-medium">Дата рождения</label>
          <input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          onClick={calculateWeeks}
        >
          Показать результат
        </button>
      </div>

      {weeksData && (
        <div className="mt-8">
          <Tabs
            tabs={[
              { label: 'Сетка', content: gridContent },
              { label: 'Статистика', content: statsContent },
            ]}
          />
        </div>
      )}
    </div>
  );
}

export default App;
