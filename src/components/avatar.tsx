import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState, useEffect } from "react";
import { auth, db } from "@/firebase/firebaseconfig";
import { doc, onSnapshot } from "firebase/firestore"; // Cambiar getDoc por onSnapshot
import { onAuthStateChanged } from "firebase/auth";
import image1 from "../assets/pfp.jpg";

export function AvatarDemo() {
  const [userImage, setUserImage] = useState("");
  const [userInitials, setUserInitials] = useState("CN");

  useEffect(() => {
    let unsubscribeFirestore: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Limpiar listener anterior si existe
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
        }

        const userRef = doc(db, "users", user.uid);
        
        // Escuchar cambios en tiempo real
        unsubscribeFirestore = onSnapshot(userRef, (userDoc) => {
          if (userDoc.exists()) {
            const userData = userDoc.data();
            // Usar la imagen guardada o la imagen por defecto
            setUserImage(userData.photoURL || image1);
            // Usar el nickname o email para las iniciales
            const name = userData.nickname || user.displayName || user.email || "User";
            setUserInitials(name.charAt(0).toUpperCase());
          } else {
            // Si no hay documento, usar imagen por defecto
            setUserImage(image1);
            const name = user.displayName || user.email || "User";
            setUserInitials(name.charAt(0).toUpperCase());
          }
        }, (error) => {
          console.error("Error listening to user data:", error);
          setUserImage(image1);
          setUserInitials("U");
        });
      } else {
        // Usuario no autenticado
        if (unsubscribeFirestore) {
          unsubscribeFirestore();
          unsubscribeFirestore = null;
        }
        setUserImage("");
        setUserInitials("G"); // G de Guest
      }
    });

    // Cleanup function
    return () => {
      unsubscribeAuth();
      if (unsubscribeFirestore) {
        unsubscribeFirestore();
      }
    };
  }, []);

  return (
    <Avatar>
      <AvatarImage
        src={userImage}
        alt="User avatar"
      />
      <AvatarFallback>{userInitials}</AvatarFallback>
    </Avatar>
  );
}
