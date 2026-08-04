import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Modal, Select, Space, Switch, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockSystemConfigs } from "@/mock/index";

interface SysConfig { id: string; key: string; value: string; group: string; encrypted: boolean; updated: string; }

const GROUPS = ["基础", "存储", "安全", "缓存", "邮件", "其他"];

const SystemSettingsPage = () => {
  const [configs, setConfigs] = useState<SysConfig[]>(mockSystemConfigs);
  const [open, setOpen] = useState(false);
  const [editConfig, setEditConfig] = useState<SysConfig | null>(null);
  const [form] = Form.useForm();

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editConfig) {
      setConfigs(configs.map((c) => c.id === editConfig.id
        ? { ...editConfig, ...values, updated: new Date().toLocaleDateString("zh-CN") } : c));
      message.success("已更新");
    } else {
      setConfigs([...configs, {
        id: `s${Date.now()}`, ...values,
        updated: new Date().toLocaleDateString("zh-CN"),
      }]);
      message.success("已添加");
    }
    setOpen(false); setEditConfig(null); form.resetFields();
  };

  const handleDelete = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id));
    message.success("已删除");
  };

  const openEdit = (c: SysConfig) => {
    setEditConfig(c); form.setFieldsValue(c); setOpen(true);
  };

  const columns: ColumnsType<SysConfig> = [
    { title: "配置 Key", dataIndex: "key", render: (v: string) => <code style={{ fontSize: 12 }}>{v}</code> },
    {
      title: "配置值", dataIndex: "value", width: 200,
      render: (v: string, r) => r.encrypted ? <span style={{ color: "#aaa" }}>******</span> : <span style={{ fontSize: 13 }}>{v}</span>,
    },
    { title: "分组", dataIndex: "group", width: 90, render: (v: string) => <Tag>{v}</Tag> },
    {
      title: "加密", dataIndex: "encrypted", width: 80,
      render: (v: boolean) => <Switch checked={v} size="small" disabled />,
    },
    { title: "更新时间", dataIndex: "updated", width: 120 },
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
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>系统设置</h2>
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditConfig(null); form.resetFields(); setOpen(true); }}>
          添加配置
        </Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={false} columns={columns} dataSource={configs} />

      <Modal title={editConfig ? "编辑配置" : "添加配置"} open={open}
        onOk={handleSave} onCancel={() => { setOpen(false); setEditConfig(null); form.resetFields(); }}
        okText="保存" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="配置 Key" name="key" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="配置值" name="value" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="分组" name="group" rules={[{ required: true }]}>
            <Select options={GROUPS.map((g) => ({ label: g, value: g }))} />
          </Form.Item>
          <Form.Item label="是否加密" name="encrypted" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default SystemSettingsPage;
