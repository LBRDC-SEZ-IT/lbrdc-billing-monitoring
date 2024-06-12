import { db } from "@/firebase.config";
import { Payroll } from "@/interfaces/payroll";
import { collection, onSnapshot, QuerySnapshot } from "firebase/firestore";

export const subscribeToPayroll = (callback: (payroll: Payroll[]) => void) => {
  const payrollRef = collection(db, "payrolls");
  return onSnapshot(payrollRef, (querySnapshot: QuerySnapshot) => {
    const payroll = querySnapshot.docs.map((payroll) => ({
      id: payroll.id,
      ...payroll.data(),
    })) as Payroll[];
    callback(payroll);
  });
};