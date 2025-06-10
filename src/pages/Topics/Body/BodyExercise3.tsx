import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Volume2 } from "lucide-react";

const BodyExercise3 = () => {
  const items = [
    {
      id: "head",
      image: "/body/head.jpg",
      audio: "/body/head.mp3",
    },
    {
      id: "hand",
      image: "/body/hand.jpg",
      audio: "/body/hand.mp3",
    },
    {
      id: "foot",
      image: "/body/foot.jpg",
      audio: "/body/foot.mp3",
    },
    {
      id: "eye",
      image: "/body/eye.jpg",
      audio: "/body/eye.mp3",
    },
    {
      id: "nose",
      image: "/body/nose.jpg",
      audio: "/body/nose.mp3",
    },
    {
      id: "mouth",
      image: "/body/mouth.jpg",
      audio: "/body/mouth.mp3",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Match the Sound to the Body Part
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Listen to each body part word by clicking the play button, then click on the matching picture. Use your ears to identify which body part each audio represents."
        icon={<Volume2 className="w-4 h-4" />}
      />
      
      <AudioToImageMatchExercise items={items} />
    </div>
  );
};

export default BodyExercise3;