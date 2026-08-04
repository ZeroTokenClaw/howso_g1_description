import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Form, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockDevices, type MockDevice } from "@/mock/index";

const STATUS_COLOR: Record<string, string> = { 在线: "success", 离线: "default", 故障: "error" };

const DeviceManagementPage = () => {
  const [devices, setDevices] = useState<MockDevice[]>(mockDevices);
  const [keyword, setKeyword] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [editDevice, setEditDevice] = useState<MockDevice | null>(null);
  const [form] = Form.useForm();

  const filtered = devices.filter((d) =>
    !keyword || d.name.toLowerCase().includes(keyword.toLowerCase()) || d.code.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editDevice) {
      setDevices(devices.map((d) => d.id === editDevice.id ? { ...editDevice, ...values } : d));
      message.success("已更新");
    } else {
      setDevices([{ id: `d${Date.now()}`, ...values, status: "离线", updated: new Date().toLocaleString("zh-CN") }, ...devices]);
      message.success("设备已添加");
    }
    setCreateOpen(false);
    setEditDevice(null);
    form.resetFields();
  };

  const handleDelete = (id: string) => {
    setDevices(devices.filter((d) => d.id !== id));
    message.success("已删除");
  };

  const openEdit = (d: MockDevice) => {
    setEditDevice(d);
    form.setFieldsValue(d);
    setCreateOpen(true);
  };

  const columns: ColumnsType<MockDevice> = [
    { title: "设备名称", dataIndex: "name", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "设备编号", dataIndex: "code", width: 120 },
    { title: "类型", dataIndex: "type", width: 110 },
    { title: "IP 地址", dataIndex: "ip", width: 140, render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    {
      title: "状态", dataIndex: "status", width: 90,
      render: (v: string) => <Badge status={STATUS_COLOR[v] as "success" | "default" | "error"} text={v} />,
    },
    { title: "所属项目", dataIndex: "project", width: 110, render: (v: string) => <Tag color={v === "人类数据" ? "blue" : "green"}>{v}</Tag> },
    { title: "最后更新", dataIndex: "updated", width: 160 },
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
        <Input prefix={<SearchOutlined />} placeholder="搜索设备名/编号" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
        <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditDevice(null); form.resetFields(); setCreateOpen(true); }}>
          添加设备
        </Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered} />

      <Modal title={editDevice ? "编辑设备" : "添加设备"} open={createOpen}
        onOk={handleSave} onCancel={() => { setCreateOpen(false); setEditDevice(null); form.resetFields(); }}
        okText="保存" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="设备名称" name="name" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="设备编号" name="code" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="设备类型" name="type" rules={[{ required: true }]}>
            <Select options={["采集站", "边缘节点", "传感器", "控制器"].map((t) => ({ label: t, value: t }))} />
          </Form.Item>
          <Form.Item label="IP 地址" name="ip"><Input placeholder="192.168.1.x" /></Form.Item>
          <Form.Item label="所属项目" name="project">
            <Select options={[{ label: "遥操作", value: "遥操作" }, { label: "人类数据", value: "人类数据" }]} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default DeviceManagementPage;
