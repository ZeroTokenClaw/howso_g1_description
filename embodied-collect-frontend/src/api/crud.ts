import request from "@/api/request";
import type { PageParams } from "@/types/common";

export const createCrudApi = (resource: string) => ({
  list: (params: PageParams) =>
    request.get<never, { data: unknown[]; total?: number }>(`/api/v1/${resource}`, { params }),
  detail: (id: string) => request.get(`/api/v1/${resource}/${id}`),
  create: (payload: Record<string, unknown>) => request.post(`/api/v1/${resource}`, { payload }),
  update: (id: string, payload: Record<string, unknown>) => request.put(`/api/v1/${resource}/${id}`, { payload }),
  remove: (id: string) => request.delete(`/api/v1/${resource}/${id}`),
  batchRemove: (ids: string[]) => request.delete(`/api/v1/${resource}/batch`, { data: { ids } }),
});
