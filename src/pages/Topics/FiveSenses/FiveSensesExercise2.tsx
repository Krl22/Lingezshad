import { FillInTheBlankExercise } from "@/components/exercises/FillInTheBlankExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { PenTool } from "lucide-react";

const FiveSensesExercise2 = () => {
  const sentences = [
    {
      id: "1",
      sentence: "I can ___ the beautiful sunset with my eyes.",
      answer: "see",
      hint: "This sense uses your eyes to observe things.",
    },
    {
      id: "2",
      sentence: "She can ___ the music playing in the background.",
      answer: "hear",
      hint: "This sense uses your ears to detect sounds.",
    },
    {
      id: "3",
      sentence: "We can ___ the delicious aroma of fresh bread.",
      answer: "smell",
      hint: "This sense uses your nose to detect odors.",
    },
    {
      id: "4",
      sentence: "He can ___ the sweet flavor of the chocolate.",
      answer: "taste",
      hint: "This sense uses your tongue to detect flavors.",
    },
    {
      id: "5",
      sentence: "You can ___ the soft texture of the fabric.",
      answer: "touch",
      hint: "This sense uses your skin to feel textures and temperatures.",
    },
    {
      id: "6",
      sentence: "The baby can ___ the colorful toys above the crib.",
      answer: "see",
      hint: "This sense helps us observe colors and shapes.",
    },
    {
      id: "7",
      sentence: "We can ___ the birds singing in the morning.",
      answer: "hear",
      hint: "This sense helps us detect different sounds and voices.",
    },
    {
      id: "8",
      sentence: "She can ___ the warm sand between her fingers.",
      answer: "touch",
      hint: "This sense helps us feel different textures and temperatures.",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Fill in the Blanks - Five Senses
      </h1>
      
      <InstructionsBox
        title="📝 Show Instructions"
        instructions="Read each sentence carefully and type the correct sense word in the blank space. Think about which of the five senses (see, hear, smell, taste, touch) fits best in each sentence. Click 'Show Hint' if you need extra help!"
        icon={<PenTool className="w-4 h-4" />}
      />
      
      <FillInTheBlankExercise items={sentences} />
    </div>
  );
};

export default FiveSensesExercise2;