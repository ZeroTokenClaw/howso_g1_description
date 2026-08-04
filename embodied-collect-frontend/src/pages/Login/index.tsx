import { useState } from "react";
import { Button, Checkbox, Form, Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { loginApi } from "@/api/auth";
import { useAuthStore } from "@/store/auth";

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        background: "#f7f8fa",
      }}
    >
      {/* left panel */}
      <div
        style={{
          flex: 1,
          background: "linear-gradient(135deg, #0f172a 0%, #1e3a5f 60%, #1d4ed8 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: 48,
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: 420, width: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40 }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                background: "rgba(255,255,255,0.15)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
                fontWeight: 700,
              }}
            >
              华
            </div>
            <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: 1 }}>华苏机器人仿真平台</span>
          </div>

          <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 12, lineHeight: 1.3 }}>
            机器人数据集<br />管理平台
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 15, lineHeight: 1.8, marginBottom: 40 }}>
            采集、标注、训练一体化<br />
            支持 MCAP / ROS Bag / LeRobot 等多种格式
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { icon: "📊", text: "数据采集与管理" },
              { icon: "🏷️", text: "多模态数据标注" },
              { icon: "🤖", text: "模型训练与导出" },
            ].map((item) => (
              <div key={item.text} style={{ display: "flex", alignItems: "center", gap: 12, color: "rgba(255,255,255,0.8)", fontSize: 14 }}>
                <span style={{ fontSize: 18 }}>{item.icon}</span>
                {item.text}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* right panel */}
      <div
        style={{
          width: 480,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 56px",
          background: "#fff",
        }}
      >
        <div style={{ width: "100%", maxWidth: 360 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, marginBottom: 6, color: "#111" }}>登录</h2>
          <p style={{ color: "#888", fontSize: 14, marginBottom: 32 }}>
            还没有账号？
            <a href="#" style={{ color: "#2563eb", marginLeft: 4 }}>注册</a>
          </p>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              username: localStorage.getItem("remember_username") || "",
              password: localStorage.getItem("remember_password") || "",
              remember: !!localStorage.getItem("remember_username"),
            }}
            onFinish={async (values) => {
              setLoading(true);
              try {
                const res = await loginApi({ username: values.username, password: values.password });
                setAuth({
                  token: res.data.access_token,
                  refreshToken: res.data.refresh_token,
                  user: res.data.user,
                });
                if (values.remember) {
                  localStorage.setItem("remember_username", values.username);
                  localStorage.setItem("remember_password", values.password);
                } else {
                  localStorage.removeItem("remember_username");
                  localStorage.removeItem("remember_password");
                }
                message.success("登录成功");
                navigate("/data");
              } finally {
                setLoading(false);
              }
            }}
          >
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>账号</span>}
              name="username"
              rules={[{ required: true, message: "请输入账号" }]}
            >
              <Input size="large" placeholder="用户名或邮箱" />
            </Form.Item>
            <Form.Item
              label={<span style={{ fontWeight: 500 }}>密码</span>}
              name="password"
              rules={[{ required: true, message: "请输入密码" }]}
            >
              <Input.Password size="large" placeholder="请输入密码" />
            </Form.Item>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <Form.Item name="remember" valuePropName="checked" style={{ margin: 0 }}>
                <Checkbox>保持登录</Checkbox>
              </Form.Item>
              <a href="#" style={{ color: "#2563eb", fontSize: 13 }}>忘记密码？</a>
            </div>
            <Button type="primary" htmlType="submit" block size="large" loading={loading}
              style={{ height: 46, fontSize: 15, fontWeight: 600 }}>
              登录
            </Button>
          </Form>

          <div style={{ marginTop: 24, textAlign: "center", color: "#bbb", fontSize: 12 }}>
            第三方登录
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
            <Button style={{ borderRadius: 8 }}>飞书</Button>
          </div>
        </div>

        <div style={{ position: "absolute", bottom: 24, color: "#ccc", fontSize: 12 }}>
          © 2023-2026 华苏机器人 &nbsp;·&nbsp;
          <a href="#" style={{ color: "#ccc" }}>隐私政策</a>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
