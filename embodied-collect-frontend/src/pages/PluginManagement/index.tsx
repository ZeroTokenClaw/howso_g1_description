import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { Button, Card, Col, message, Modal, Row, Switch, Tag } from "antd";

interface Plugin {
  id: string; name: string; desc: string;
  version: string; author: string; enabled: boolean; category: string;
}

const initPlugins: Plugin[] = [
  { id: "p1", name: "MCAP 解析器", desc: "解析 MCAP 格式文件，提取 topic 和时间戳信息", version: "1.2.0", author: "io-ai", enabled: true, category: "解析" },
  { id: "p2", name: "LeRobot 转换器", desc: "将数据集转换为 LeRobot 标准格式", version: "0.9.1", author: "io-ai", enabled: true, category: "转换" },
  { id: "p3", name: "丢帧检测", desc: "自动检测数据集中的丢帧和时间戳异常", version: "1.0.3", author: "community", enabled: false, category: "质检" },
  { id: "p4", name: "BVH 可视化", desc: "人体动作捕捉 BVH 文件可视化标注", version: "0.5.0", author: "community", enabled: false, category: "可视化" },
];

const PluginManagementPage = () => {
  const [plugins, setPlugins] = useState<Plugin[]>(initPlugins);
  const [installOpen, setInstallOpen] = useState(false);

  const handleToggle = (id: string, enabled: boolean) => {
    setPlugins(plugins.map((p) => p.id === id ? { ...p, enabled } : p));
    message.success(enabled ? "插件已启用" : "插件已禁用");
  };

  const handleUninstall = (id: string) => {
    setPlugins(plugins.filter((p) => p.id !== id));
    message.success("插件已卸载");
  };

  const CATEGORY_COLOR: Record<string, string> = {
    解析: "blue", 转换: "green", 质检: "orange", 可视化: "purple",
  };

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 16px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>插件管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setInstallOpen(true)}>安装插件</Button>
      </div>

      <Row gutter={[16, 16]}>
        {plugins.map((p) => (
          <Col key={p.id} xs={24} sm={12} lg={8}>
            <Card
              size="small"
              title={
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <Tag color={CATEGORY_COLOR[p.category] ?? "default"} style={{ fontSize: 11 }}>{p.category}</Tag>
                </div>
              }
              extra={
                <Switch
                  checked={p.enabled}
                  size="small"
                  onChange={(v) => handleToggle(p.id, v)}
                />
              }
            >
              <p style={{ fontSize: 13, color: "#666", margin: "0 0 12px" }}>{p.desc}</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12, color: "#aaa" }}>
                <span>v{p.version} · {p.author}</span>
                <Button type="link" size="small" danger onClick={() => handleUninstall(p.id)}>卸载</Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal title="安装插件" open={installOpen} onOk={() => { message.info("插件市场功能开发中"); setInstallOpen(false); }}
        onCancel={() => setInstallOpen(false)} okText="前往插件市场" cancelText="取消">
        <p style={{ color: "#888", marginTop: 12 }}>插件市场功能即将上线，敬请期待。</p>
        <p style={{ color: "#888" }}>您也可以通过上传插件包的方式手动安装。</p>
      </Modal>
    </section>
  );
};

export default PluginManagementPage;
