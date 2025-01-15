import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  arrayUnion,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./firebaseconfig";

export const getOrCreateChat = async (
  userEmail: string,
  friendEmail: string
) => {
  const chatsRef = collection(db, "chats");
  const q = query(chatsRef, where("participants", "array-contains", userEmail));

  const querySnapshot = await getDocs(q);
  let chatDoc = null;

  querySnapshot.forEach((doc) => {
    const data = doc.data();
    if (data.participants.includes(friendEmail)) {
      chatDoc = { id: doc.id, ...data };
    }
  });

  if (!chatDoc) {
    const newChatRef = await addDoc(chatsRef, {
      participants: [userEmail, friendEmail],
      messages: [],
    });
    chatDoc = {
      id: newChatRef.id,
      participants: [userEmail, friendEmail],
      messages: [],
    };
  }

  return chatDoc;
};

export const sendMessage = async (
  chatId: string,
  sender: string,
  content: string
) => {
  const chatRef = doc(db, "chats", chatId);
  await updateDoc(chatRef, {
    messages: arrayUnion({
      sender,
      content,
      timestamp: new Date().toISOString(),
    }),
  });
};

export const listenToMessages = (
  chatId: string,
  callback: (messages: any[]) => void
) => {
  const chatRef = doc(db, "chats", chatId);
  return onSnapshot(chatRef, (snapshot) => {
    const data = snapshot.data();
    callback(data?.messages || []);
  });
};
