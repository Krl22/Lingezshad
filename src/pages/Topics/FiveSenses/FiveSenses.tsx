import { useState } from "react";
import FiveSensesExercise from "./FiveSensesExercise";
import FiveSensesExercise2 from "./FiveSensesExercise2";
import FiveSensesExercise3 from "./FiveSensesExercise3";
import FiveSensesExercise4 from "./FiveSensesExercise4";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const exercises = [
  {
    name: "Drag & Drop",
    component: <FiveSensesExercise />,
    value: "ex1",
  },
  {
    name: "Fill Blanks",
    component: <FiveSensesExercise2 />,
    value: "ex2",
  },
  {
    name: "Audio Match",
    component: <FiveSensesExercise3 />,
    value: "ex3",
  },
  {
    name: "Memory",
    component: <FiveSensesExercise4 />,
    value: "ex4",
  },
];

const FiveSenses = () => {
  const [activeTab, setActiveTab] = useState(exercises[0].value);

  return (
    <div className="p-4 mx-auto my-20 max-w-2xl">
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4 w-full">
          {exercises.map((ex) => (
            <TabsTrigger key={ex.value} value={ex.value}>
              {ex.name}
            </TabsTrigger>
          ))}
        </TabsList>
        {exercises.map((ex) => (
          <TabsContent key={ex.value} value={ex.value}>
            {ex.component}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default FiveSenses;
