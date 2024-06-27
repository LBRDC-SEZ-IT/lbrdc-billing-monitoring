"use client";
import { useUser } from "@clerk/nextjs";

const AccountsPage = () => {
  const userPermissions = useUser().user?.organizationMemberships[0].permissions;

  if (userPermissions?.includes("org:access:inbound")) {
    return <div>Inbound</div>;
  } else if (userPermissions?.includes("org:access:outbound")) {
    return <div>Outbound</div>;
  }
};

export default AccountsPage;
