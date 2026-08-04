import request from "@/api/request";

export interface DatasetListParams {
  page?: number;
  page_size?: number;
  keyword?: string;
  project_id?: string;
  assigned?: boolean;
  annotated?: boolean;
  robot_id?: string;
  tags?: string[];
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface DatasetRow {
  id: string;
  name: string;
  data_type?: string;
  data_format?: string;
  file_count?: number;
  total_size_mb?: number;
  duration_sec?: number;
  status?: string;
  project_id?: string;
  project_name?: string;
  creator_id?: string;
  creator_name?: string;
  tags?: string[];
  annotation_count?: number;
  task_count?: number;
  created_at: string;
  updated_at?: string;
}

export interface DatasetStats {
  total_files: number;
  total_duration_sec: number;
  total_size_mb: number;
  modality_distribution: { name: string; value: number }[];
}

export const datasetsApi = {
  list: (params: DatasetListParams) =>
    request.get<never, { data: DatasetRow[]; total: number }>("/api/v1/datasets", { params }),

  get: (id: string) =>
    request.get<never, { data: DatasetRow }>(`/api/v1/datasets/${id}`),

  rename: (id: string, name: string) =>
    request.put<never, { data: DatasetRow }>(`/api/v1/datasets/${id}`, { name }),

  delete: (id: string) =>
    request.delete(`/api/v1/datasets/${id}`),

  batchDelete: (ids: string[]) =>
    request.delete("/api/v1/datasets/batch", { data: { ids } }),

  updateTags: (id: string, tags: string[]) =>
    request.put(`/api/v1/datasets/${id}`, { tags }),

  getStats: (id: string) =>
    request.get<never, { data: DatasetStats }>(`/api/v1/datasets/${id}/stats`),

  files: (id: string) =>
    request.get(`/api/v1/datasets/${id}/files`),

  preview: (id: string) =>
    request.get(`/api/v1/datasets/${id}/preview`),

  /** 获取 Foxglove Studio 跳转链接（包含 MinIO 预签名 URL） */
  getStudioUrl: (id: string) =>
    request.get<never, { data: { studio_url: string | null; mcap_url: string | null; filename: string } }>(
      `/api/v1/datasets/${id}/studio-url`,
    ),
};
