import { useState } from "react";
import {
  CloudDownloadOutlined, CodeOutlined, DeleteOutlined,
  FileImageOutlined, PlusOutlined, TableOutlined, ClockCircleOutlined, ScissorOutlined,
} from "@ant-design/icons";
import { Button, message, Modal, Progress, Select, Space, Switch, Table, Tabs, Tag, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockDatasets, mockExportJobs, type MockExportJob } from "@/mock/index";

const FORMATS = ["JSON", "表格CSV", "原始MCAP", "LeRobot", "RLDS", "HDF5", "图像标注", "时间对齐"];

const FORMAT_DESC: Record<string, { title: string; desc: string; fields: string[] }> = {
  json: { title: "JSON 导出", desc: "将标注数据导出为结构化 JSON 格式，包含帧级标注、关节角、时间戳等字段。", fields: ["标注内容", "时间戳", "关节角度", "末端位姿"] },
  table: { title: "表格 CSV 导出", desc: "将数据集元信息和统计数据导出为 CSV 表格，便于在 Excel 中分析。", fields: ["数据集名称", "时长", "大小", "标注数量", "上传者"] },
  raw: { title: "原始 MCAP 下载", desc: "直接下载原始 MCAP 文件，包含所有传感器 topic 的完整数据。", fields: ["所有 ROS topic", "原始时间戳", "传感器数据"] },
  lerobot: { title: "LeRobot 格式导出", desc: "将数据集转换为 LeRobot 标准格式，可直接用于 ACT、Diffusion Policy 等模型训练。", fields: ["episodes/", "meta/", "data/chunk-000/"] },
  rlds: { title: "RLDS 格式导出", desc: "导出为 TensorFlow RLDS 格式，兼容 Google 机器人学习数据集标准。", fields: ["observation", "action", "reward", "discount"] },
  hdf5: { title: "HDF5 格式导出", desc: "导出为 HDF5 格式，适合大规模科学数据存储和 PyTorch 直接读取。", fields: ["observations/", "actions/", "timestamps"] },
  image: { title: "图像标注导出", desc: "导出图像帧和对应的标注框、分割掩码，兼容 COCO / YOLO 格式。", fields: ["images/", "annotations.json", "labels/"] },
  align: { title: "时间对齐导出", desc: "对多传感器数据进行时间对齐后导出，解决不同频率传感器的同步问题。", fields: ["对齐后的时间戳", "插值数据", "对齐报告"] },
};

// 每个 tab 对应的格式名
const TAB_FORMAT: Record<string, string> = {
  json: "JSON", table: "表格CSV", raw: "原始MCAP",
  lerobot: "LeRobot", rlds: "RLDS", hdf5: "HDF5",
  image: "图像标注", align: "时间对齐",
};

const ImportExportPage = () => {
  const [jobs, setJobs] = useState<MockExportJob[]>(mockExportJobs);
  const [selectedDatasets, setSelectedDatasets] = useState<string[]>([]);
  const [includeLink, setIncludeLink] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("json");
  const [createFormat, setCreateFormat] = useState("JSON");

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setCreateFormat(TAB_FORMAT[key] ?? "JSON");
  };

  const handleCreateExport = () => {
    if (!selectedDatasets.length) { message.warning("请选择要导出的数据集"); return; }
    const newJob: MockExportJob = {
      id: `e${Date.now()}`,
      name: `${selectedDatasets.length}个数据集_${createFormat}_${new Date().toLocaleDateString("zh-CN")}`,
      format: createFormat,
      size: "—",
      status: "处理中",
      created: new Date().toLocaleDateString("zh-CN"),
    };
    setJobs([newJob, ...jobs]);
    message.success("导出任务已创建，正在处理中...");
    setCreateOpen(false);
    setSelectedDatasets([]);

    setTimeout(() => {
      setJobs((prev) => prev.map((j) => j.id === newJob.id
        ? { ...j, status: "已完成", size: `${(Math.random() * 500 + 10).toFixed(0)} MB`, url: "#" }
        : j));
      message.success(`导出完成：${newJob.name}`);
    }, 3000);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
    message.success("已删除");
  };

  const handleDownload = (job: MockExportJob) => {
    if (job.status !== "已完成") { message.warning("任务尚未完成"); return; }
    message.success(`开始下载：${job.name}`);
  };

  const jobColumns: ColumnsType<MockExportJob> = [
    { title: "导出名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "格式", dataIndex: "format", width: 100, render: (v: string) => <Tag color="blue">{v}</Tag> },
    { title: "文件大小", dataIndex: "size", width: 110 },
    {
      title: "状态", dataIndex: "status", width: 150,
      render: (v: string) => {
        if (v === "处理中") return <Space size={4}><Tag color="processing">处理中</Tag><Progress percent={60} size="small" showInfo={false} style={{ width: 60 }} /></Space>;
        if (v === "已完成") return <Tag color="success">已完成</Tag>;
        return <Tag color="error">失败</Tag>;
      },
    },
    { title: "创建时间", dataIndex: "created", width: 120 },
    {
      title: "操作", width: 140,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" icon={<CloudDownloadOutlined />}
            disabled={r.status !== "已完成"} onClick={() => handleDownload(r)}>下载</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />} onClick={() => handleDelete(r.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  // 每个 tab 的内容：格式说明 + 该格式的历史导出记录
  const renderTabContent = (tabKey: string) => {
    const info = FORMAT_DESC[tabKey];
    const fmt = TAB_FORMAT[tabKey];
    const tabJobs = jobs.filter((j) => j.format === fmt);

    return (
      <div>
        {/* 格式说明卡片 */}
        <div style={{ background: "#f8faff", border: "1px solid #e0eaff", borderRadius: 8, padding: "16px 20px", marginBottom: 16 }}>
          <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 6 }}>{info.title}</div>
          <div style={{ color: "#555", fontSize: 13, marginBottom: 10 }}>{info.desc}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {info.fields.map((f) => <Tag key={f} color="blue" style={{ fontSize: 11 }}>{f}</Tag>)}
          </div>
        </div>

        {/* 工具栏 */}
        <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "8px 0 12px" }}>
          <Space size={4} align="center">
            <span style={{ fontSize: 13, color: "#888" }}>包含下载链接（2小时有效）</span>
            <Switch checked={includeLink} onChange={setIncludeLink} size="small" />
          </Space>
          <Button
            disabled={!tabJobs.some((j) => j.status === "已完成")}
            onClick={() => message.info("批量下载功能开发中")}
          >
            下载全部
          </Button>
          <Button type="primary" icon={<PlusOutlined />}
            onClick={() => { setCreateFormat(fmt); setCreateOpen(true); }}>
            新建导出
          </Button>
        </div>

        {/* 该格式的导出记录 */}
        <Table className="flat-table" rowKey="id" pagination={{ pageSize: 10 }}
          columns={jobColumns} dataSource={tabJobs}
          locale={{ emptyText: `暂无 ${fmt} 导出记录，点击「新建导出」开始` }} />
      </div>
    );
  };

  const tabItems = [
    { key: "json", label: <span><CodeOutlined /> JSON</span>, children: renderTabContent("json") },
    { key: "table", label: <span><TableOutlined /> 表格CSV</span>, children: renderTabContent("table") },
    { key: "raw", label: <span><CloudDownloadOutlined /> 原始MCAP</span>, children: renderTabContent("raw") },
    { key: "lerobot", label: "LeRobot", children: renderTabContent("lerobot") },
    { key: "rlds", label: "RLDS", children: renderTabContent("rlds") },
    { key: "hdf5", label: "HDF5", children: renderTabContent("hdf5") },
    { key: "image", label: <span><FileImageOutlined /> 图像标注</span>, children: renderTabContent("image") },
    { key: "align", label: <span><ClockCircleOutlined /> 时间对齐</span>, children: renderTabContent("align") },
    {
      key: "cut", label: <span><ScissorOutlined /> MCAP切块</span>,
      children: (
        <div style={{ padding: "20px 0", color: "#888", fontSize: 14 }}>
          <Typography.Title level={5}>MCAP 切块工具</Typography.Title>
          <p>将长时间 MCAP 文件按时间段切割为多个片段，便于标注和训练。</p>
          <Button type="primary" onClick={() => message.info("切块功能开发中，敬请期待")}>开始切块</Button>
        </div>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 4px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>导入 / 导出</h2>
      </div>

      <Tabs activeKey={activeTab} onChange={handleTabChange} items={tabItems} />

      {/* 新建导出弹窗 */}
      <Modal title={`新建导出任务 · ${createFormat}`} open={createOpen}
        onOk={handleCreateExport} onCancel={() => setCreateOpen(false)}
        okText="开始导出" cancelText="取消">
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={14}>
          <div>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>选择数据集</div>
            <Select mode="multiple" style={{ width: "100%" }} placeholder="选择要导出的数据集"
              value={selectedDatasets} onChange={setSelectedDatasets}
              options={mockDatasets.map((d) => ({ label: d.name, value: d.id }))} />
          </div>
          <div>
            <div style={{ marginBottom: 6, fontWeight: 500 }}>导出格式</div>
            <Select style={{ width: "100%" }} value={createFormat} onChange={setCreateFormat}
              options={FORMATS.map((f) => ({ label: f, value: f }))} />
          </div>
        </Space>
      </Modal>
    </section>
  );
};

export default ImportExportPage;
