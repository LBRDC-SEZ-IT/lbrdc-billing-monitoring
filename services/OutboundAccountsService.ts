import { db } from "@/firebase.config";
import { OutboundAccount, OutboundAccountView, OutboundStatusTypes } from "@/interfaces/outbound";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

interface OutboundAccountsViewProps {
  creatorID?: string;
  addOrderBy?: string;
  specificStatuses?: OutboundStatusTypes[];
}

export const getOutboundAccountsView = ({ creatorID, addOrderBy, specificStatuses }: OutboundAccountsViewProps) => {
  const [accounts, setAccounts] = useState<OutboundAccountView[]>([]);
  const [loading, setLoading] = useState(true);

  let collectionQuery = query(collection(db, "outboundAccounts"));

  if (creatorID) {
    collectionQuery = query(collectionQuery, where("createdBy.userID", "==", creatorID));
  }

  if (addOrderBy) {
    collectionQuery = query(collectionQuery, orderBy(addOrderBy, "desc"));
  }

  const [accountValues, accountLoading, accountError] = useCollection(collectionQuery);

  useEffect(() => {
    const fetchAccounts = async () => {
      if (accountError) {
        console.log(accountError);
      }

      if (accountValues) {
        setLoading(true);

        try {
          let accounts: OutboundAccount[] = accountValues.docs.map(doc => ({
            docID: doc.id,
            ...doc.data(),
          } as OutboundAccount));

          if (specificStatuses && specificStatuses.length > 0) {
            accounts = accounts.filter(account => specificStatuses.includes(account.status));
          }

          const clientsData = new Map();
          const clientsSnapshot = await getDocs(collection(db, "clients"));
          clientsSnapshot.docs.forEach(doc => {
            clientsData.set(doc.id, doc.data());
          });

          const developmentsData = new Map();
          const developmentsSnapshot = await getDocs(collection(db, "developments"));
          developmentsSnapshot.docs.forEach(doc => {
            developmentsData.set(doc.id, doc.data());
          });

          const combinedData = accounts.map(account => {
            const clientData = clientsData.get(account.clientDocID) || { name: "Unknown Client", code: "?" };
            const developmentData = developmentsData.get(account.developmentDocID) || { name: "Unknown Development"};

            return {
              ...account,
              docID: account.docID,
              clientName: clientData.name,
              clientCode: clientData.code,
              developmentName: developmentData.name
            } as OutboundAccountView;
          });

          setAccounts(combinedData || []);
        } catch (err) {
          toast("Something went wrong", {
            description: `Service error: ${err}`,
          })

          console.log("OutboundAccountsService:getOutboundAccountsView", err);
        } finally {
          setLoading(false);
        }
      }
    };

    if (!accountLoading) {
      fetchAccounts();
    }
  }, [accountValues, accountLoading]);

  return { accounts, loading };
};

export const addOutboundAccount = async (newAccount: OutboundAccount) => {
  try {
    const ref = collection(db, "outboundAccounts");
    await addDoc(ref, newAccount);

    toast("Added Successfully", {
      description: "New outbound account has been added.",
    })
  }
  catch (error) {
    console.log("OutboundAccountsService:addOutboundAccount;", error);
  }
}

export const updateOutboundAccount = async (accountID: string, updatedData: Partial<OutboundAccount>) => {
  try {
    const accountDoc = doc(db, "outboundAccounts", accountID);
    await updateDoc(accountDoc, updatedData);

    toast("Updated Successfully", {
      description: "Outbound account has been updated.",
    })
  }
  catch (error) {
    console.log("OutboundAccountsService:updateOutboundAccount;", error);
  }
};

export const deleteOutboundAccount = async (accountID: string) => {
  try {
    const accountDoc = doc(db, "payableAccounts", accountID);
    await deleteDoc(accountDoc);

    toast("Deleted Successfully", {
      description: "Outbound account has been deleted.",
    })
  }
  catch (error) {
    console.log("OutboundAccountsService:deleteOutboundAccount;", error);
  }
};