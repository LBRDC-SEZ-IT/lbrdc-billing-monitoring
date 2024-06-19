import { db } from "@/firebase.config";
import { InboundAccount, InboundAccountView, InboundStatusTypes } from "@/interfaces/inbound";
import { addDoc, collection, deleteDoc, doc, getDocs, orderBy, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { useCollection } from "react-firebase-hooks/firestore";
import { toast } from "sonner";

interface InboundAccountsViewProps {
  creatorID?: string;
  addOrderBy?: string;
  specificStatuses?: InboundStatusTypes[];
}

export const getInboundAccountsView = ({ creatorID, addOrderBy, specificStatuses }: InboundAccountsViewProps) => {
  const [accounts, setAccounts] = useState<InboundAccountView[]>([]);
  const [loading, setLoading] = useState(true);

  let collectionQuery = query(collection(db, "inboundAccounts"));

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
          let accounts: InboundAccount[] = accountValues.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          } as InboundAccount));

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
              id: account.id,
              clientName: clientData.name,
              clientCode: clientData.code,
              developmentName: developmentData.name
            } as InboundAccountView;
          });

          setAccounts(combinedData || []);
        } catch (err) {
          toast("Something went wrong", {
            description: `Service error: ${err}`,
          })

          console.log("InboundAccountsService:getInboundAccountsView", err);
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

export const addInboundAccount = async (newAccount: InboundAccount) => {
  try {
    const ref = collection(db, "inboundAccounts");
    await addDoc(ref, newAccount);

    toast("Added Successfully", {
      description: "New inbound account has been added.",
    })
  }
  catch (error) {
    console.log("InboundAccountsService:addInboundAccount;", error);
  }
}

export const deleteInboundAccount = async (accountID: string) => {
  try {
    const ref = doc(db, "inboundAccounts", accountID);
    await deleteDoc(ref);

    toast("Deleted Successfully", {
      description: "Inbound account has been deleted.",
    })
  } catch (error) {
    console.log("InboundAccountsService:deleteInboundAccount;", error);
  }
};