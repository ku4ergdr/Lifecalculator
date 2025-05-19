import ProgressBar from './ProgressBar';

function StatsView({ weeksLived, totalWeeks, livedPercent }) {
  const yearsLived = Math.floor(weeksLived / 52);
  const weeksRemaining = Math.max(totalWeeks - weeksLived, 0);
  const yearsRemaining = Math.floor(weeksRemaining / 52);

  return (
    <div className="space-y-4">
      <div>
        <p className="font-semibold">Прожито недель: {weeksLived}</p>
        <p className="font-semibold">Осталось недель: {weeksRemaining}</p>
        <p className="font-semibold">Примерно лет прожито: {yearsLived}</p>
        <p className="font-semibold">Осталось лет: {yearsRemaining}</p>
      </div>
      <ProgressBar value={livedPercent} />
      <p className="text-center text-sm text-muted-foreground">
        Прожито {livedPercent.toFixed(2)}% из 80 лет
      </p>
    </div>
  );
}

export default StatsView;
