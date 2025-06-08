import MemoryGame from "@/components/exercises/MemoryGame";

const AnimalExercise4 = () => {
  // Adaptar los items para que sean compatibles con la prop cardPairs
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
