import { useState } from "react";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { Badge, Button, Form, Input, message, Modal, Select, Space, Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { mockUsers, type MockUser } from "@/mock/index";

const ROLES = ["管理员", "标注员", "审核员", "采集员", "访客"];

const UserManagementPage = () => {
  const [users, setUsers] = useState<MockUser[]>(mockUsers);
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [editUser, setEditUser] = useState<MockUser | null>(null);
  const [form] = Form.useForm();

  const filtered = users.filter((u) =>
    !keyword || u.username.includes(keyword) || u.email.includes(keyword)
  );

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editUser) {
      setUsers(users.map((u) => u.id === editUser.id ? { ...editUser, ...values } : u));
      message.success("已更新");
    } else {
      setUsers([{ id: `u${Date.now()}`, status: "启用", created: new Date().toLocaleDateString("zh-CN"), ...values }, ...users]);
      message.success("用户已创建");
    }
    setOpen(false); setEditUser(null); form.resetFields();
  };

  const handleToggleStatus = (id: string) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "启用" ? "禁用" : "启用" } : u));
    message.success("状态已更新");
  };

  const handleDelete = (id: string) => {
    setUsers(users.filter((u) => u.id !== id));
    message.success("已删除");
  };

  const openEdit = (u: MockUser) => {
    setEditUser(u); form.setFieldsValue(u); setOpen(true);
  };

  const columns: ColumnsType<MockUser> = [
    { title: "用户名", dataIndex: "username", render: (v: string) => <span style={{ fontWeight: 500 }}>{v}</span> },
    { title: "邮箱", dataIndex: "email" },
    { title: "角色", dataIndex: "role", width: 110, render: (v: string) => <Tag color="blue">{v}</Tag> },
    {
      title: "状态", dataIndex: "status", width: 90,
      render: (v: string) => <Badge status={v === "启用" ? "success" : "default"} text={v} />,
    },
    { title: "创建时间", dataIndex: "created", width: 120 },
    {
      title: "操作", width: 180,
      render: (_, r) => (
        <Space>
          <Button type="link" size="small" onClick={() => openEdit(r)}>编辑</Button>
          <Button type="link" size="small" onClick={() => handleToggleStatus(r.id)}>
            {r.status === "启用" ? "禁用" : "启用"}
          </Button>
          <Button type="link" size="small" danger onClick={() => handleDelete(r.id)}>删除</Button>
        </Space>
      ),
    },
  ];

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
        <Input prefix={<SearchOutlined />} placeholder="搜索用户名/邮箱" value={keyword}
          onChange={(e) => setKeyword(e.target.value)} style={{ width: 240 }} allowClear />
        <Button type="primary" icon={<PlusOutlined />}
          onClick={() => { setEditUser(null); form.resetFields(); setOpen(true); }}>
          添加用户
        </Button>
      </div>

      <Table className="flat-table" rowKey="id" pagination={{ pageSize: 20 }} columns={columns} dataSource={filtered} />

      <Modal title={editUser ? "编辑用户" : "添加用户"} open={open}
        onOk={handleSave} onCancel={() => { setOpen(false); setEditUser(null); form.resetFields(); }}
        okText="保存" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ required: true, type: "email" }]}><Input /></Form.Item>
          {!editUser && (
            <Form.Item label="密码" name="password" rules={[{ required: true }]}>
              <Input.Password placeholder="初始密码" />
            </Form.Item>
          )}
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select options={ROLES.map((r) => ({ label: r, value: r }))} />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
};

export default UserManagementPage;
