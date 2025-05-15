import { useEffect, useState } from "react";
import { ScrollArea, TextInput } from '@mantine/core';
import { DataTable } from 'mantine-datatable';
import 'mantine-datatable/styles.layer.css';
import { useColors } from "./hooks/use-colors.ts";
import { useQueryClient } from "@tanstack/react-query";

export const Table = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [search, setSearch] = useState('');

  const { data, isLoading } = useColors({page, pageSize, search})
  console.log('Data received:', data);
  const queryClient = useQueryClient();

  useEffect(() => {
    queryClient.invalidateQueries({
      queryKey: ['colors-list']
    });
  }, [page, pageSize, queryClient, search])

  return (
    <ScrollArea>
      <DataTable
        columns={[
          { accessor: 'id', title: 'ID', width: 100},
          {
            accessor: 'c_name',
            title: 'Название',
            width: 300,
            filter: (
              <TextInput
                placeholder="Найти по названию"
                value={search}
                onChange={(e) => setSearch(e.currentTarget.value)}
              />
            ),
            filtering: search !== '',
          },
          { accessor: 'c_hex', title: 'HEX', width: 300, },
          { accessor: 'c_rgb', title: 'RGB', width: 300, },
        ]}
        records={data}
        withTableBorder
        withColumnBorders
        striped
        highlightOnHover
        width="800"
        page={page}
        recordsPerPage={pageSize}
        onPageChange={(p) => setPage(p)}
        recordsPerPageOptions={[5, 10, 20]}
        recordsPerPageLabel="Кол-во записей"
        noRecordsText="Ничего не найдено"
        onRecordsPerPageChange={setPageSize}
        fetching={isLoading}
      />
    </ScrollArea>
  );
};