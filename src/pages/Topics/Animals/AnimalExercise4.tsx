import MemoryGame from "@/components/exercises/MemoryGame";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { Brain } from "lucide-react";

const AnimalExercise4 = () => {
  const cardPairs = [
    {
      value: "lion",
      audioUrl: "/animals/lion.mp3",
      imageUrl: "/animals/lion.jpg",
    },
    {
      value: "elephant",
      audioUrl: "/animals/elephant.mp3",
      imageUrl: "/animals/elephant.jpg",
    },
    {
      value: "monkey",
      audioUrl: "/animals/monkey.mp3",
      imageUrl: "/animals/monkey.jpg",
    },
    {
      value: "tiger",
      audioUrl: "/animals/tiger.mp3",
      imageUrl: "/animals/tiger.jpg",
    },
    {
      value: "cat",
      audioUrl: "/animals/cat.mp3",
      imageUrl: "/animals/cat.jpg",
    },
    {
      value: "duck",
      audioUrl: "/animals/duck.mp3",
      imageUrl: "/animals/duck.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Memory Game - Animals
      </h1>
      
      <InstructionsBox
        title="Show Instructions"
        instructions="Find matching pairs by flipping cards. Click on two cards to see if they match. Remember where each animal is located! Try to complete the game with the fewest moves possible."
        icon={<Brain className="w-4 h-4" />}
      />
      
      <MemoryGame
        title="Memory Game - Animals"
        cardPairs={cardPairs}
      />
    </div>
  );
};

export default AnimalExercise4;
