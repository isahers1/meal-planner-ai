interface TimeSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MARKS = [15, 30, 45, 60, 75, 90];
const MIN = 15;
const MAX = 90;

export function TimeSlider({ value, onChange }: TimeSliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(parseInt(e.target.value, 10));
  };

  // Calculate percentage position for each mark
  const getMarkPosition = (mark: number) => ((mark - MIN) / (MAX - MIN)) * 100;

  return (
    <div className="space-y-2 w-full max-w-[160px]">
      <div className="text-center">
        <span className="text-2xl font-semibold text-gray-900">{value}</span>
        <span className="text-sm text-gray-500 ml-1">min</span>
      </div>
      <div className="relative">
        {/* Mark indicators - behind the slider */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 pointer-events-none">
          {MARKS.map((mark) => (
            <div
              key={mark}
              className="absolute w-0.5 h-2 bg-gray-300 -translate-x-1/2"
              style={{ left: `${getMarkPosition(mark)}%` }}
            />
          ))}
        </div>
        <input
          type="range"
          min={MIN}
          max={MAX}
          step={1}
          value={value}
          onChange={handleChange}
          className="w-full relative z-10"
        />
      </div>
      <div className="relative h-4">
        {MARKS.map((mark) => (
          <span
            key={mark}
            className={`absolute text-xs -translate-x-1/2 ${
              mark === value ? "text-gray-900 font-medium" : "text-gray-400"
            }`}
            style={{ left: `${getMarkPosition(mark)}%` }}
          >
            {mark}
          </span>
        ))}
      </div>
    </div>
  );
}
