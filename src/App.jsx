import { useState } from 'react';
import Tabs from './components/Tabs';
import StatsView from './components/StatsView';
import GridView from './components/GridView';

function getWeekDiff(d1, d2) {
  const week = 1000 * 60 * 60 * 24 * 7;
  return Math.floor((d2 - d1) / week);
}

function getMonthDiff(d1, d2) {
  let years = d2.getFullYear() - d1.getFullYear();
  let months = years * 12 + (d2.getMonth() - d1.getMonth());
  if (d2.getDate() < d1.getDate()) {
    months--;
  }
  return months;
}

function getYearDiff(d1, d2) {
  let diff = d2.getFullYear() - d1.getFullYear();
  if (
    d2.getMonth() < d1.getMonth() ||
    (d2.getMonth() === d1.getMonth() && d2.getDate() < d1.getDate())
  ) {
    diff--;
  }
  return diff;
}

function App() {
  const [birthDate, setBirthDate] = useState('');
  const [timeframe, setTimeframe] = useState('week');
  const [events, setEvents] = useState([
    { date: '', label: '', color: '#FF0000' },
    { date: '', label: '', color: '#0000FF' },
    { date: '', label: '', color: '#008000' },
  ]);
  const [result, setResult] = useState(null);

  const addEvent = () => {
    if (events.length >= 10) {
      alert('Максимум 10 важных дат.');
      return;
    }
    setEvents([...events, { date: '', label: '', color: '#000000' }]);
  };

  const updateEvent = (index, field, value) => {
    const updated = [...events];
    updated[index][field] = value;
    setEvents(updated);
  };

  const calculate = () => {
    if (!birthDate) {
      alert('Пожалуйста, введите дату рождения.');
      return;
    }
    const birth = new Date(birthDate);
    const today = new Date();
    if (birth > today) {
      alert('Дата рождения не может быть в будущем!');
      return;
    }

    let livedIntervals = 0;
    let intervalsPerYear = 52;
    let totalIntervals = 80 * 52;

    if (timeframe === 'week') {
      livedIntervals = getWeekDiff(birth, today);
      intervalsPerYear = 52;
      totalIntervals = 80 * 52;
    } else if (timeframe === 'month') {
      livedIntervals = getMonthDiff(birth, today);
      intervalsPerYear = 12;
      totalIntervals = 80 * 12;
    } else {
      livedIntervals = getYearDiff(birth, today);
      intervalsPerYear = 1;
      totalIntervals = 80;
    }

    let livedPercent = Math.min((livedIntervals / totalIntervals) * 100, 100);
    let remainPercent = 100 - livedPercent;

    const specialMap = {};
    events.forEach((ev) => {
      if (!ev.date) return;
      const d = new Date(ev.date);
      let index = 0;
      if (timeframe === 'week') {
        index = getWeekDiff(birth, d);
      } else if (timeframe === 'month') {
        index = getMonthDiff(birth, d);
      } else {
        index = getYearDiff(birth, d);
      }
      if (index >= 0 && index < totalIntervals) {
        specialMap[index] = { color: ev.color, label: ev.label || 'Важная дата' };
      }
    });

    const grid = [];
    if (timeframe === 'year') {
      const row = [];
      for (let y = 0; y < 80; y++) {
        const index = y;
        row.push({ lived: index < livedIntervals, event: specialMap[index] || null, age: y + 1 });
      }
      grid.push(row);
    } else {
      for (let y = 0; y < 80; y++) {
        const row = [];
        for (let i = 0; i < intervalsPerYear; i++) {
          const index = y * intervalsPerYear + i;
          row.push({ lived: index < livedIntervals, event: specialMap[index] || null });
        }
        grid.push(row);
      }
    }

    setResult({
      grid,
      livedIntervals,
      remainPercent,
      livedPercent,
      totalIntervals,
      intervalsPerYear,
      timeframe,
      startYear: birth.getFullYear(),
    });
  };

  const gridContent = result && (
    <GridView grid={result.grid} timeframe={result.timeframe} startYear={result.startYear} />
  );

  const statsContent = result && (
    <StatsView
      livedIntervals={result.livedIntervals}
      totalIntervals={result.totalIntervals}
      timeframe={result.timeframe}
    />
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-4">
      <h1 className="text-2xl font-semibold text-center mb-6">Life Calculator</h1>
      <div className="max-w-xl mx-auto bg-white p-6 rounded-xl shadow space-y-4">
        <div>
          <label htmlFor="birthdate" className="block mb-2 font-medium">Дата рождения</label>
          <input
            type="date"
            id="birthdate"
            value={birthDate}
            onChange={(e) => setBirthDate(e.target.value)}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="space-x-4">
          <span className="font-medium">Отображать в:</span>
          <label className="mr-2">
            <input
              type="radio"
              name="timeframe"
              value="week"
              checked={timeframe === 'week'}
              onChange={(e) => setTimeframe(e.target.value)}
              className="mr-1"
            />
            Неделях
          </label>
          <label className="mr-2">
            <input
              type="radio"
              name="timeframe"
              value="month"
              checked={timeframe === 'month'}
              onChange={(e) => setTimeframe(e.target.value)}
              className="mr-1"
            />
            Месяцах
          </label>
          <label>
            <input
              type="radio"
              name="timeframe"
              value="year"
              checked={timeframe === 'year'}
              onChange={(e) => setTimeframe(e.target.value)}
              className="mr-1"
            />
            Годах
          </label>
        </div>
        <div>
          <h3 className="font-medium mb-2">Важные даты</h3>
          {events.map((ev, i) => (
            <div key={i} className="flex items-center space-x-2 mb-2 important-event">
              <input
                type="date"
                value={ev.date}
                onChange={(e) => updateEvent(i, 'date', e.target.value)}
                className="border rounded p-1"
              />
              <input
                type="text"
                value={ev.label}
                placeholder="Подпись"
                onChange={(e) => updateEvent(i, 'label', e.target.value)}
                className="border rounded p-1"
              />
              <input
                type="color"
                value={ev.color}
                onChange={(e) => updateEvent(i, 'color', e.target.value)}
                className="w-8 h-8 p-0 border-none"
              />
            </div>
          ))}
          <button type="button" onClick={addEvent} className="mt-2 text-sm text-blue-600 hover:underline">
            Добавить важную дату
          </button>
        </div>
        <button
          className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
          onClick={calculate}
        >
          Показать результат
        </button>
      </div>

      {result && (
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
