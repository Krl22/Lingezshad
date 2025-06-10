import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Volume2 } from "lucide-react";

const FiveSensesExercise3 = () => {
  const items = [
    {
      id: "see",
      image: "/fivesenses/see.jpg",
      audio: "/fivesenses/see.mp3",
    },
    {
      id: "hear",
      image: "/fivesenses/hear.jpg",
      audio: "/fivesenses/hear.mp3",
    },
    {
      id: "smell",
      image: "/fivesenses/smell.jpg",
      audio: "/fivesenses/smell.mp3",
    },
    {
      id: "taste",
      image: "/fivesenses/taste.jpg",
      audio: "/fivesenses/taste.mp3",
    },
    {
      id: "touch",
      image: "/fivesenses/touch.jpg",
      audio: "/fivesenses/touch.mp3",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Match the Sound to the Sense
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Listen to each sense word by clicking the play button, then click on the matching picture. Use your ears to identify which sense each audio represents."
        icon={<Volume2 className="w-4 h-4" />}
      />
      
      <AudioToImageMatchExercise items={items} />
    </div>
  );
};

export default FiveSensesExercise3;