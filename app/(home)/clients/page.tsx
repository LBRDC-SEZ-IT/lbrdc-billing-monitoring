"use client";

import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { column } from "./_components/column";
import DialogFormAddClient from "./_components/dialog-form-add-client";

const ClientsPage = () => {
  const clients = useQuery(api.clients.get, {});

  return (
    <section>
      <Card>
        <CardHeader className="px-8 pt-8">
          <CardTitle>Clients</CardTitle>
          <CardDescription>List of clients.</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <DataTable
            columns={column}
            data={clients ?? []}
            isLoading={!clients}
            actionButton={<DialogFormAddClient />}
            emptyTitle="There are no clients yet"
            emptyDescription='You can add new client by clicking the "Add Client" above.'
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default ClientsPage;
