import request from "@/api/request";
import { createCrudApi } from "@/api/crud";

export const qualityCheckApi = {
  ...createCrudApi("quality-check"),
  trigger: (payload: Record<string, unknown>) => request.post("/api/v1/quality-check/trigger", payload),
  report: (id: string) => request.get(`/api/v1/quality-check/${id}/report`),
};
