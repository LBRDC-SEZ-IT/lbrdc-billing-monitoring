import { db } from "@/firebase.config";
import { Location } from "@/interfaces/location";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getLocations = () => {
  const ref = collection(db, "locations");
  const [snapshot, loading, error] = useCollection(ref);

  let items: Location[] = [];

  if (snapshot) {
    items = snapshot.docs.map(doc => ({
      docID: doc.id,
      ...doc.data()
    })) as Location[];
  }

  return { items, loading, error };
};