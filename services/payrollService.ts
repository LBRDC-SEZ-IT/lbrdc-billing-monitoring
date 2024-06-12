import { db } from "@/firebase.config";
import { Payroll, PayrollStatus } from "@/interfaces/payroll";
import { addDoc, collection, deleteDoc, doc, query, updateDoc, where } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

export const getPayrolls = (statusFilter?: PayrollStatus) => {
  let payrolls: Payroll[] = [];
  
  const ref = collection(db, "payrolls");
  let payrollQuery = query(ref);

  if (statusFilter) {
    payrollQuery = query(ref, where("status", "==", statusFilter));
  }

  const [value, loading, error] = useCollection(payrollQuery);

  if (value) {
    payrolls = value.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Payroll[];
  }

  return { payrolls, loading, error };
};

export const addPayroll = async (newPayroll: Payroll) => {
  try {
    const ref = collection(db, "payrolls");
    await addDoc(ref, newPayroll);
    console.log("Payroll added successfully!");
  }
  catch (error) {
    console.error("Error adding payroll: ", error);
  }
}

export const updatePayroll = async (payrollId: string, updatedData: Partial<Payroll>) => {
  try {
    const payrollDoc = doc(db, "payrolls", payrollId);
    await updateDoc(payrollDoc, updatedData);
    console.log("Payroll updated successfully!");
  } catch (error) {
    console.error("Error updating payroll: ", error);
  }
};

export const deletePayroll = async (payrollId: string) => {
  try {
    const payrollRef = doc(db, "payrolls", payrollId);
    await deleteDoc(payrollRef);
    console.log("Payroll deleted successfully!");
  } catch (error) {
    console.error("Error deleting payroll: ", error);
  }
};