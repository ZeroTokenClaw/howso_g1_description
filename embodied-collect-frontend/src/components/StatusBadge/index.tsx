import { Badge } from "antd";

const colorMap: Record<string, string> = {
  online: "#52c41a",
  enabled: "#52c41a",
  success: "#52c41a",
  running: "#faad14",
  in_progress: "#faad14",
  pending: "#1677ff",
  offline: "#ff4d4f",
  failed: "#ff4d4f",
  fault: "#ff4d4f",
  completed: "#52c41a",
};

interface Props {
  status: string;
}

const StatusBadge = ({ status }: Props) => <Badge color={colorMap[status] || "#d9d9d9"} text={status} />;

export default StatusBadge;
