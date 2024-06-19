import { db } from "@/firebase.config";
import { Client } from "@/interfaces/client";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getClients = () => {
  const ref = collection(db, "clients");
  const [snapshot, clientsLoading, clientsError] = useCollection(ref);

  let clients: Client[] = [];

  if (snapshot) {
    clients = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Client[];
  }

  return { clients, clientsLoading, clientsError };
};