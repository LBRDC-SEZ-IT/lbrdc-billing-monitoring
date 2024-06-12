import { db } from "@/firebase.config";
import { Client } from "@/interfaces/client";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getClients = () => {
  const ref = collection(db, "clients");
  const [value, loading, error] = useCollection(ref);

  let clients: Client[] = [];

  if (value) {
    clients = value.docs.map(doc => ({
      ...doc.data()
    })) as Client[];
  }

  return { clients, loading, error };
};