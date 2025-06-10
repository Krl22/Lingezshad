import { FillInTheBlankExercise } from "@/components/exercises/FillInTheBlankExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { PenTool } from "lucide-react";

const ActionExercise2 = () => {
  const sentences = [
    {
      id: "1",
      sentence: "She ___ in the pool every morning.",
      answer: "swims",
      hint: "This action is done in water using arms and legs.",
    },
    {
      id: "2",
      sentence: "He ___ books before bedtime.",
      answer: "reads",
      hint: "This quiet activity involves looking at words on pages.",
    },
    {
      id: "3",
      sentence: "They ___ to their favorite music.",
      answer: "dance",
      hint: "This rhythmic activity is often done to music.",
    },
    {
      id: "4",
      sentence: "Mom ___ dinner in the kitchen.",
      answer: "cooks",
      hint: "This activity involves preparing food with heat.",
    },
    {
      id: "5",
      sentence: "The athlete ___ around the track.",
      answer: "runs",
      hint: "This fast movement is done with legs, faster than walking.",
    },
    {
      id: "6",
      sentence: "The baby ___ peacefully in the crib.",
      answer: "sleeps",
      hint: "This restful activity is done with closed eyes at night.",
    },
    {
      id: "7",
      sentence: "She ___ her homework at the desk.",
      answer: "writes",
      hint: "This action involves using a pen or pencil on paper.",
    },
    {
      id: "8",
      sentence: "The children ___ in the playground.",
      answer: "play",
      hint: "This fun activity is what kids do for entertainment.",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Fill in the Blanks - Actions
      </h1>
      
      <InstructionsBox
        title="📝 Show Instructions"
        instructions="Read each sentence carefully and type the correct action word in the blank space. Use the clues in each sentence to help you identify the right action. Click 'Show Hint' if you need extra help! Try to get all answers correct for a perfect score."
        icon={<PenTool className="w-4 h-4" />}
      />
      
      <FillInTheBlankExercise items={sentences} />
    </div>
  );
};

export default ActionExercise2;