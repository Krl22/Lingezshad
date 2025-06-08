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
  onComplete,
}) => {
  const [selectedLabel, setSelectedLabel] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>({});

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

  // Obtener etiquetas no asignadas
  const unassignedLabels = items.filter(
    (item) => !Object.values(droppedItems).includes(item.id)
  );

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Etiquetas seleccionables */}
      <div className="flex flex-wrap gap-3 px-1 sm:justify-center sm:gap-4 mb-4">
        {shuffledLabels.map((item) => {
          const isAssigned = Object.values(droppedItems).includes(item.id);
          const isSelected = selectedLabel === item.id;
          return (
            <button
              key={item.id}
              disabled={isAssigned}
              onClick={() => setSelectedLabel(item.id)}
              className={`px-3 py-2 font-semibold rounded-xl shadow cursor-pointer transition
                ${isAssigned ? "bg-muted text-muted-foreground cursor-not-allowed" : ""}
                ${isSelected ? "bg-primary text-primary-foreground ring-2 ring-primary/50" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}
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
              "flex-shrink-0 w-52 border-2 rounded-2xl p-2 transition-colors relative cursor-pointer",
              droppedItems[item.id]
                ? isCorrect(item.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-border bg-card",
              selectedLabel && "ring-2 ring-primary/50"
            )}
          >
            <img
              src={item.image}
              alt={item.label}
              className="object-contain w-full h-40 rounded-xl"
            />
            <div className="mt-2 text-base font-semibold text-center text-foreground">
              {droppedItems[item.id] ? (
                <div className="relative">
                  <span className="inline-block px-3 py-1 bg-secondary text-secondary-foreground rounded-lg">
                    {items.find((i) => i.id === droppedItems[item.id])?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignment(item.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-background border rounded-full shadow-sm hover:bg-muted"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ) : (
                "Haz clic aquí"
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
              "p-4 border-2 rounded-2xl transition-colors relative cursor-pointer",
              droppedItems[item.id]
                ? isCorrect(item.id)
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20"
                : "border-border bg-card",
              selectedLabel && "ring-2 ring-primary/50"
            )}
          >
            <img
              src={item.image}
              alt={item.label}
              className="object-contain w-full h-48 rounded-xl"
            />
            <div className="mt-2 text-lg font-semibold text-center text-foreground">
              {droppedItems[item.id] ? (
                <div className="inline-block relative">
                  <span className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded-lg">
                    {items.find((i) => i.id === droppedItems[item.id])?.label}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeAssignment(item.id);
                    }}
                    className="absolute -top-2 -right-2 p-1 bg-background border rounded-full shadow-sm hover:bg-muted"
                  >
                    <X className="w-3 h-3 text-destructive" />
                  </button>
                </div>
              ) : (
                "Haz clic aquí"
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
