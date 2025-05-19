import ProgressBar from './ProgressBar';

function StatsView({ livedIntervals, totalIntervals, timeframe }) {
  const intervalsPerYear = timeframe === 'week' ? 52 : timeframe === 'month' ? 12 : 1;
  const yearsLived = Math.floor(livedIntervals / intervalsPerYear);
  const intervalsRemaining = Math.max(totalIntervals - livedIntervals, 0);
  const yearsRemaining = Math.floor(intervalsRemaining / intervalsPerYear);
  const progress = Math.min((livedIntervals / totalIntervals) * 100, 100);

  const names = {
    week: 'недель',
    month: 'месяцев',
    year: 'лет',
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">
          Прожито: {livedIntervals} {names[timeframe]}
        </p>
        <p className="font-semibold">
          Осталось: {intervalsRemaining} {names[timeframe]}
        </p>
        <p className="font-semibold">Примерно лет прожито: {yearsLived}</p>
        <p className="font-semibold">Осталось лет: {yearsRemaining}</p>
      </div>
      <ProgressBar value={progress} />
      <p className="text-center text-sm text-muted-foreground">
        Прожито {progress.toFixed(2)}% из 80 лет
      </p>
    </div>
  );
}

export default StatsView;
