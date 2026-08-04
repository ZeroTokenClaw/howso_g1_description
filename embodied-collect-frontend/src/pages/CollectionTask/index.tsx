import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Avatar, Button, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockCollectionTasks } from "@/mock/index";

const STATUS_OPTIONS = ["待开始", "工作中", "提交数据", "检查合格", "检查不合格"];
const STATUS_COLOR: Record<string, string> = {
  待开始: "default", 工作中: "blue", 提交数据: "green", 检查合格: "cyan", 检查不合格: "red",
};

interface CollTask { id: string; name: string; actions: string[]; project: string; collector: string; creator: string; time: string; status: string; }

const CollectionTaskPage = () => {
  const [tasks, setTasks] = useState<CollTask[]>(mockCollectionTasks);
  const [keyword, setKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newProject, setNewProject] = useState("遥操作");
  const [newCollector, setNewCollector] = useState("");

  const filtered = tasks.filter((t) => {
    if (keyword && !t.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (statusFilter && t.status !== statusFilter) return false;
    return true;
  });

  const handleCreate = () => {
    if (!newName.trim()) { message.warning("请输入任务名称"); return; }
    setTasks([{
      id: `c${Date.now()}`, name: newName, actions: [],
      project: newProject, collector: newCollector || "—",
      creator: "当前用户", time: "刚刚", status: "待开始",
    }, ...tasks]);
    message.success("采集任务已创建");
    setCreateOpen(false);
    setNewName(""); setNewCollector("");
  };

  const handleStatusChange = (id: string, status: string) => {
    setTasks(tasks.map((t) => t.id === id ? { ...t, status } : t));
    message.success("状态已更新");
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    message.success("已删除");
  };

  const columns: ColumnsType<CollTask> = [
    { title: "任务名", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    {
      title: "动作集", dataIndex: "actions",
      render: (actions: string[]) => actions.length
        ? actions.map((a) => <Tag color="green" key={a} style={{ fontSize: 11 }}>{a}</Tag>)
        : <span style={{ color: "#bbb" }}>—</span>,
    },
    {
      title: "项目", dataIndex: "project", width: 110,
      render: (v: string) => <Tag color={v === "人类数据" ? "blue" : "green"}>{v}</Tag>,
    },
    {
      title: "采集员", dataIndex: "collector", width: 130,
      render: (v: string) => v !== "—" ? (
        <Space size={4}><Avatar size={20} style={{ background: "#2563eb", fontSize: 10 }}>{v[0]}</Avatar>{v}</Space>
      ) : "—",
    },
    { title: "创建者", dataIndex: "creator", width: 160, render: (v: string) => <span style={{ fontSize: 12, color: "#666" }}>{v}</span> },
    { title: "创建时间", dataIndex: "time", width: 110 },
    {
      title: "任务状态", dataIndex: "status", width: 150,
      render: (v: string, r) => (
        <Select size="small" value={v} style={{ width: 130 }}
          onChange={(val) => handleStatusChange(r.id, val)}
          options={STATUS_OPTIONS.map((s) => ({ label: <Tag color={STATUS_COLOR[s]}>{s}</Tag>, value: s }))} />
      ),
    },
    {
      title: "操作", width: 80,
      render: (_, r) => <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>,
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px", flexWrap: "wrap", gap: 12 }}>
        <Space wrap>
          <Input prefix={<SearchOutlined />} placeholder="任务名称" value={keyword}
            onChange={(e) => setKeyword(e.target.value)} style={{ width: 200 }} allowClear />
          <Select placeholder="任务状态" allowClear style={{ width: 140 }} value={statusFilter}
            onChange={(v) => setStatusFilter(v)}
            options={STATUS_OPTIONS.map((s) => ({ label: s, value: s }))} />
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>创建采集任务</Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered}
        locale={{ emptyText: "暂无采集任务" }} />

      <Modal title="创建采集任务" open={createOpen} onOk={handleCreate}
        onCancel={() => setCreateOpen(false)} okText="创建" cancelText="取消">
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <Input placeholder="任务名称 *" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Select style={{ width: "100%" }} value={newProject} onChange={(v) => setNewProject(v)}
            options={[{ label: "遥操作", value: "遥操作" }, { label: "人类数据", value: "人类数据" }]} />
          <Input placeholder="采集员" value={newCollector} onChange={(e) => setNewCollector(e.target.value)} />
        </Space>
      </Modal>
    </section>
  );
};

export default CollectionTaskPage;
