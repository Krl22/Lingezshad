import MemoryGame from "@/components/exercises/MemoryGame";

const AnimalExercise4 = () => {
  // Adaptar los items para que sean compatibles con la prop cardPairs
  const cardPairs = [
    {
      value: "lion",
      audioUrl: "/audio/lion.mp3",
      imageUrl: "/images/animals/lion.jpg",
    },
    {
      value: "elephant",
      audioUrl: "/audio/elephant.mp3",
      imageUrl: "/images/animals/elephant.jpg",
    },
    {
      value: "monkey",
      audioUrl: "/audio/monkey.mp3",
      imageUrl: "/images/animals/monkey.jpg",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Memory Game - Animals
      </h1>
      <MemoryGame
        title="Memory Game - Animals"
        cardPairs={cardPairs}
      />
    </div>
  );
};

export default AnimalExercise4;
