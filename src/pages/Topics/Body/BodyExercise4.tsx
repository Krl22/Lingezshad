import MemoryGame from "@/components/exercises/MemoryGame";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Brain } from "lucide-react";

const BodyExercise4 = () => {
  const cardPairs = [
    {
      value: "head",
      audioUrl: "/body/head.mp3",
      imageUrl: "/body/head.jpg",
    },
    {
      value: "hand",
      audioUrl: "/body/hand.mp3",
      imageUrl: "/body/hand.jpg",
    },
    {
      value: "foot",
      audioUrl: "/body/foot.mp3",
      imageUrl: "/body/foot.jpg",
    },
    {
      value: "eye",
      audioUrl: "/body/eye.mp3",
      imageUrl: "/body/eye.jpg",
    },
    {
      value: "nose",
      audioUrl: "/body/nose.mp3",
      imageUrl: "/body/nose.jpg",
    },
    {
      value: "mouth",
      audioUrl: "/body/mouth.mp3",
      imageUrl: "/body/mouth.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Memory Game - Body Parts
      </h1>

      <InstructionsBox
        title="Show Instructions"
        instructions="Find matching pairs by flipping cards. Click on two cards to see if they match. Remember where each body part is located! Try to complete the game with the fewest moves possible."
        icon={<Brain className="w-4 h-4" />}
      />

      <MemoryGame title="Memory Game - Body" cardPairs={cardPairs} />
    </div>
  );
};

export default BodyExercise4;
