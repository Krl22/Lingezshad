import MemoryGame from "@/components/exercises/MemoryGame";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Brain } from "lucide-react";

const ActionExercise4 = () => {
  const cardPairs = [
    {
      value: "run",
      audioUrl: "/actions/run.mp3",
      imageUrl: "/actions/run.jpg",
    },
    {
      value: "swim",
      audioUrl: "/actions/swim.mp3",
      imageUrl: "/actions/swim.jpg",
    },
    {
      value: "dance",
      audioUrl: "/actions/dance.mp3",
      imageUrl: "/actions/dance.jpg",
    },
    {
      value: "cook",
      audioUrl: "/actions/cook.mp3",
      imageUrl: "/actions/cook.jpg",
    },
    {
      value: "read",
      audioUrl: "/actions/read.mp3",
      imageUrl: "/actions/read.jpg",
    },
    {
      value: "sleep",
      audioUrl: "/actions/sleep.mp3",
      imageUrl: "/actions/sleep.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Memory Game - Actions
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Find matching pairs by flipping cards. Click on two cards to see if they match. Remember where each action is located! Try to complete the game with the fewest moves possible."
        icon={<Brain className="w-4 h-4" />}
      />
      
      <MemoryGame
        title="Memory Game - Actions"
        cardPairs={cardPairs}
      />
    </div>
  );
};

export default ActionExercise4;