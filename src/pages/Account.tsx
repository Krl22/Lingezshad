import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseconfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUserRanking } from "@/firebase/createUserDoc";
import { Loader } from "@/components/uiverse/Loader";

import image1 from "../assets/pfp.jpg";
import image2 from "../assets/pfp2.jpg";
import image3 from "../assets/pfp3.jpg";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

interface UserData {
  email: string;
  points: number;
  level: number;
  lessonsCompleted: string[];
  rewards: { name: string; achievedAt: string }[];
  score: number;
  friends: string[];
  requests: string[];
  ranking: number;
  nickname?: string;
  photoURL?: string;
}

const Account = () => {
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          if (user.email) {
            await updateUserRanking(userRef, user.email);
          } else {
            console.error("User email is null.");
          }

          const data = userDoc.data() as UserData;
          setUserData(data);
          setNickname(data.nickname || "");
          setProfileImage(data.photoURL || image1);
        } else {
          console.error("No such document!");
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleNicknameChange = async () => {
    if (currentUser && newNickname.trim()) {
      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        nickname: newNickname,
      });
      setNickname(newNickname);
      setNewNickname("");
    }
  };

  const handleProfileImageChange = (image: string) => {
    setProfileImage(image);
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      updateDoc(userDocRef, {
        photoURL: image,
      });
    }
  };

  const availableImages = [image1, image2, image3];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-background">
        <Loader />
      </div>
    );
  }

  return (
    <div className="container px-4 py-8 mx-auto my-14 max-w-7xl">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Your Profile</h1>
          <p className="text-muted-foreground">
            Manage your account settings and view your progress
          </p>
        </div>

        {currentUser && userData && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
            {/* Profile Card */}
            <Card className="lg:col-span-1">
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col gap-4 items-center">
                  <Avatar className="w-32 h-32 border-4 border-primary">
                    <AvatarImage src={profileImage} />
                    <AvatarFallback>
                      {currentUser.displayName?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              Change Avatar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Choose an Avatar</DialogTitle>
                              <DialogDescription>
                                Select from our collection or upload your own
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid grid-cols-3 gap-4 py-4">
                              {availableImages.map((image, index) => (
                                <button
                                  key={index}
                                  onClick={() =>
                                    handleProfileImageChange(image)
                                  }
                                  className="overflow-hidden rounded-full transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                >
                                  <img
                                    src={image}
                                    alt={`Avatar ${index + 1}`}
                                    className="object-cover w-full h-auto aspect-square"
                                  />
                                </button>
                              ))}
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change your profile picture</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Display Name
                    </p>
                    <p className="font-medium">
                      {currentUser.displayName || "Not set"}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Email
                    </p>
                    <p className="font-medium">{currentUser.email}</p>
                    <Badge
                      variant={
                        currentUser.emailVerified ? "default" : "secondary"
                      }
                      className="mt-1"
                    >
                      {currentUser.emailVerified ? "Verified" : "Unverified"}
                    </Badge>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">
                      Current Nickname
                    </p>
                    <p className="font-medium">{nickname || "Not set"}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Change Nickname
                    </p>
                    <div className="flex gap-2">
                      <Input
                        type="text"
                        value={newNickname}
                        onChange={(e) => setNewNickname(e.target.value)}
                        placeholder="Enter new nickname"
                        className="flex-1"
                      />
                      <Button
                        onClick={handleNicknameChange}
                        disabled={!newNickname.trim()}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress and Stats */}
            <div className="space-y-6 lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Your Progress</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <p className="text-sm font-medium text-muted-foreground">
                        Level
                      </p>
                      <Badge variant="outline">Level {userData.level}</Badge>
                    </div>
                    <Progress
                      value={(userData.points % 1000) / 10}
                      className="h-2"
                    />
                    <p className="text-sm text-muted-foreground">
                      {userData.points % 1000}/1000 points to next level
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Points
                    </p>
                    <p className="text-2xl font-bold">{userData.points}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Global Ranking
                    </p>
                    <p className="text-2xl font-bold">#{userData.ranking}</p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Lessons Completed
                    </p>
                    <p className="text-2xl font-bold">
                      {userData.lessonsCompleted.length}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Total Score
                    </p>
                    <p className="text-2xl font-bold">{userData.score}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Rewards and Friends */}
              <div className="grid gap-6 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Your Rewards</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userData.rewards.length > 0 ? (
                      <div className="space-y-4">
                        {userData.rewards.map((reward, index) => (
                          <div
                            key={index}
                            className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                          >
                            <div>
                              <p className="font-medium">{reward.name}</p>
                              <p className="text-sm text-muted-foreground">
                                Achieved on{" "}
                                {new Date(
                                  reward.achievedAt
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Badge variant="secondary">Earned</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center py-8 text-center">
                        <p className="text-muted-foreground">
                          You haven't earned any rewards yet
                        </p>
                        <Button variant="link" className="mt-2">
                          View available rewards
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Friends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {userData.friends.length > 0 ? (
                      <div className="space-y-3">
                        {userData.friends.map((friend, index) => (
                          <div
                            key={index}
                            className="flex gap-3 items-center p-3 rounded-lg bg-muted/50"
                          >
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>
                                {friend.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <p className="font-medium">{friend}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col justify-center items-center py-8 text-center">
                        <p className="text-muted-foreground">
                          You haven't added any friends yet
                        </p>
                        <Button variant="link" className="mt-2">
                          Find friends to add
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Account;
