import request from "@/api/request";
import { createCrudApi } from "@/api/crud";

export const annotationTaskApi = {
  ...createCrudApi("annotation-tasks"),
  assign: (id: string, annotator_id: string) =>
    request.post(`/api/v1/annotation-tasks/${id}/assign`, null, { params: { annotator_id } }),
  submit: (id: string) => request.post(`/api/v1/annotation-tasks/${id}/submit`),
  review: (id: string, review_status: string) =>
    request.post(`/api/v1/annotation-tasks/${id}/review`, null, { params: { review_status } }),
  records: (id: string) => request.get(`/api/v1/annotation-tasks/${id}/records`),
};
