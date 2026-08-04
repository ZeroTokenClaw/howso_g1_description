import { useState } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Input, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockLogs, type MockLog } from "@/mock/index";

const LEVEL_COLOR: Record<string, "success" | "warning" | "error"> = {
  INFO: "success", WARN: "warning", ERROR: "error",
};

const MonitorPage = () => {
  const [logs] = useState<MockLog[]>(mockLogs);
  const [keyword, setKeyword] = useState("");
  const [levelFilter, setLevelFilter] = useState<string | undefined>();

  const filtered = logs.filter((l) => {
    if (levelFilter && l.level !== levelFilter) return false;
    if (keyword && !l.action.includes(keyword) && !l.operator.includes(keyword) && !l.module.includes(keyword)) return false;
    return true;
  });

  const columns: ColumnsType<MockLog> = [
    {
      title: "级别", dataIndex: "level", width: 90,
      render: (v: string) => <Badge status={LEVEL_COLOR[v]} text={v} />,
    },
    { title: "模块", dataIndex: "module", width: 110, render: (v: string) => <Tag>{v}</Tag> },
    { title: "操作描述", dataIndex: "action", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "操作人", dataIndex: "operator", width: 110 },
    { title: "IP 地址", dataIndex: "ip", width: 140, render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    { title: "时间", dataIndex: "created", width: 170 },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", flexWrap: "wrap", gap: 12 }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="搜索操作/模块/操作人" value={keyword}
            onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
          <Select placeholder="日志级别" allowClear style={{ width: 120 }} value={levelFilter}
            onChange={(v) => setLevelFilter(v)}
            options={["INFO", "WARN", "ERROR"].map((l) => ({ label: l, value: l }))} />
        </Space>
        <Button onClick={() => window.location.reload()}>刷新</Button>
      </div>

      <div style={{ display: "flex", gap: 16, marginBottom: 16 }}>
        {[
          { label: "总日志", value: logs.length, color: "#2563eb" },
          { label: "INFO", value: logs.filter((l) => l.level === "INFO").length, color: "#16a34a" },
          { label: "WARN", value: logs.filter((l) => l.level === "WARN").length, color: "#d97706" },
          { label: "ERROR", value: logs.filter((l) => l.level === "ERROR").length, color: "#dc2626" },
        ].map((s) => (
          <div key={s.label} style={{ padding: "10px 20px", background: "#f8faff", borderRadius: 8, border: `1px solid ${s.color}22` }}>
            <div style={{ fontSize: 11, color: "#888" }}>{s.label}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered}
        locale={{ emptyText: "暂无日志" }} />
    </section>
  );
};

export default MonitorPage;
