import { useState } from "react";
import BodyExercise from "./BodyExercise";
import BodyExercise2 from "./BodyExercise2";
import BodyExercise3 from "./BodyExercise3";
import BodyExercise4 from "./BodyExercise4";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const exercises = [
  {
    name: "Drag & Drop",
    component: <BodyExercise />,
    value: "ex1",
  },
  {
    name: "Fill Blanks",
    component: <BodyExercise2 />,
    value: "ex2",
  },
  {
    name: "Audio Match",
    component: <BodyExercise3 />,
    value: "ex3",
  },
  {
    name: "Memory",
    component: <BodyExercise4 />,
    value: "ex4",
  },
];

const Body = () => {
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

export default Body;