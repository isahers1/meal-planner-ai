interface SegmentedControlProps {
  value: boolean;
  onChange: (value: boolean) => void;
}

export function SegmentedControl({ value, onChange }: SegmentedControlProps) {
  return (
    <div className="flex rounded-lg bg-gray-100 p-1">
      <button
        type="button"
        onClick={() => onChange(false)}
        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          !value
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Solo meal
      </button>
      <button
        type="button"
        onClick={() => onChange(true)}
        className={`flex-1 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
          value
            ? "bg-gray-900 text-white shadow-sm"
            : "text-gray-600 hover:text-gray-900"
        }`}
      >
        Leftovers
      </button>
    </div>
  );
}
