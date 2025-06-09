import { useState } from "react";
import AnimalsTopic from "./AnimalsExercise";
import AnimalExercise2 from "./AnimalsExercise2";
import AnimalExercise3 from "./AnimalsExercise3";
import AnimalExercise4 from "./AnimalExercise4";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const exercises = [
  {
    name: "Drag & Drop",
    component: <AnimalsTopic />,
    value: "ex1",
  },
  {
    name: "Fill Blanks",
    component: <AnimalExercise2 />,
    value: "ex2",
  },
  {
    name: "Audio Match",
    component: <AnimalExercise3 />,
    value: "ex3",
  },
  {
    name: "Memory",
    component: <AnimalExercise4 />,
    value: "ex4",
  },
];

const Animals = () => {
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

export default Animals;
