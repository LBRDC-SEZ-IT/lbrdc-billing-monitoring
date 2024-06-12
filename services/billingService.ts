import { db } from "@/firebase.config";
import { Billing } from "@/interfaces/billing";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getBillings = () => {
  const ref = collection(db, "billings");
  const [value, loading, error] = useCollection(ref);

  let billings: Billing[] = [];

  if (value) {
    billings = value.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Billing[];
  }

  return { billings, loading, error };
};

export const addBilling = async (newBilling: Billing) => {
  try {
    const ref = collection(db, "billings");
    await addDoc(ref, newBilling);
    console.log("Billing added successfully!");
  }
  catch (error) {
    console.error("Error adding billing: ", error);
  }
}

export const deleteBilling = async (billingId: string) => {
  try {
    const billingRef = doc(db, "billings", billingId);
    await deleteDoc(billingRef);
    console.log("Billing deleted successfully!");
  } catch (error) {
    console.error("Error deleting payroll: ", error);
  }
};