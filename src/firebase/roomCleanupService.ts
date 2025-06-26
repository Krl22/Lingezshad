import { db } from "./firebaseconfig";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
  Timestamp,
} from "firebase/firestore";

// Función para limpiar salas vacías o muy antiguas
export const cleanupOldRooms = async () => {
  try {
    const roomsRef = collection(db, "rooms");

    // Buscar salas con estado "empty" o muy antiguas
    const emptyRoomsQuery = query(roomsRef, where("status", "==", "empty"));

    const emptyRoomsSnapshot = await getDocs(emptyRoomsQuery);

    // Eliminar salas vacías
    const deletePromises = emptyRoomsSnapshot.docs.map(async (roomDoc) => {
      await deleteDoc(doc(db, "rooms", roomDoc.id));
      console.log(`Deleted empty room: ${roomDoc.id}`);
    });

    await Promise.all(deletePromises);

    // También limpiar salas muy antiguas (más de 24 horas)
    const allRoomsSnapshot = await getDocs(roomsRef);
    const now = Timestamp.now();
    const oneDayAgo = new Timestamp(now.seconds - 86400, now.nanoseconds); // 24 horas atrás

    const oldRoomPromises = allRoomsSnapshot.docs.map(async (roomDoc) => {
      const roomData = roomDoc.data();
      if (roomData.createdAt && roomData.createdAt < oneDayAgo) {
        await deleteDoc(doc(db, "rooms", roomDoc.id));
        console.log(`Deleted old room: ${roomDoc.id}`);
      }
    });

    await Promise.all(oldRoomPromises);
  } catch (error) {
    console.error("Error cleaning up rooms: ", error);
  }
};

// Función para ejecutar la limpieza periódicamente
export const startRoomCleanupScheduler = () => {
  // Ejecutar limpieza cada 30 minutos
  setInterval(cleanupOldRooms, 30 * 60 * 1000);
};
