import request from "@/api/request";
import { createCrudApi } from "@/api/crud";

export const collectionTaskApi = {
  ...createCrudApi("collection-tasks"),
  start: (id: string) => request.post(`/api/v1/collection-tasks/${id}/start`),
  stop: (id: string) => request.post(`/api/v1/collection-tasks/${id}/stop`),
  pause: (id: string) => request.post(`/api/v1/collection-tasks/${id}/pause`),
};
