import { useState } from "react";
import ActionsTopic from "./ActionsExercise";
import ActionExercise2 from "./ActionsExercise2";
import ActionExercise3 from "./ActionsExercise3";
import ActionExercise4 from "./ActionExercise4";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const exercises = [
  {
    name: "Drag & Drop",
    component: <ActionsTopic />,
    value: "ex1",
  },
  {
    name: "Fill Blanks",
    component: <ActionExercise2 />,
    value: "ex2",
  },
  {
    name: "Audio Match",
    component: <ActionExercise3 />,
    value: "ex3",
  },
  {
    name: "Memory",
    component: <ActionExercise4 />,
    value: "ex4",
  },
];

const Actions = () => {
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

export default Actions;
