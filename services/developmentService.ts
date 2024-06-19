import { db } from "@/firebase.config";
import { Development } from "@/interfaces/development";
import { collection } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getDevelopments = () => {
  const ref = collection(db, "developments");
  const [snapshot, developmentsLoading, developmentsError] = useCollection(ref);

  let developments: Development[] = [];

  if (snapshot) {
    developments = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Development[];
  }

  return { developments, developmentsLoading, developmentsError };
};