import MemoryGame from "@/components/exercises/MemoryGame";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Brain } from "lucide-react";

const FiveSensesExercise4 = () => {
  const cardPairs = [
    {
      value: "see",
      audioUrl: "/fivesenses/see.mp3",
      imageUrl: "/fivesenses/see.jpg",
    },
    {
      value: "hear",
      audioUrl: "/fivesenses/hear.mp3",
      imageUrl: "/fivesenses/hear.jpg",
    },
    {
      value: "smell",
      audioUrl: "/fivesenses/smell.mp3",
      imageUrl: "/fivesenses/smell.jpg",
    },
    {
      value: "taste",
      audioUrl: "/fivesenses/taste.mp3",
      imageUrl: "/fivesenses/taste.jpg",
    },
    {
      value: "touch",
      audioUrl: "/fivesenses/touch.mp3",
      imageUrl: "/fivesenses/touch.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center">
        Memory Game - Five Senses
      </h1>

      <InstructionsBox
        title="Show Instructions"
        instructions="Find matching pairs by flipping cards. Click on two cards to see if they match. Remember where each sense is located! Try to complete the game with the fewest moves possible."
        icon={<Brain className="w-4 h-4" />}
      />

      <MemoryGame title="Memory Game - 5 senses" cardPairs={cardPairs} />
    </div>
  );
};

export default FiveSensesExercise4;
