import { FillInTheBlankExercise } from "@/components/exercises/FillInTheBlankExercise";

const AnimalExercise2 = () => {
  const sentences = [
    {
      id: "1",
      sentence: "The ___ is known as the king of the jungle.",
      answer: "lion",
    },
    {
      id: "2",
      sentence: "A ___ has a long trunk and big ears.",
      answer: "elephant",
    },
    {
      id: "3",
      sentence: "The ___ jumps from tree to tree in the forest.",
      answer: "monkey",
    },
    {
      id: "4",
      sentence: "A ___ can swim and quack loudly.",
      answer: "duck",
    },
    {
      id: "5",
      sentence: "The ___ is a fierce animal with sharp teeth.",
      answer: "tiger",
    },
    {
      id: "6",
      sentence: "A ___ says “meow” and loves to chase mice.",
      answer: "cat",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-6 text-2xl font-bold text-center">
        Fill in the Blanks - Animals
      </h1>
      <FillInTheBlankExercise items={sentences} />
    </div>
  );
};

export default AnimalExercise2;
