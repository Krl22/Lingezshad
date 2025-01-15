import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Lessons from "./Lessons";
import { Grammar } from "./Grammar";
import { Vocabulary } from "./Vocabulary";

export function LearningTabs() {
  return (
    <Tabs defaultValue="Lessons" className="w-full max-w-4xl mx-auto">
      {/* Tabs List */}
      <TabsList className="grid h-12 grid-cols-3 gap-2 bg-gray-200 rounded-lg dark:bg-gray-700">
        <TabsTrigger
          value="Lessons"
          className="px-4 py-2 text-sm text-center md:text-base"
        >
          Lessons
        </TabsTrigger>
        <TabsTrigger
          value="Vocabulary"
          className="px-4 py-2 text-sm text-center md:text-base"
        >
          Vocabulary
        </TabsTrigger>
        <TabsTrigger
          value="Grammar"
          className="px-4 py-2 text-sm text-center md:text-base"
        >
          Grammar
        </TabsTrigger>
      </TabsList>

      {/* Tabs Content */}
      <TabsContent value="Lessons" className="mt-4">
        <Lessons />
      </TabsContent>
      <TabsContent value="Vocabulary" className="mt-4">
        <Vocabulary />
      </TabsContent>
      <TabsContent value="Grammar" className="mt-4">
        <Grammar />
      </TabsContent>
    </Tabs>
  );
}
