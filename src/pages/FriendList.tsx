import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EllipsisVertical, MessageCircle } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { fetchFriends, handleRemove, Friend } from "@/firebase/friendsService";
import { Loader } from "@/components/uiverse/Loader";

export function FriendsList() {
  const navigate = useNavigate();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const auth = getAuth();
  const userUID = auth.currentUser?.uid;

  const handleOpenChat = (friendEmail: string) => {
    // Redirigir a Messages con el amigo seleccionado
    navigate("/messages", { 
      state: { 
        selectedFriendEmail: friendEmail 
      } 
    });
  };

  useEffect(() => {
    if (userUID) {
      setIsLoading(true);
      fetchFriends(userUID)
        .then((friendsList) => setFriends(friendsList))
        .finally(() => setIsLoading(false));
    }
  }, [userUID]);

  const handleRemoveFriend = async (friendId: string, friendEmail: string) => {
    if (userUID) {
      const success = await handleRemove(userUID, friendId, friendEmail);
      if (success) {
        setFriends((prevFriends) =>
          prevFriends.filter((friend) => friend.id !== friendId)
        );
      }
    }
  };

  return (
    <Card className="w-full max-w-[910px]">
      <CardHeader>
        <CardTitle>Friends List</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader />
          </div>
        ) : friends.length > 0 ? (
          <ul className="space-y-4">
            {friends.map((friend) => (
              <li
                key={friend.id}
                onClick={() => handleOpenChat(friend.email)}
                className="flex justify-between items-center px-1 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {/* Avatar and Info */}
                <div className="flex items-center space-x-4">
                  <Avatar>
                    {friend.avatarUrl ? (
                      <AvatarImage src={friend.avatarUrl} alt={friend.name} />
                    ) : (
                      <AvatarFallback>
                        {friend.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  <div className="w-[120px] lg:w-full">
                    <p className="font-medium">{friend.name}</p>
                    <p className="overflow-hidden text-sm text-muted-foreground text-ellipsis">
                      {friend.email}
                    </p>
                  </div>
                </div>
                {/* Buttons */}
                <div className="flex justify-between w-20">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex justify-center items-center w-9 h-9 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-100">
                          <MessageCircle />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Message</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div className="flex justify-center items-center w-9 h-9 text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-100">
                              <EllipsisVertical />
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>More</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.stopPropagation(); // Evitar que se active el click del li
                          handleRemoveFriend(friend.id, friend.email);
                        }}
                      >
                        Delete Friend
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No friends added yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
