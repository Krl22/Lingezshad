import {
  DragAndDropExercise,
  ExerciseItem,
} from "@/components/exercises/DragDropExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { MousePointer } from "lucide-react";

const actionItems: ExerciseItem[] = [
  {
    id: "run",
    label: "Run",
    image: "/actions/run.jpg",
  },
  {
    id: "swim",
    label: "Swim",
    image: "/actions/swim.jpg",
  },
  {
    id: "dance",
    label: "Dance",
    image: "/actions/dance.jpg",
  },
  {
    id: "read",
    label: "Read",
    image: "/actions/read.jpg",
  },
  {
    id: "cook",
    label: "Cook",
    image: "/actions/cook.jpg",
  },
  {
    id: "sleep",
    label: "Sleep",
    image: "/actions/sleep.jpg",
  },
];

export default function ActionsTopic() {
  return (
    <div className="p-4">
      <h2 className="mb-4 text-xl font-bold text-center">
        Match the actions with their names
      </h2>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="First click on an action name above, then click on the matching picture below to connect them. The selected name will be highlighted in blue."
        icon={<MousePointer className="w-4 h-4" />}
      />
      
      <DragAndDropExercise items={actionItems} />
    </div>
  );
}