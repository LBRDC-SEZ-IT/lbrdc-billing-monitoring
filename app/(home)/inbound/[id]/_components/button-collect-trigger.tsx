"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import DialogFormAddCollection from "./dialog-form-add-collection";

interface Props {
  billingID?: string;
}

const ButtonCollectTrigger = ({ billingID }: Props) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClick = () => {
    if (billingID) {
      setIsDialogOpen(true);
    }
  };

  return (
    <>
      <Button
        onClick={handleClick}
        size={"sm"}
        variant={"ghost"}
        className="text-xs mx-auto text-muted-foreground">
        COLLECT
      </Button>
      {isDialogOpen && billingID && (
        <DialogFormAddCollection
          billingID={billingID}
          onOpenChange={() => setIsDialogOpen(false)}
        />
      )}
    </>
  );
};

export default ButtonCollectTrigger;
