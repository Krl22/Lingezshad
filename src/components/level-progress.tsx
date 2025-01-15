import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { Progress } from "@/components/ui/progress"; // Importa el componente Progress desde ShadCN

interface UserData {
  points: number;
  level: number;
}

export const LevelProgress = () => {
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDocRef = doc(db, "users", user.uid);
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            setUserData(userDocSnap.data() as UserData);
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <>
      {userData && (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center mb-2">
            <span className="mr-1 text-sm text-gray-900 dark:text-gray-400">
              Level:
            </span>
            <span className="px-2 py-1 text-lg font-bold text-white bg-purple-600 rounded-lg dark:bg-gray-700">
              {userData.level}
            </span>
          </div>
          <div className="w-28">
            <Progress
              value={(userData.points / 1000) * 100 || 0} // Calcula el porcentaje
              className="h-4 bg-blue-100 dark:bg-gray-700"
            />
            <div className="mt-1 text-sm text-center text-gray-900 dark:text-gray-200">
              {userData.points || 0}/1000
            </div>
          </div>
        </div>
      )}
    </>
  );
};
