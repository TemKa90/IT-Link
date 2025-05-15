import { useQuery, keepPreviousData } from '@tanstack/react-query';

interface Props {
  page?: number;
  pageSize?: number;
  search?: string;
}

export const useColors = ({ page, pageSize, search }: Props = {}) => {
  return useQuery({
    queryKey: ['colors-list', page, pageSize, search],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (page) params.append("page", String(page));
      if (pageSize) params.append("pageSize", String(pageSize));
      if (search) params.append("search", search);

      const res = await fetch(`http://localhost:3000/colors/?${params.toString()}`);
      return res.json();
    },
    placeholderData: keepPreviousData,
  });
};