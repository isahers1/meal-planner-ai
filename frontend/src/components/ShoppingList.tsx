interface ShoppingListProps {
  items: Record<string, string>;
}

export function ShoppingList({ items }: ShoppingListProps) {
  const sortedItems = Object.entries(items).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  if (sortedItems.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Shopping List</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
        {sortedItems.map(([name, quantity]) => (
          <div
            key={name}
            className="flex items-center gap-2 p-2 bg-gray-50 rounded"
          >
            <input
              type="checkbox"
              className="w-4 h-4 rounded border-gray-300"
            />
            <span className="text-sm">
              <span className="font-medium">{name.replace(/_/g, " ")}</span>
              <span className="text-gray-500 ml-1">({quantity})</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
