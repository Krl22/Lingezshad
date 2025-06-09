import React, { useState } from "react";
import clsx from "clsx";
import { X } from "lucide-react";

export type ExerciseItem = {
  id: string;
  image: string;
  label: string;
};

type DragAndDropExerciseProps = {
  items: ExerciseItem[];
  onComplete?: () => void;
};

export const DragAndDropExercise: React.FC<DragAndDropExerciseProps> = ({
  items,
}) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>(
    {}
  );

  // Mezclar etiquetas solo una vez al montar el componente
  const [shuffledLabels] = useState(() => {
    const arr = [...items];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  });

  const handleImageClick = (targetId: string) => {
    if (selectedLabel) {
      // Si la etiqueta ya estaba asignada a otra imagen, la removemos
      const currentAssignments = { ...droppedItems };
      for (const key in currentAssignments) {
        if (currentAssignments[key] === selectedLabel) {
          delete currentAssignments[key];
        }
      }
      // Asignamos la etiqueta a la nueva imagen
      setDroppedItems({
        ...currentAssignments,
        [targetId]: selectedLabel,
      });
      setSelectedLabel(null);
    }
  };

  const removeAssignment = (imageId: string) => {
    const newDroppedItems = { ...droppedItems };
    delete newDroppedItems[imageId];
    setDroppedItems(newDroppedItems);
  };

  const isCorrect = (imageId: string) => droppedItems[imageId] === imageId;

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Etiquetas seleccionables */}
      <div className="flex flex-wrap gap-3 px-1 mb-4 sm:justify-center sm:gap-4">
        {shuffledLabels.map((item) => {
          const isAssigned = Object.values(droppedItems).includes(item.id);
          const isSelected = selectedLabel === item.id;
          return (
            <button
              key={item.id}
              disabled={isAssigned}
              onClick={() => setSelectedLabel(item.id)}
              className={`px-4 py-3 font-semibold rounded-xl shadow-md cursor-pointer transition-all duration-200 border-2
                ${
                  isAssigned
                    ? "cursor-not-allowed bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-200 dark:border-gray-700"
                    : ""
                }
                ${
                  isSelected
                    ? "ring-4 bg-blue-500 text-white border-blue-600 ring-blue-200 dark:ring-blue-400 transform scale-105 shadow-lg"
                    : "bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg"
                }
              `}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {/* Responsive horizontal scroll container for mobile */}
      <div className="flex overflow-x-auto gap-4 px-1 py-2 sm:hidden">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleImageClick(item.id)}
            className={clsx(
              "flex-shrink-0 w-52 border-3 rounded-2xl p-3 transition-all duration-200 relative cursor-pointer shadow-md",
              droppedItems[item.id]
                ? isCorrect(item.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-green-200 dark:shadow-green-900"
                  : "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-red-200 dark:shadow-red-900"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:shadow-lg",
              selectedLabel && "ring-4 ring-blue-300 dark:ring-blue-500"
            )}
          >
            <img
              src={item.image}
              alt={item.label}
              className="object-contain w-full h-40 rounded-xl bg-gray-50 dark:bg-gray-700"
            />
            <div className="mt-3 text-base font-semibold text-center">
              {droppedItems[item.id] ? (
                <div className="relative">
                  <span className="inline-block px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                    {items.find((i) => i.id === droppedItems[item.id])?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignment(item.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full border-2 shadow-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950 border-red-300 dark:border-red-700 transition-colors"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  Click to match
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Grid layout for larger screens */}
      <div className="hidden grid-cols-2 gap-6 mt-4 sm:grid md:grid-cols-3">
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => handleImageClick(item.id)}
            className={clsx(
              "p-4 border-3 rounded-2xl transition-all duration-200 relative cursor-pointer shadow-md hover:shadow-lg",
              droppedItems[item.id]
                ? isCorrect(item.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-950/30 shadow-green-200 dark:shadow-green-900"
                  : "border-red-500 bg-red-50 dark:bg-red-950/30 shadow-red-200 dark:shadow-red-900"
                : "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-400 dark:hover:border-gray-500",
              selectedLabel && "ring-4 ring-blue-300 dark:ring-blue-500"
            )}
          >
            <img
              src={item.image}
              alt={item.label}
              className="object-contain w-full h-48 rounded-xl bg-gray-50 dark:bg-gray-700"
            />
            <div className="mt-3 text-lg font-semibold text-center">
              {droppedItems[item.id] ? (
                <div className="inline-block relative">
                  <span className="inline-block px-4 py-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border border-blue-200 dark:border-blue-700">
                    {items.find((i) => i.id === droppedItems[item.id])?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignment(item.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 rounded-full border-2 shadow-md bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-red-950 border-red-300 dark:border-red-700 transition-colors"
                  >
                    <X className="w-3 h-3 text-red-500" />
                  </button>
                </div>
              ) : (
                <span className="text-gray-500 dark:text-gray-400 italic">
                  Click to match
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
