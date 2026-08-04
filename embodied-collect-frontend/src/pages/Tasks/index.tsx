import { useState } from "react";
import { Button, Input, Modal, Select, Space, Table, Tag } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { mockTasks } from "@/mock/datasets";

const STATUS_COLOR: Record<string, string> = {
  已分配: "orange",
  进行中: "blue",
  已完成: "green",
  检查合格: "cyan",
  检查不合格: "red",
};

const TasksPage = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAnnotator, setNewAnnotator] = useState("");

  const handleCreate = () => {
    if (!newName.trim()) return;
    setTasks([
      ...tasks,
      {
        id: `t${Date.now()}`,
        name: newName,
        annotator: newAnnotator || "—",
        status: "已分配",
        count: 0,
        created: new Date().toLocaleDateString("zh-CN"),
      },
    ]);
    setCreateOpen(false);
    setNewName("");
    setNewAnnotator("");
  };

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 12px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>标注任务</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          创建任务
        </Button>
      </div>

      <Table
        className="flat-table"
        rowKey="id"
        pagination={{ pageSize: 20 }}
        dataSource={tasks}
        columns={[
          { title: "任务ID", dataIndex: "id", width: 80 },
          { title: "任务名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
          { title: "标注员", dataIndex: "annotator", width: 110 },
          {
            title: "状态",
            dataIndex: "status",
            width: 120,
            render: (v: string) => <Tag color={STATUS_COLOR[v] ?? "default"}>{v}</Tag>,
          },
          { title: "数据数量", dataIndex: "count", width: 100, render: (v: number) => `${v} 条` },
          { title: "创建时间", dataIndex: "created", width: 130 },
          {
            title: "操作",
            width: 120,
            render: () => (
              <Space>
                <Button type="link" size="small">查看</Button>
                <Button type="link" size="small" danger>删除</Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        title="创建标注任务"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => setCreateOpen(false)}
        okText="创建"
        cancelText="取消"
      >
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <Input placeholder="任务名称" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Select
            placeholder="选择标注员"
            style={{ width: "100%" }}
            value={newAnnotator || undefined}
            onChange={(v) => setNewAnnotator(v)}
            options={["iodemo", "puxk", "chenml", "marker", "picker"].map((u) => ({ label: u, value: u }))}
          />
        </Space>
      </Modal>
    </section>
  );
};

export default TasksPage;
