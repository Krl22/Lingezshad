import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendAdd } from "./FriendAdd";
import { FriendsList } from "./FriendList";
import { FriendRequest } from "./FriendRequest";

export function Friends() {
  return (
    <div className="w-full px-4 mt-20">
      <Tabs defaultValue="Friends" className="w-full max-w-4xl mx-auto">
        {/* Tabs List */}
        <TabsList className="grid h-12 grid-cols-3 gap-2 bg-gray-200 rounded-lg dark:bg-gray-700">
          <TabsTrigger
            value="Friends"
            className="px-4 py-2 text-sm text-center md:text-base"
          >
            Friends
          </TabsTrigger>
          <TabsTrigger
            value="Request"
            className="px-4 py-2 text-sm text-center md:text-base"
          >
            Request
          </TabsTrigger>
          <TabsTrigger
            value="Add"
            className="px-4 py-2 text-sm text-center md:text-base"
          >
            Add
          </TabsTrigger>
        </TabsList>

        {/* Tabs Content */}
        <TabsContent value="Friends" className="mt-4">
          <FriendsList />
        </TabsContent>
        <TabsContent value="Request" className="mt-4">
          <FriendRequest />
        </TabsContent>
        <TabsContent value="Add" className="mt-4">
          <FriendAdd />
        </TabsContent>
      </Tabs>
    </div>
  );
}
