export interface DashboardOverview {
  data_stats: {
    total_datasets: number;
    total_files: number;
    total_size_gb: number;
    today_new: number;
  };
  task_stats: {
    collection: { total: number; running: number; completed: number; failed: number };
    annotation: { total: number; pending: number; in_progress: number; completed: number };
    quality_check: { total: number; pass_rate: number };
  };
  device_stats: { total: number; online: number; offline: number; fault: number };
  robot_stats: { total: number; online: number; offline: number };
  storage_stats: { used_gb: number; total_gb: number; usage_rate: number };
}

export interface TrendPoint {
  date: string;
  collection: number;
  annotation: number;
}

export interface DeviceStatusRow {
  id: string;
  name: string;
  type: string;
  status: string;
  last_online_time?: string;
}

export interface LogRow {
  id: string;
  operator: string;
  action: string;
  created_at: string;
  result: string;
}
