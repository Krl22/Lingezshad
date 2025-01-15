import { useState, useEffect } from "react";
import { auth } from "@/firebase/firebaseconfig";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Check, X } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  handleAccept,
  handleReject,
  fetchRequests,
} from "@/firebase/friendsService";
import { Loader } from "@/components/uiverse/Loader"; // Importa el componente Loader

// Tipo de FriendRequest
type FriendRequest = {
  email: string;
};

export function FriendRequest() {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Estado para el loader
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchRequests(setRequests).finally(() => setIsLoading(false));
    }
  }, [user]);

  return (
    <Card className="w-full max-w-[910px]">
      <CardHeader>
        <CardTitle>Friend Requests</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          // Loader mientras carga
          <div className="flex items-center justify-center h-32">
            <Loader />
          </div>
        ) : requests.length > 0 ? (
          <ul className="space-y-4">
            {requests.map((request) => (
              <li
                key={request.email}
                className="flex items-center justify-between px-1 rounded-lg cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-100"
              >
                {/* Avatar and Info */}
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      {request.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="w-[120px] lg:w-full">
                    <p className="overflow-hidden font-medium text-ellipsis">
                      {request.email}
                    </p>
                  </div>
                </div>
                {/* Action Icons */}
                <div className="flex space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-center text-gray-800 bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-700 dark:text-gray-100"
                          onClick={() =>
                            handleAccept(request.email, setRequests)
                          }
                        >
                          <Check />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Accept</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="flex items-center justify-center text-gray-800 bg-gray-200 rounded-full w-9 h-9 dark:bg-gray-700 dark:text-gray-100"
                          onClick={() =>
                            handleReject(request.email, setRequests)
                          }
                        >
                          <X />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reject</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground">No friend requests yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
