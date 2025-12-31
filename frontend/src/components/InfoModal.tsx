import { X } from "lucide-react";

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Meal Planner</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4 text-sm text-gray-600">
          <p>Plan your weekly dinners with AI-generated recipes.</p>
          <div className="space-y-2">
            <p className="font-medium text-gray-900">How to use:</p>
            <ol className="space-y-1.5 text-gray-500">
              <li className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">1.</span>
                <span>Tap a day to select it for meal planning</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">2.</span>
                <span>Set your cooking time limit (15-90 min)</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">3.</span>
                <span>Choose "Solo meal" or "+ Leftovers"</span>
              </li>
              <li className="flex gap-2">
                <span className="text-gray-400 flex-shrink-0">4.</span>
                <span>Tap Generate to create your meal plan</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
