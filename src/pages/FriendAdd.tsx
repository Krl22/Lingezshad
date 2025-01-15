import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { handleAddFriend } from "@/firebase/friendsService";

export function FriendAdd() {
  const [searchBy, setSearchBy] = useState("nickname");
  const [searchInput, setSearchInput] = useState("");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add a Friend</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Label>Search By</Label>
          <Select value={searchBy} onValueChange={setSearchBy}>
            <SelectTrigger>
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nickname">Nickname</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>
          <Label>{searchBy === "nickname" ? "Nickname" : "Email"}</Label>
          <Input
            placeholder={`Enter friend's ${searchBy}`}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={() => handleAddFriend(searchBy, searchInput)}>
          Send Request
        </Button>
      </CardFooter>
    </Card>
  );
}
