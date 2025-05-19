import React from 'react';

function getYearWord(age) {
  const lastTwo = age % 100;
  const lastDigit = age % 10;
  if (lastTwo >= 11 && lastTwo <= 14) {
    return 'лет';
  } else {
    if (lastDigit === 1) return 'год';
    if (lastDigit >= 2 && lastDigit <= 4) return 'года';
    return 'лет';
  }
}

function GridView({ grid, timeframe, startYear }) {
  const intervalsPerYear = timeframe === 'week' ? 52 : timeframe === 'month' ? 12 : 1;

  if (timeframe === 'year') {
    const row = grid[0];
    return (
      <div className="flex flex-wrap gap-[2px]" id="year-row-horizontal">
        {row.map((cell, i) => (
          <div
            key={i}
            className="w-3 h-3 rounded-full cursor-pointer"
            style={{ backgroundColor: cell.event ? cell.event.color : cell.lived ? '#10b981' : '#d1d5db' }}
            title={cell.event ? cell.event.label : `${startYear + i} (${i + 1} ${getYearWord(i + 1)})`}
            onClick={() => alert(cell.event ? cell.event.label : `${startYear + i} (${i + 1} ${getYearWord(i + 1)})`)}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-[60vh] overflow-auto pr-2">
      {grid.map((row, year) => (
        <div key={year} className="flex items-center year-row">
          <span className="w-32 text-right mr-2 text-sm opacity-80">
            {startYear + year} ({year + 1} {getYearWord(year + 1)})
          </span>
          <div
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(${intervalsPerYear}, minmax(0, 1fr))` }}
          >
            {row.map((cell, i) => (
              <div
                key={i}
                className="w-3 h-3 rounded-full cursor-pointer circle"
                style={{ backgroundColor: cell.event ? cell.event.color : cell.lived ? '#10b981' : '#d1d5db' }}
                title={cell.event ? cell.event.label : undefined}
                onClick={() => cell.event && alert(cell.event.label)}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default GridView;
