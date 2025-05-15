import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { Table } from "./Table";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      retry: 2,
    }
  }
})

export default function App() {
  return <MantineProvider>
    <QueryClientProvider client={queryClient}>
      <Table/>
    </QueryClientProvider>
  </MantineProvider>;
}