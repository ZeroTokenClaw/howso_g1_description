export interface ApiResponse<T = unknown> {
  code: number;
  message: string;
  data: T;
  total?: number;
}

export interface PageParams {
  page: number;
  page_size: number;
  keyword?: string;
  status?: string;
  project_id?: string;
  sort_by?: string;
  sort_order?: "asc" | "desc";
}

export interface PageResult<T> {
  list: T[];
  total: number;
}

export interface OptionItem {
  label: string;
  value: string;
}
