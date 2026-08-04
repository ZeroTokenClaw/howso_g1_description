import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { PageParams } from "@/types/common";

interface UseTableOptions<T> {
  queryKey: string;
  fetcher: (params: PageParams) => Promise<{ list: T[]; total: number }>;
}

export const useTable = <T,>({ queryKey, fetcher }: UseTableOptions<T>) => {
  const [params, setParams] = useState<PageParams>({
    page: 1,
    page_size: 20,
    keyword: "",
    status: "",
    project_id: "",
    sort_by: "created_at",
    sort_order: "desc",
  });

  const query = useQuery({
    queryKey: [queryKey, params],
    queryFn: () => fetcher(params),
  });

  const list = useMemo(() => query.data?.list ?? [], [query.data]);
  const total = query.data?.total ?? 0;

  return { params, setParams, ...query, list, total };
};
