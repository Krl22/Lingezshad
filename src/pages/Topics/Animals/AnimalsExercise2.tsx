import { FillInTheBlankExercise } from "@/components/exercises/FillInTheBlankExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { PenTool } from "lucide-react";

const AnimalExercise2 = () => {
  const sentences = [
    {
      id: "1",
      sentence: "The ___ is known as the king of the jungle.",
      answer: "lion",
      hint: "This big cat has a magnificent mane and roars loudly.",
    },
    {
      id: "2",
      sentence: "A ___ has a long trunk and big ears.",
      answer: "elephant",
      hint: "The largest land animal, it uses its nose to grab things.",
    },
    {
      id: "3",
      sentence: "The ___ jumps from tree to tree in the forest.",
      answer: "monkey",
      hint: "This playful animal loves bananas and swings on branches.",
    },
    {
      id: "4",
      sentence: "A ___ can swim and quack loudly.",
      answer: "duck",
      hint: "This bird has webbed feet and loves water.",
    },
    {
      id: "5",
      sentence: "The ___ is a fierce predator with orange and black stripes.",
      answer: "tiger",
      hint: "Similar to a lion but with distinctive striped pattern.",
    },
    {
      id: "6",
      sentence: "A ___ says 'meow' and loves to chase mice.",
      answer: "cat",
      hint: "This common pet purrs when happy and has whiskers.",
    },
    {
      id: "7",
      sentence: "The ___ has black and white stripes and looks like a horse.",
      answer: "zebra",
      hint: "This African animal is like a horse but with a unique pattern.",
    },
    {
      id: "8",
      sentence: "A ___ is man's best friend and barks to protect its family.",
      answer: "dog",
      hint: "This loyal pet wags its tail when excited.",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Fill in the Blanks - Animals
      </h1>
      
      <InstructionsBox
        title="📝 Show Instructions"
        instructions="Read each sentence carefully and type the correct animal name in the blank space. Use the clues in each sentence to help you identify the right animal. Click 'Show Hint' if you need extra help! Try to get all answers correct for a perfect score."
        icon={<PenTool className="w-4 h-4" />}
      />
      
      <FillInTheBlankExercise items={sentences} />
    </div>
  );
};

export default AnimalExercise2;
