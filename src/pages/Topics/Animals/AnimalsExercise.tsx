import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { MousePointer } from "lucide-react";

const animalItems: ExerciseItem[] = [
  {
    id: "cat",
    label: "Cat",
    image: "/animals/cat.jpg",
  },
  {
    id: "elephant",
    label: "Elephant",
    image: "/animals/elephant.jpg",
  },
  {
    id: "lion",
    label: "Lion",
    image: "/animals/lion.jpg",
  },
  {
    id: "zebra",
    label: "Zebra",
    image: "/animals/zebra.jpg",
  },
  {
    id: "tiger",
    label: "Tiger",
    image: "/animals/tiger.jpg",
  },
  {
    id: "monkey",
    label: "Monkey",
    image: "/animals/monkey.jpg",
  },
];

export default function AnimalsTopic() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Match the animals with their names
      </h2>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="First click on an animal name above, then click on the matching picture below to connect them. The selected name will be highlighted in blue."
        icon={<MousePointer className="w-4 h-4" />}
      />
      
      <DragAndDropExercise items={animalItems} />
    </div>
  );
}
