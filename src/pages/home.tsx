import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/firebase/firebaseconfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Loader } from "@/components/uiverse/Loader";
import { updateUserRanking } from "@/firebase/createUserDoc";

// Define a type for the user data
interface UserData {
  email: string;
  points: number;
  level: number;
  lessonsCompleted: string[]; // assuming it's an array of lesson identifiers
  rewards: { name: string; achievedAt: string }[];
  score: number;
  friends: string[]; // assuming friends are stored as an array of user IDs
  requests: string[]; // assuming requests are stored as an array of user IDs
  ranking: number;
}

const Home = () => {
  // Use the UserData type for userData, or null if no data is available
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          // Verificamos que user.email no sea null
          if (user.email) {
            await updateUserRanking(userRef, user.email);
          } else {
            console.error("User email is null.");
          }

          // Asegurarse de que userDoc.data() coincida con el tipo UserData
          setUserData(userDoc.data() as UserData);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-gray-100 pt-[92px] dark:bg-gray-900 transition-colors duration-300 px-8">
      <div className="w-full max-w-md px-6 py-8 transition-colors duration-300 bg-white rounded-lg shadow-lg dark:bg-gray-700">
        <h1 className="mb-6 text-3xl font-bold text-center text-gray-800 dark:text-gray-200">
          Home
        </h1>
        {userData ? (
          <div>
            <h2 className="mb-4 text-xl font-semibold text-gray-800 dark:text-gray-200">
              Welcome, {userData.email}
            </h2>
            <div className="space-y-2">
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-100">
                  Points:
                </strong>{" "}
                {userData.points}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-100">
                  Level:
                </strong>{" "}
                {userData.level}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-100">
                  Lessons Completed:
                </strong>{" "}
                {userData.lessonsCompleted.length}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-100">
                  Score:
                </strong>{" "}
                {userData.score}
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                <strong className="text-gray-800 dark:text-gray-100">
                  ranking:
                </strong>{" "}
                {userData.ranking}
              </p>
            </div>
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Rewards
              </h3>
              {userData.rewards.length > 0 ? (
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  {userData.rewards.map((reward, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
                    >
                      <span>{reward.name}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(reward.achievedAt).toLocaleDateString()}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 dark:text-gray-400">
                  No rewards yet
                </p>
              )}
            </div>
            <div className="mt-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-800 dark:text-gray-100">
                Friends
              </h3>
              {userData.friends.length > 0 ? (
                <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                  {userData.friends.map((friend, index) => (
                    <li
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-gray-100 rounded-lg shadow-sm dark:bg-gray-700"
                    >
                      <span>{friend}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-700 dark:text-gray-400">
                  No friends added
                </p>
              )}
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-700 dark:text-gray-400">
            No user data available
          </p>
        )}
      </div>
    </div>
  );
};

export default Home;
