import { UserOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Form, Input, Layout, message, Modal, Space } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

const { Header } = Layout;

const AppHeader = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((s) => s.logout);
  const user = useAuthStore((s) => s.user);
  const setAuth = useAuthStore((s) => s.setAuth);
  const token = useAuthStore((s) => s.token);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const username = user?.email || user?.username || "admin";

  const [profileOpen, setProfileOpen] = useState(false);
  const [form] = Form.useForm();

  const handleSave = async () => {
    const values = await form.validateFields();
    // 更新本地 store 中的用户信息
    setAuth({
      token,
      refreshToken,
      user: { ...user, username: values.username, email: values.email, phone: values.phone },
    });
    message.success("个人信息已更新");
    setProfileOpen(false);
  };

  const openProfile = () => {
    form.setFieldsValue({
      username: user?.username ?? "",
      email: user?.email ?? "",
      phone: (user as { phone?: string })?.phone ?? "",
    });
    setProfileOpen(true);
  };

  return (
    <Header className="platform-header">
      <span />
      <Dropdown
        menu={{
          items: [
            { key: "profile", label: "个人设置" },
            { type: "divider" },
            { key: "logout", label: "退出登录", danger: true },
          ],
          onClick: ({ key }) => {
            if (key === "logout") { logout(); navigate("/login"); }
            if (key === "profile") openProfile();
          },
        }}
      >
        <Space className="header-account" style={{ cursor: "pointer" }}>
          <Avatar size={24} icon={<UserOutlined />} style={{ background: "#2f80ff" }} />
          <span style={{ fontSize: 13 }}>{username}</span>
        </Space>
      </Dropdown>

      <Modal
        title="个人设置"
        open={profileOpen}
        onOk={handleSave}
        onCancel={() => setProfileOpen(false)}
        okText="保存"
        cancelText="取消"
        width={440}
      >
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名" }]}>
            <Input prefix={<UserOutlined />} />
          </Form.Item>
          <Form.Item label="邮箱" name="email" rules={[{ type: "email", message: "请输入有效邮箱" }]}>
            <Input placeholder="example@company.com" />
          </Form.Item>
          <Form.Item label="手机号" name="phone">
            <Input placeholder="选填" />
          </Form.Item>
          <Form.Item label="修改密码" name="password">
            <Input.Password placeholder="不修改请留空" />
          </Form.Item>
        </Form>
      </Modal>
    </Header>
  );
};

export default AppHeader;
