import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Button, Input, message, Modal, Progress, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockDatasets } from "@/mock/index";

interface QCItem {
  id: string; dataset: string; type: string;
  checker: string; status: string; passRate: number; issues: number; created: string;
}

const initData: QCItem[] = [
  { id: "q1", dataset: "episode_00048_2026_02_09_12_17_58", type: "数据完整性", checker: "auditor", status: "通过", passRate: 98, issues: 1, created: "2026/4/18" },
  { id: "q2", dataset: "20251218_KitchenCutlery_DualAirbot_01", type: "标注质量", checker: "reviewer", status: "不通过", passRate: 62, issues: 8, created: "2026/4/15" },
  { id: "q3", dataset: "20241205_DualAirbot_TShirtFolding_01", type: "数据完整性", checker: "auditor", status: "进行中", passRate: 0, issues: 0, created: "2026/4/20" },
];

const QC_TYPES = ["数据完整性", "标注质量", "丢帧检测", "时间对齐"];
const CHECKERS = ["auditor", "reviewer", "iodemo", "puxk"];

const QualityCheckPage = () => {
  const [items, setItems] = useState<QCItem[]>(initData);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [newDataset, setNewDataset] = useState("");
  const [newType, setNewType] = useState(QC_TYPES[0]);
  const [newChecker, setNewChecker] = useState(CHECKERS[0]);

  const filtered = items.filter((i) =>
    !keyword || i.dataset.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleCreate = () => {
    if (!newDataset) { message.warning("请选择数据集"); return; }
    const item: QCItem = {
      id: `q${Date.now()}`, dataset: newDataset, type: newType,
      checker: newChecker, status: "进行中", passRate: 0, issues: 0,
      created: new Date().toLocaleDateString("zh-CN"),
    };
    setItems([item, ...items]);
    message.success("质检任务已创建");
    setOpen(false);

    // simulate completion
    setTimeout(() => {
      const rate = Math.floor(Math.random() * 40 + 60);
      setItems((prev) => prev.map((i) => i.id === item.id
        ? { ...i, status: rate >= 80 ? "通过" : "不通过", passRate: rate, issues: Math.floor((100 - rate) / 10) }
        : i));
      message.info(`质检完成，通过率 ${rate}%`);
    }, 2500);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter((i) => i.id !== id));
    message.success("已删除");
  };

  const columns: ColumnsType<QCItem> = [
    { title: "数据集", dataIndex: "dataset", render: (v: string) => <span style={{ fontSize: 12 }}>{v}</span> },
    { title: "质检类型", dataIndex: "type", width: 120, render: (v: string) => <Tag>{v}</Tag> },
    { title: "质检员", dataIndex: "checker", width: 100 },
    {
      title: "状态", dataIndex: "status", width: 100,
      render: (v: string) => (
        <Tag color={v === "通过" ? "success" : v === "不通过" ? "error" : "processing"}>{v}</Tag>
      ),
    },
    {
      title: "通过率", dataIndex: "passRate", width: 160,
      render: (v: number, r) => r.status === "进行中"
        ? <Progress percent={50} size="small" status="active" />
        : <Progress percent={v} size="small" status={v >= 80 ? "success" : "exception"} />,
    },
    { title: "问题数", dataIndex: "issues", width: 80, render: (v: number) => v > 0 ? <Tag color="red">{v}</Tag> : <Tag color="green">0</Tag> },
    { title: "创建时间", dataIndex: "created", width: 120 },
    {
      title: "操作", width: 80,
      render: (_, r) => <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>,
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
        <Input prefix={<SearchOutlined />} placeholder="搜索数据集" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>创建质检任务</Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered}
        locale={{ emptyText: "暂无质检任务" }} />

      <Modal title="创建质检任务" open={open} onOk={handleCreate}
        onCancel={() => setOpen(false)} okText="创建" cancelText="取消">
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <Select placeholder="选择数据集 *" style={{ width: "100%" }} value={newDataset || undefined}
            onChange={(v) => setNewDataset(v)}
            options={mockDatasets.map((d) => ({ label: d.name, value: d.name }))} />
          <Select style={{ width: "100%" }} value={newType} onChange={(v) => setNewType(v)}
            options={QC_TYPES.map((t) => ({ label: t, value: t }))} />
          <Select style={{ width: "100%" }} value={newChecker} onChange={(v) => setNewChecker(v)}
            options={CHECKERS.map((c) => ({ label: c, value: c }))} />
        </Space>
      </Modal>
    </section>
  );
};

export default QualityCheckPage;
