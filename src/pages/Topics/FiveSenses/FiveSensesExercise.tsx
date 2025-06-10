import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Eye } from "lucide-react";

const sensesItems: ExerciseItem[] = [
  {
    id: "see",
    label: "See",
    image: "/fivesenses/see.jpg",
  },
  {
    id: "hear",
    label: "Hear",
    image: "/fivesenses/hear.jpg",
  },
  {
    id: "smell",
    label: "Smell",
    image: "/fivesenses/smell.jpg",
  },
  {
    id: "taste",
    label: "Taste",
    image: "/fivesenses/taste.jpg",
  },
  {
    id: "touch",
    label: "Touch",
    image: "/fivesenses/touch.jpg",
  },
];

export default function FiveSensesTopic() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Match the senses with their actions
      </h2>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="First click on a sense name above, then click on the matching picture below to connect them. The selected name will be highlighted in blue."
        icon={<Eye className="w-4 h-4" />}
      />
      
      <DragAndDropExercise items={sensesItems} />
    </div>
  );
}