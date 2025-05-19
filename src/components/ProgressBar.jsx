function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-200 rounded-full h-3">
      <div
        className="h-3 rounded-full bg-green-500"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export default ProgressBar;
