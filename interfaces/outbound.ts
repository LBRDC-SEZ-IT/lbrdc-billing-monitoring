// type PayableCategory = {
//   name: string;
//   amount: number;
// }

// type CreatedInfo = {
//   userID: string;
//   userFirstName: string;
//   userLastName: string;
//   // timestamp: Timestamp;
// }

// type UpdateInfo = {
//   userID: string;
//   userFirstName: string;
//   userLastName: string;
//   // timestamp: Timestamp;
// }

// type ApproveInfo = { 
//   userID: string;
//   userFirstName: string;
//   userLastName: string;
//   // timestamp: Timestamp;
// }

// export type OutboundAccount = {
//   docID?: string;
//   code: string;
//   clientDocID: string;
//   developmentDocID: string;
//   locationDocID: string;
//   datePeriod: string;
//   totalAmount: number;
//   payableCategories: PayableCategory[];
//   status: OutboundStatusTypes;
//   statusUpdatedBy: UpdateInfo;
//   createdBy: CreatedInfo;
//   approvedBy?: ApproveInfo;
// };

// export interface OutboundAccountView extends OutboundAccount {
//   clientName: string,
//   clientCode: string,
//   developmentName: string,
// }

export interface Outbound {
  _id?: string;
  code: string;
  clientRefID: string;
  groupRefID: string;
  subgroupRefID?: string;
  authorRefID: string;
  datePeriod: {
    from: string;
    to: string;
  };
  totalAmount: number;
  categories: {
    name: string;
    amount: number;
  }[];
  status: string;
  statusInfo: {
    userID: string;
    timestamp: string;
  };
  approvalInfo?: {
    userID: string;
    timestamp: string;
  };
  _creationTime?: number;
}

export interface OutboundView extends Outbound {
  clientName?: string;
  clientCode?: string;
  groupName?: string;
  subgroupName?: string;
}