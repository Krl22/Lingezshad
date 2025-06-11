import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseconfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { updateUserRanking } from "@/firebase/createUserDoc";
import { Loader } from "@/components/uiverse/Loader";

// Importar el servicio de avatares
import {
  generateAvatarUrl,
  generateUserSeed,
  getDefaultAvatar,
  AVATAR_STYLES,
  AvatarStyle,
} from "@/firebase/avatarService";

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
  // Nuevos campos para DiceBear
  avatarSeed?: string;
  avatarStyle?: string;
}

const Account = () => {
  const [nickname, setNickname] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  // Nuevos estados para DiceBear
  const [selectedStyle, setSelectedStyle] = useState("avataaars");
  const [avatarSeed, setAvatarSeed] = useState("");
  const [isAvatarDialogOpen, setIsAvatarDialogOpen] = useState(false);

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
          }

          const data = userDoc.data() as UserData;
          setUserData(data);
          setNickname(data.nickname || "");

          // Configurar avatar
          const userSeed = data.avatarSeed || generateUserSeed(user.uid);
          const userStyle = data.avatarStyle || "avataaars";

          setAvatarSeed(userSeed);
          setSelectedStyle(userStyle);
          setProfileImage(generateAvatarUrl(userSeed, userStyle));

          // Si es la primera vez, guardar la semilla
          if (!data.avatarSeed) {
            await updateDoc(userRef, {
              avatarSeed: userSeed,
              avatarStyle: userStyle,
            });
          }
        }
        setLoading(false);
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Función para cambiar el estilo del avatar
  const handleStyleChange = async (newStyle: string) => {
    if (currentUser && avatarSeed) {
      const newAvatarUrl = generateAvatarUrl(avatarSeed, newStyle);
      setSelectedStyle(newStyle);
      setProfileImage(newAvatarUrl);

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        avatarStyle: newStyle,
        photoURL: newAvatarUrl,
      });
    }
  };

  // Función para generar nuevo avatar (nueva semilla)
  const generateNewAvatar = async () => {
    if (currentUser) {
      const newSeed = generateUserSeed(
        currentUser.uid,
        Math.random().toString(36)
      );
      const newAvatarUrl = generateAvatarUrl(newSeed, selectedStyle);

      setAvatarSeed(newSeed);
      setProfileImage(newAvatarUrl);

      const userDocRef = doc(db, "users", currentUser.uid);
      await updateDoc(userDocRef, {
        avatarSeed: newSeed,
        photoURL: newAvatarUrl,
      });
    }
  };

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
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsAvatarDialogOpen(true)}
                        >
                          Change Avatar
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Change your profile picture</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  {/* Dialog separado */}
                  <Dialog open={isAvatarDialogOpen} onOpenChange={setIsAvatarDialogOpen}>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Personaliza tu Avatar</DialogTitle>
                        <DialogDescription>
                          Elige un estilo y genera diferentes variaciones
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4 space-y-6">
                        {/* Avatar actual */}
                        <div className="flex flex-col gap-3 items-center">
                          <Avatar className="w-32 h-32 border-2 border-primary">
                            <AvatarImage src={profileImage} />
                            <AvatarFallback>
                              {currentUser.displayName?.charAt(0) || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <p className="text-sm font-medium">Tu Avatar Actual</p>
                        </div>

                        {/* Selector de estilo */}
                        <div className="space-y-3">
                          <p className="text-sm font-medium">Estilo de Avatar</p>
                          <div className="grid grid-cols-2 gap-2">
                            {Object.entries(AVATAR_STYLES).map(([key, style]) => (
                              <button
                                key={key}
                                onClick={() => handleStyleChange(key)}
                                className={`p-3 text-sm rounded-lg border-2 transition-all hover:scale-105 ${
                                  selectedStyle === key
                                    ? 'border-primary bg-primary/10 text-primary font-medium'
                                    : 'border-border bg-background hover:bg-muted'
                                }`}
                              >
                                {style.displayName}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Generador de variaciones */}
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <p className="text-sm font-medium">Generar Variaciones</p>
                            <Badge variant="outline" className="text-xs">
                              Estilo: {AVATAR_STYLES[selectedStyle]?.displayName}
                            </Badge>
                          </div>
                          
                          <div className="flex gap-2">
                            <Button
                              onClick={generateNewAvatar}
                              variant="outline"
                              className="flex-1"
                              size="sm"
                            >
                              🎲 Generar Nuevo
                            </Button>
                            <Button
                              onClick={() => {
                                // Resetear al avatar original del usuario
                                if (currentUser && userData?.avatarSeed) {
                                  const originalUrl = generateAvatarUrl(userData.avatarSeed, selectedStyle);
                                  setProfileImage(originalUrl);
                                }
                              }}
                              variant="ghost"
                              size="sm"
                            >
                              ↺ Resetear
                            </Button>
                          </div>
                          
                          <p className="text-xs text-muted-foreground">
                            Haz click en "Generar Nuevo" para crear diferentes variaciones del estilo seleccionado
                          </p>
                        </div>

                        {/* Botones de acción */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            onClick={() => setIsAvatarDialogOpen(false)}
                            variant="outline"
                            className="flex-1"
                          >
                            Cancelar
                          </Button>
                          <Button
                            onClick={() => setIsAvatarDialogOpen(false)}
                            className="flex-1"
                          >
                            Guardar Avatar
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
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
