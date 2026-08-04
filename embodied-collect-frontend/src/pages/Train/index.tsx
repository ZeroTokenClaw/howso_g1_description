import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Descriptions, Drawer, Form, Input, message, Modal, Progress, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockDatasets } from "@/mock/index";

interface TrainJob {
  id: string; name: string; base: string; dataset: string;
  status: string; progress: number; created: string; logs?: string;
}

const BASE_MODELS = ["ACT", "Diffusion Policy", "π0", "RoboFlamingo", "OpenVLA", "RT-2"];
const STATUS_COLOR: Record<string, string> = {
  训练中: "blue", 已完成: "green", 排队中: "orange", 失败: "red", 已停止: "default",
};

const initJobs: TrainJob[] = [
  { id: "m1", name: "ACT_kitchen_v1", base: "ACT", dataset: "20251218_KitchenCutlery_DualAirbot_01", status: "训练中", progress: 62, created: "2026/4/10", logs: "[INFO] Epoch 62/100 - loss: 0.0234\n[INFO] Epoch 61/100 - loss: 0.0251\n[INFO] Epoch 60/100 - loss: 0.0268" },
  { id: "m2", name: "Diffusion_fold_v2", base: "Diffusion Policy", dataset: "20241205_DualAirbot_TShirtFolding_01", status: "已完成", progress: 100, created: "2026/3/28", logs: "[INFO] Training complete. Best loss: 0.0089" },
  { id: "m3", name: "Pi0_pickup_v1", base: "π0", dataset: "20241224_demo_gripper_PickAndPlace_ljw", status: "排队中", progress: 0, created: "2026/4/18", logs: "[INFO] Waiting in queue..." },
];

const TrainPage = () => {
  const [jobs, setJobs] = useState<TrainJob[]>(initJobs);
  const [createOpen, setCreateOpen] = useState(false);
  const [detailJob, setDetailJob] = useState<TrainJob | null>(null);
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    const newJob: TrainJob = {
      id: `m${Date.now()}`,
      name: values.name,
      base: values.base,
      dataset: values.dataset,
      status: "排队中",
      progress: 0,
      created: new Date().toLocaleDateString("zh-CN"),
      logs: "[INFO] Job created, waiting in queue...",
    };
    setJobs([newJob, ...jobs]);
    message.success("训练任务已创建，正在排队中...");
    setCreateOpen(false);
    form.resetFields();

    // 模拟开始训练
    setTimeout(() => {
      setJobs((prev) => prev.map((j) => j.id === newJob.id
        ? { ...j, status: "训练中", progress: 5, logs: "[INFO] Training started...\n[INFO] Epoch 1/100 - loss: 0.1234" }
        : j));
      message.info(`${newJob.name} 开始训练`);
    }, 2000);
  };

  const handleStop = (job: TrainJob) => {
    if (job.status === "已完成" || job.status === "已停止") {
      message.warning("任务已结束，无法停止");
      return;
    }
    setJobs(jobs.map((j) => j.id === job.id
      ? { ...j, status: "已停止", logs: (j.logs ?? "") + "\n[WARN] Training stopped by user." }
      : j));
    message.success(`已停止：${job.name}`);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((j) => j.id !== id));
    message.success("已删除");
  };

  const columns: ColumnsType<TrainJob> = [
    { title: "模型名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "基础模型", dataIndex: "base", width: 160, render: (v: string) => <Tag color="purple">{v}</Tag> },
    { title: "训练数据集", dataIndex: "dataset", render: (v: string) => <span style={{ fontSize: 12, color: "#555" }}>{v}</span> },
    {
      title: "状态", dataIndex: "status", width: 100,
      render: (v: string) => <Tag color={STATUS_COLOR[v] ?? "default"}>{v}</Tag>,
    },
    {
      title: "进度", dataIndex: "progress", width: 180,
      render: (v: number, r) => (
        <Progress
          percent={v}
          size="small"
          status={r.status === "失败" ? "exception" : r.status === "已停止" ? "normal" : v === 100 ? "success" : "active"}
        />
      ),
    },
    { title: "创建时间", dataIndex: "created", width: 120 },
    {
      title: "操作", width: 160,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => setDetailJob(r)}>详情</Button>
          <Button type="link" size="small" danger
            disabled={r.status === "已完成" || r.status === "已停止"}
            onClick={() => handleStop(r)}>
            停止
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 12px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>模型训练</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          新建训练任务
        </Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={false} columns={columns} dataSource={jobs} />

      {/* 新建训练任务弹窗 */}
      <Modal title="新建训练任务" open={createOpen}
        onOk={handleCreate} onCancel={() => { setCreateOpen(false); form.resetFields(); }}
        okText="创建" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="任务名称" name="name" rules={[{ required: true, message: "请输入任务名称" }]}>
            <Input placeholder="如：ACT_kitchen_v2" />
          </Form.Item>
          <Form.Item label="基础模型" name="base" rules={[{ required: true, message: "请选择基础模型" }]}>
            <Select placeholder="选择基础模型"
              options={BASE_MODELS.map((m) => ({ label: m, value: m }))} />
          </Form.Item>
          <Form.Item label="训练数据集" name="dataset" rules={[{ required: true, message: "请选择数据集" }]}>
            <Select placeholder="选择数据集"
              options={mockDatasets.map((d) => ({ label: d.name, value: d.name }))} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 详情 Drawer */}
      <Drawer
        title={detailJob?.name ?? "训练详情"}
        open={!!detailJob}
        onClose={() => setDetailJob(null)}
        width={480}
      >
        {detailJob && (
          <Space direction="vertical" style={{ width: "100%" }} size={16}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="模型名称">{detailJob.name}</Descriptions.Item>
              <Descriptions.Item label="基础模型"><Tag color="purple">{detailJob.base}</Tag></Descriptions.Item>
              <Descriptions.Item label="训练数据集">{detailJob.dataset}</Descriptions.Item>
              <Descriptions.Item label="状态"><Tag color={STATUS_COLOR[detailJob.status]}>{detailJob.status}</Tag></Descriptions.Item>
              <Descriptions.Item label="进度">
                <Progress percent={detailJob.progress} size="small"
                  status={detailJob.status === "失败" ? "exception" : detailJob.progress === 100 ? "success" : "active"} />
              </Descriptions.Item>
              <Descriptions.Item label="创建时间">{detailJob.created}</Descriptions.Item>
            </Descriptions>

            <div>
              <div style={{ fontWeight: 600, marginBottom: 8 }}>训练日志</div>
              <pre style={{
                background: "#0d1117", color: "#7ee787", padding: 16,
                borderRadius: 6, fontSize: 12, lineHeight: 1.6,
                maxHeight: 300, overflow: "auto", margin: 0,
              }}>
                {detailJob.logs ?? "暂无日志"}
              </pre>
            </div>

            <Space>
              <Button danger
                disabled={detailJob.status === "已完成" || detailJob.status === "已停止"}
                onClick={() => { handleStop(detailJob); setDetailJob(null); }}>
                停止训练
              </Button>
              <Button onClick={() => setDetailJob(null)}>关闭</Button>
            </Space>
          </Space>
        )}
      </Drawer>
    </section>
  );
};

export default TrainPage;
