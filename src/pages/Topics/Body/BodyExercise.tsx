import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { User } from "lucide-react";

const bodyItems: ExerciseItem[] = [
  {
    id: "head",
    label: "Head",
    image: "/body/head.jpg",
  },
  {
    id: "hand",
    label: "Hand",
    image: "/body/hand.jpg",
  },
  {
    id: "foot",
    label: "Foot",
    image: "/body/foot.jpg",
  },
  {
    id: "eye",
    label: "Eye",
    image: "/body/eye.jpg",
  },
  {
    id: "nose",
    label: "Nose",
    image: "/body/nose.jpg",
  },
  {
    id: "mouth",
    label: "Mouth",
    image: "/body/mouth.jpg",
  },
];

export default function BodyTopic() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Match the body parts with their names
      </h2>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="First click on a body part name above, then click on the matching picture below to connect them. The selected name will be highlighted in blue."
        icon={<User className="w-4 h-4" />}
      />
      
      <DragAndDropExercise items={bodyItems} />
    </div>
  );
}