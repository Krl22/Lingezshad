import { AudioToImageMatchExercise } from "@/components/exercises/AudioToImageMatchExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Volume2 } from "lucide-react";

const AnimalExercise3 = () => {
  const items = [
    {
      id: "lion",
      image: "/animals/lion.jpg",
      audio: "/animals/lion.mp3",
    },
    {
      id: "elephant",
      image: "/animals/elephant.jpg",
      audio: "/animals/elephant.mp3",
    },
    {
      id: "monkey",
      image: "/animals/monkey.jpg",
      audio: "/animals/monkey.mp3",
    },
    {
      id: "duck",
      image: "/animals/duck.jpg",
      audio: "/animals/duck.mp3",
    },
    {
      id: "tiger",
      image: "/animals/tiger.jpg",
      audio: "/animals/tiger.mp3",
    },
    {
      id: "cat",
      image: "/animals/cat.jpg",
      audio: "/animals/cat.mp3",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Match the Sound to the Animal
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Listen to each animal sound by clicking the play button, then click on the matching picture. Use your ears to identify which animal makes each sound."
        icon={<Volume2 className="w-4 h-4" />}
      />
      
      <AudioToImageMatchExercise items={items} />
    </div>
  );
};

export default AnimalExercise3;
