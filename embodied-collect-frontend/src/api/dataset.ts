import request from "@/api/request";
import { createCrudApi } from "@/api/crud";

export const datasetApi = {
  ...createCrudApi("datasets"),
  process: (id: string) => request.post(`/api/v1/datasets/${id}/process`),
  files: (id: string) => request.get(`/api/v1/datasets/${id}/files`),
  preview: (id: string) => request.get(`/api/v1/datasets/${id}/preview`),
};
