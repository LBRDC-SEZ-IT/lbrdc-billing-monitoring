import { db } from "@/firebase.config";
import { Client } from "@/interfaces/client";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";

export const subscribeToClients = (callback: (clients: Client[]) => void) => {
  const clientsRef = collection(db, "clients");
  return onSnapshot(clientsRef, (querySnapshot: QuerySnapshot) => {
    const clients = querySnapshot.docs.map((client) => ({
      id: client.id,
      ...client.data(),
    })) as Client[];
    callback(clients);
  });
};