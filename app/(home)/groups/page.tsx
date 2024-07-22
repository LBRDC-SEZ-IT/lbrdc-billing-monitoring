"use client";

import { DataTable } from "@/components/data-table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/convex/_generated/api";
import { useQuery } from "convex/react";
import { column } from "./_components/column";
import DialogFormAddGroup from "./_components/dialog-form-add-group";

const GroupsPage = () => {
  const groups = useQuery(api.groups.get);

  return (
    <section>
      <Card>
        <CardHeader className="px-8 pt-8">
          <CardTitle>Groups</CardTitle>
          <CardDescription>List of groups.</CardDescription>
        </CardHeader>
        <CardContent className="px-8">
          <DataTable
            columns={column}
            data={groups ?? []}
            isLoading={!groups}
            actionButton={<DialogFormAddGroup />}
            emptyTitle="There are no groups yet"
            emptyDescription='You can add new group by clicking the "Add Group" above.'
          />
        </CardContent>
      </Card>
    </section>
  );
};

export default GroupsPage;
