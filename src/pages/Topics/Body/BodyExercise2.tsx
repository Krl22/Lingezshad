import { FillInTheBlankExercise } from "@/components/exercises/FillInTheBlankExercise";
import { InstructionsBox } from "@/components/exercises/InstructionsBox";
import { PenTool } from "lucide-react";

const BodyExercise2 = () => {
  const sentences = [
    {
      id: "1",
      sentence: "I wear a hat on my ___.",
      answer: "head",
      hint: "This is the top part of your body where your brain is.",
    },
    {
      id: "2",
      sentence: "She waves with her ___.",
      answer: "hand",
      hint: "This body part has five fingers and is used to grab things.",
    },
    {
      id: "3",
      sentence: "He puts on shoes to protect his ___.",
      answer: "foot",
      hint: "This body part is at the end of your leg and has toes.",
    },
    {
      id: "4",
      sentence: "I can see the rainbow with my ___.",
      answer: "eye",
      hint: "This body part is used for seeing and comes in pairs.",
    },
    {
      id: "5",
      sentence: "She smells the flowers with her ___.",
      answer: "nose",
      hint: "This body part is in the center of your face and is used for smelling.",
    },
    {
      id: "6",
      sentence: "He brushes his teeth and cleans his ___.",
      answer: "mouth",
      hint: "This body part is used for eating, speaking, and smiling.",
    },
    {
      id: "7",
      sentence: "The baby touches the toy with her ___.",
      answer: "hand",
      hint: "This body part is used to touch and hold objects.",
    },
    {
      id: "8",
      sentence: "I close my ___ when I sleep.",
      answer: "eye",
      hint: "This body part has eyelids that can open and close.",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="mb-4 text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Fill in the Blanks - Body Parts
      </h1>
      
      <InstructionsBox
        title="📝 Show Instructions"
        instructions="Read each sentence carefully and type the correct body part in the blank space. Think about which part of the body fits best in each sentence. Click 'Show Hint' if you need extra help!"
        icon={<PenTool className="w-4 h-4" />}
      />
      
      <FillInTheBlankExercise items={sentences} />
    </div>
  );
};

export default BodyExercise2;