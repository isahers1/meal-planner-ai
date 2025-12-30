import type { MealInfo } from "../types";

interface MealDisplayProps {
  meal: MealInfo;
}

export function MealDisplay({ meal }: MealDisplayProps) {
  return (
    <div className="space-y-3">
      <h4 className="font-semibold text-lg text-green-700">{meal.name}</h4>

      <div>
        <h5 className="font-medium text-sm text-gray-600 mb-1">Ingredients:</h5>
        <ul className="text-sm space-y-0.5">
          {Object.entries(meal.ingredients).map(([name, quantity]) => (
            <li key={name} className="text-gray-700">
              <span className="font-medium">{name.replace(/_/g, " ")}</span>:{" "}
              {quantity}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h5 className="font-medium text-sm text-gray-600 mb-1">
          Instructions:
        </h5>
        <ol className="text-sm space-y-1 list-decimal list-inside">
          {meal.instructions.map((step, index) => (
            <li key={index} className="text-gray-700">
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
