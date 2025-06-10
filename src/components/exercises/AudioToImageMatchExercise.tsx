import React, { useState, useRef } from "react";
import clsx from "clsx";
import { Volume2, X } from "lucide-react";

export type AudioMatchItem = {
  id: string; // e.g. "lion"
  image: string;
  audio: string;
};

type AudioToImageMatchExerciseProps = {
  items: AudioMatchItem[];
  onComplete?: () => void;
};

export const AudioToImageMatchExercise: React.FC<
  AudioToImageMatchExerciseProps
> = ({ items }) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [droppedItems, setDroppedItems] = useState<{ [key: string]: string }>(
    {}
  );
  const audioRefs = useRef<{ [key: string]: HTMLAudioElement | null }>({});

  const handleDrop = (targetId: string) => {
    if (draggingId) {
      // Si el audio ya estaba asignado a otra imagen, lo removemos
      const currentAssignments = { ...droppedItems };
      for (const key in currentAssignments) {
        if (currentAssignments[key] === draggingId) {
          delete currentAssignments[key];
        }
      }

      // Asignamos el audio a la nueva imagen
      setDroppedItems({
        ...currentAssignments,
        [targetId]: draggingId,
      });
      setDraggingId(null);
    }
  };

  const removeAssignment = (imageId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newDroppedItems = { ...droppedItems };
    delete newDroppedItems[imageId];
    setDroppedItems(newDroppedItems);
  };

  const isCorrect = (imageId: string) => droppedItems[imageId] === imageId;

  const playAudio = (id: string) => {
    const audio = audioRefs.current[id];
    if (audio) {
      audio.currentTime = 0;
      audio.play();
    }
  };

  // Verificar qué audios no han sido asignados aún
  const unassignedAudios = items.filter(
    (item) => !Object.values(droppedItems).includes(item.id)
  );

  return (
    <div className="flex flex-col gap-6 px-2 mx-auto w-full max-w-4xl">
      <div className="overflow-x-auto">
        <div
          className={clsx(
            "grid gap-4 py-2 min-w-[500px]",
            "grid-rows-2",
            "grid-flow-col",
            "auto-cols-[minmax(140px,1fr)]"
          )}
          style={{ minWidth: "350px" }}
        >
          {items.map((item) => (
            <div
              key={item.id}
              className={clsx(
                "flex relative justify-center items-center p-0 bg-transparent border-0 min-w-[140px]"
              )}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(item.id)}
              style={{ height: "140px", width: "140px" }}
            >
              <div
                className={clsx(
                  "w-full h-full flex items-center justify-center rounded-2xl shadow border transition-all overflow-hidden",
                  droppedItems[item.id]
                    ? isCorrect(item.id)
                      ? "border-green-500 bg-green-50"
                      : "border-red-500 bg-red-50"
                    : "border-gray-300 bg-white"
                )}
                style={{
                  minHeight: "120px",
                  minWidth: "120px",
                  height: "100%",
                  width: "100%",
                  position: "relative",
                  backgroundImage: `url(${item.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {droppedItems[item.id] && (
                  <div className="flex absolute inset-0 justify-center items-center">
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => playAudio(droppedItems[item.id])}
                        className="p-2 bg-white bg-opacity-80 rounded-full shadow"
                        aria-label="Reproducir audio"
                        draggable
                        onDragStart={(e) => {
                          setDraggingId(droppedItems[item.id]);
                          e.stopPropagation();
                        }}
                      >
                        <Volume2 className="w-7 h-7 text-blue-700" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => removeAssignment(item.id, e)}
                        className="absolute -top-1 -right-1 p-1 text-red-500 bg-white bg-opacity-90 rounded-full border border-red-200 shadow hover:bg-red-50"
                        aria-label="Quitar audio"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audios: solo icono, compacto, scroll horizontal en mobile */}
      <div className="overflow-x-auto w-full">
        <div className="flex gap-4 px-1 py-2">
          {/* Mostrar audios no asignados */}
          {unassignedAudios.map((item) => (
            <div
              key={item.id}
              draggable
              onDragStart={() => setDraggingId(item.id)}
              className={clsx(
                "flex flex-col justify-center items-center px-3 py-2 cursor-grab",
                "text-blue-800 bg-blue-100 rounded-xl shadow transition hover:bg-blue-200 active:scale-95",
                "min-w-[60px]"
              )}
            >
              <button
                type="button"
                onClick={() => playAudio(item.id)}
                className="focus:outline-none"
                aria-label="Play audio"
              >
                <Volume2 className="w-7 h-7" />
              </button>
              <audio
                ref={(el) => {
                  audioRefs.current[item.id] = el;
                }}
                src={item.audio}
                preload="auto"
                className="hidden"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
