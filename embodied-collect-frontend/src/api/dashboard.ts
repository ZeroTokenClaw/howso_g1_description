import request from "@/api/request";
import type { DashboardOverview, DeviceStatusRow, LogRow, TrendPoint } from "@/types/dashboard";

export const getOverviewApi = () =>
  request.get<never, { data: DashboardOverview }>("/api/v1/dashboard/overview");
export const getTrendApi = () => request.get<never, { data: TrendPoint[] }>("/api/v1/dashboard/trend");
export const getDeviceStatusApi = () =>
  request.get<never, { data: DeviceStatusRow[] }>("/api/v1/dashboard/device-status");
export const getRecentLogsApi = () =>
  request.get<never, { data: LogRow[] }>("/api/v1/dashboard/recent-logs");
