// friendsService.ts
import { db } from "@/firebase/firebaseconfig";
import {
  collection,
  getDocs,
  query,
  where,
  getDoc,
  doc,
  updateDoc,
  arrayRemove,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";

export type Friend = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
};

const auth = getAuth();

export const fetchFriends = async (userUID: string): Promise<Friend[]> => {
  if (!userUID) {
    console.error("No user is logged in.");
    return [];
  }

  try {
    const userDocRef = doc(db, "users", userUID);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const friendsEmails: string[] = userData.friends || [];

      if (friendsEmails.length > 0) {
        const friendsCollection = collection(db, "users");
        const friendsQuery = query(
          friendsCollection,
          where("email", "in", friendsEmails)
        );
        const querySnapshot = await getDocs(friendsQuery);

        return querySnapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().nickname || "No Name",
          email: doc.data().email,
          avatarUrl: doc.data().avatarUrl || "",
        }));
      }
    } else {
      console.error("User document not found.");
    }
  } catch (error) {
    console.error("Error fetching friends:", error);
  }

  return [];
};

export const handleRemove = async (
  userUID: string,
  friendId: string,
  friendEmail: string
): Promise<boolean> => {
  if (!userUID) {
    console.error("No user is logged in.");
    return false;
  }

  const currentUserEmail = auth.currentUser?.email;

  if (!friendEmail || !currentUserEmail) {
    console.error(
      "Invalid data: friendEmail or currentUserEmail is undefined."
    );
    return false;
  }

  try {
    const userDocRef = doc(db, "users", userUID);
    const friendDocRef = doc(db, "users", friendId);

    await updateDoc(userDocRef, {
      friends: arrayRemove(friendEmail),
    });

    await updateDoc(friendDocRef, {
      friends: arrayRemove(currentUserEmail),
    });

    console.log(`Friend ${friendEmail} removed successfully.`);
    return true;
  } catch (error) {
    console.error("Error removing friend:", error);
    return false;
  }
};

export const handleAccept = async (email: string, setRequests: Function) => {
  try {
    const user = auth.currentUser;
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedRequests = userData.requests.filter(
        (requestEmail: string) => requestEmail !== email
      );
      const updatedFriends = [...(userData.friends || []), email];

      // Actualizar el documento del usuario que acepta la solicitud
      await updateDoc(userDocRef, {
        requests: updatedRequests,
        friends: updatedFriends,
      });

      // Buscar el uid del solicitante usando su email
      const targetUserSnapshot = await getDocs(
        query(collection(db, "users"), where("email", "==", email))
      );

      if (!targetUserSnapshot.empty) {
        const targetUserDoc = targetUserSnapshot.docs[0];
        const targetUserId = targetUserDoc.id; // El uid del solicitante
        const targetUserData = targetUserDoc.data();

        // Actualizar la lista de amigos del usuario que envió la solicitud
        const targetUserUpdatedFriends = [
          ...(targetUserData.friends || []),
          user.email, // Agregamos al usuario actual a los amigos del solicitante
        ];

        // Actualizar el documento del usuario solicitante
        const targetUserDocRef = doc(db, "users", targetUserId);
        await updateDoc(targetUserDocRef, {
          friends: targetUserUpdatedFriends,
        });

        // Actualizar la lista de solicitudes del usuario actual
        setRequests(updatedRequests.map((req: string) => ({ email: req })));
        console.log(`Friend request from ${email} accepted.`);
      } else {
        console.error("User not found with the provided email.");
      }
    }
  } catch (error) {
    console.error("Error accepting friend request:", error);
  }
};

export const handleReject = async (email: string, setRequests: Function) => {
  try {
    const user = auth.currentUser;
    if (!user) return;

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const updatedRequests = userData.requests.filter(
        (requestEmail: string) => requestEmail !== email
      );

      // Actualizar el documento del usuario
      await updateDoc(userDocRef, {
        requests: updatedRequests,
      });

      setRequests(updatedRequests.map((req: string) => ({ email: req })));
      alert(`Friend request from ${email} rejected.`);
    }
  } catch (error) {
    console.error("Error rejecting friend request:", error);
    alert("Failed to reject the friend request. Please try again.");
  }
};

export const fetchRequests = async (
  setRequests: React.Dispatch<React.SetStateAction<{ email: string }[]>>
) => {
  try {
    const user = auth.currentUser;
    if (!user) {
      console.warn("No user logged in.");
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      const userRequests = userData.requests || [];
      setRequests(userRequests.map((email: string) => ({ email })));
    } else {
      console.warn("User document does not exist.");
    }
  } catch (error) {
    console.error("Error fetching friend requests:", error);
  }
};

export const handleAddFriend = async (
  searchBy: string,
  searchInput: string
) => {
  try {
    const user = auth.currentUser;

    if (!user) {
      alert("You must be logged in to add friends.");
      return;
    }

    if (!searchInput.trim()) {
      alert("Please enter a value.");
      return;
    }

    // Find the target user
    const searchField = searchBy === "nickname" ? "nickname" : "email";
    const snapshot = await getDocs(
      query(collection(db, "users"), where(searchField, "==", searchInput))
    );

    if (snapshot.empty) {
      alert("User not found.");
      return;
    }

    const targetUserDoc = snapshot.docs[0];
    const targetUserId = targetUserDoc.id;
    const targetUserData = targetUserDoc.data();

    if (user.uid === targetUserId) {
      alert("You cannot send a friend request to yourself.");
      return;
    }

    // Check if the request already exists in the target user's requests field
    if (targetUserData.requests.includes(user.email)) {
      alert("Friend request already sent.");
      return;
    }

    // Add the current user's email to the target user's requests field
    const targetUserRef = doc(db, "users", targetUserId);
    await updateDoc(targetUserRef, {
      requests: [...targetUserData.requests, user.email],
    });

    alert("Friend request sent!");
  } catch (error) {
    console.error("Error adding friend:", error);
    alert("An error occurred while sending the friend request.");
  }
};
