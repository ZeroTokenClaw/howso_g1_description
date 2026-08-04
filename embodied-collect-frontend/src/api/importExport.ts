import request from "@/api/request";

export const importExportApi = {
  importUpload: (project_id: string, file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    return request.post("/api/v1/import/upload", formData, { params: { project_id } });
  },
  createExport: (payload: Record<string, unknown>) => request.post("/api/v1/export", payload),
  downloadExport: (id: string) => request.get(`/api/v1/export/${id}/download`),
};
