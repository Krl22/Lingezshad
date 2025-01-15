import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  QueryDocumentSnapshot,
  DocumentData,
} from "firebase/firestore";
import { db } from "./firebaseconfig";

// Definimos las interfaces de FirebaseUser y UserDoc
interface FirebaseUser {
  uid: string;
  email: string;
}

interface UserDoc {
  email: string;
  nickname: string;
  level: number;
  points: number;
  lessonsCompleted: string[];
  rewards: string[];
  score: number;
  friends: string[];
  requests: string[];
  ranking?: number; // Agregar ranking al documento de usuario
}

// Crear documento de usuario
export const createUserDoc = async (user: FirebaseUser): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);

    // Si el documento no existe, crearlo
    if (!userDoc.exists()) {
      const nickname = user.email.split("@")[0]; // Generar el nickname a partir del email
      const newUserDoc: UserDoc = {
        email: user.email,
        nickname: nickname, // Usamos el nickname generado
        level: 1,
        points: 0,
        lessonsCompleted: [],
        rewards: [],
        score: 0,
        friends: [],
        requests: [],
      };
      await setDoc(userDocRef, newUserDoc);

      // Luego de crear el documento, obtener el ranking y actualizar el campo `ranking` del nuevo usuario
      await updateUserRanking(userDocRef, user.email);
    }
  } catch (error) {
    console.error("Error creating user document:", error);
  }
};

// Función para obtener el ranking de todos los usuarios y actualizar el ranking del nuevo usuario
export const updateUserRanking = async (
  userDocRef: any,
  userEmail: string
): Promise<void> => {
  try {
    const usersRef = collection(db, "users");
    const usersQuery = query(usersRef, orderBy("score", "desc")); // Ordenar por score descendente
    const querySnapshot = await getDocs(usersQuery);

    // Mapeo de los documentos para incluir email y ranking
    const userRanking = querySnapshot.docs.map(
      (docSnapshot: QueryDocumentSnapshot<DocumentData>, index: number) => {
        const data = docSnapshot.data() as UserDoc; // Asegúrate de castear el tipo correctamente
        return {
          ...data, // Incluye todos los datos del usuario
          ranking: index + 1, // El ranking es la posición en el array (index + 1)
        };
      }
    );

    // Encuentra el ranking del usuario recién creado usando su email
    const newUser = userRanking.find((user) => user.email === userEmail);

    if (newUser) {
      // Actualiza el ranking del nuevo usuario en su documento
      await setDoc(userDocRef, { ranking: newUser.ranking }, { merge: true });
    }
  } catch (error) {
    console.error("Error updating user ranking:", error);
  }
};
