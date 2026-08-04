import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Form, Input, InputNumber, message, Modal, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockRobots, type MockRobot } from "@/mock/index";

const RobotManagementPage = () => {
  const [robots, setRobots] = useState<MockRobot[]>(mockRobots);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [editRobot, setEditRobot] = useState<MockRobot | null>(null);
  const [form] = Form.useForm();

  const filtered = robots.filter((r) =>
    !keyword || r.name.toLowerCase().includes(keyword.toLowerCase()) || r.model.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editRobot) {
      setRobots(robots.map((r) => r.id === editRobot.id ? { ...editRobot, ...values } : r));
      message.success("已更新");
    } else {
      setRobots([{ id: `r${Date.now()}`, status: "离线", ...values }, ...robots]);
      message.success("机器人已添加");
    }
    setOpen(false); setEditRobot(null); form.resetFields();
  };

  const handleDelete = (id: string) => {
    setRobots(robots.filter((r) => r.id !== id));
    message.success("已删除");
  };

  const openEdit = (r: MockRobot) => {
    setEditRobot(r); form.setFieldsValue(r); setOpen(true);
  };

  const columns: ColumnsType<MockRobot> = [
    { title: "机器人名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "型号", dataIndex: "model", width: 150 },
    { title: "关节数", dataIndex: "joints", width: 90, render: (v: number) => `${v} 轴` },
    { title: "自由度", dataIndex: "dof", width: 90, render: (v: number) => `${v} DOF` },
    {
      title: "状态", dataIndex: "status", width: 90,
      render: (v: string) => <Badge status={v === "在线" ? "success" : "default"} text={v} />,
    },
    { title: "绑定设备", dataIndex: "device", width: 140 },
    { title: "所属项目", dataIndex: "project", width: 110, render: (v: string) => <Tag color={v === "人类数据" ? "blue" : "green"}>{v}</Tag> },
    {
      title: "操作", width: 120,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(r)}>编辑</Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
        <Input prefix={<SearchOutlined />} placeholder="搜索机器人名/型号" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditRobot(null); form.resetFields(); setOpen(true); }}>
          添加机器人
        </Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered} />

      <Modal title={editRobot ? "编辑机器人" : "添加机器人"} open={open}
        onOk={handleSave} onCancel={() => { setOpen(false); setEditRobot(null); form.resetFields(); }}
        okText="保存" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="机器人名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="型号" name="model" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="关节数" name="joints"><InputNumber min={1} max={20} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="自由度 (DOF)" name="dof"><InputNumber min={1} max={20} style={{ width: "100%" }} /></Form.Item>
          <Form.Item label="绑定设备" name="device"><Input placeholder="设备名称" /></Form.Item>
          <Form.Item label="所属项目" name="project">
            <Select options={[{ label: "遥操作", value: "遥操作" }, { label: "人类数据", value: "人类数据" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default RobotManagementPage;
