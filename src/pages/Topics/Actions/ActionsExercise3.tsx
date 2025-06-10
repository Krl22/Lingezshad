import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Volume2 } from "lucide-react";

const ActionExercise3 = () => {
  const items = [
    {
      id: "run",
      image: "/actions/run.jpg",
      audio: "/actions/run.mp3",
    },
    {
      id: "swim",
      image: "/actions/swim.jpg",
      audio: "/actions/swim.mp3",
    },
    {
      id: "dance",
      image: "/actions/dance.jpg",
      audio: "/actions/dance.mp3",
    },
    {
      id: "cook",
      image: "/actions/cook.jpg",
      audio: "/actions/cook.mp3",
    },
    {
      id: "read",
      image: "/actions/read.jpg",
      audio: "/actions/read.mp3",
    },
    {
      id: "sleep",
      image: "/actions/sleep.jpg",
      audio: "/actions/sleep.mp3",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Match the Sound to the Action
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Listen to each action sound by clicking the play button, then click on the matching picture. Use your ears to identify which action makes each sound."
        icon={<Volume2 className="w-4 h-4" />}
      />
      
      <AudioToImageMatchExercise items={items} />
    </div>
  );
};

export default ActionExercise3;