import { useState } from "react";
import { Avatar, Button, Card, Col, Descriptions, Drawer, Form, Input, message, Modal, Row, Select, Space, Tag } from "antd";
import { PlusOutlined, TeamOutlined, SettingOutlined, DeleteOutlined, UserAddOutlined } from "@ant-design/icons";

interface Project {
  id: string; name: string; type: string;
  members: string[]; datasets: number; created: string; desc?: string;
}

const initProjects: Project[] = [
  { id: "p1", name: "遥操作", type: "共享", members: ["iodemo", "puxk", "chenml"], datasets: 6, created: "2024/1/1", desc: "遥操作机器人数据采集项目" },
  { id: "p2", name: "人类数据", type: "共享", members: ["iodemo", "puxk"], datasets: 4, created: "2024/3/15", desc: "人类示教数据采集项目" },
  { id: "p3", name: "USER_IAWBAM", type: "个人空间", members: ["zhaoyong1122@proton.me"], datasets: 0, created: "2026/1/1", desc: "个人工作空间" },
];

const COLORS = ["#2563eb", "#16a34a", "#d97706", "#7c3aed", "#db2777", "#0891b2"];
const ALL_USERS = ["iodemo", "puxk", "chenml", "marker", "picker", "zhaoyong1122@proton.me"];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>(initProjects);
  const [createOpen, setCreateOpen] = useState(false);
  const [manageProject, setManageProject] = useState<Project | null>(null);
  const [addMemberOpen, setAddMemberOpen] = useState(false);
  const [newMember, setNewMember] = useState("");
  const [form] = Form.useForm();

  const handleCreate = async () => {
    const values = await form.validateFields();
    setProjects([...projects, {
      id: `p${Date.now()}`,
      name: values.name,
      type: values.type ?? "共享",
      members: [],
      datasets: 0,
      created: new Date().toLocaleDateString("zh-CN"),
      desc: values.desc ?? "",
    }]);
    message.success(`项目「${values.name}」已创建`);
    setCreateOpen(false);
    form.resetFields();
  };

  const handleDeleteProject = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
    setManageProject(null);
    message.success("项目已删除");
  };

  const handleAddMember = () => {
    if (!newMember || !manageProject) return;
    if (manageProject.members.includes(newMember)) {
      message.warning("该成员已在项目中");
      return;
    }
    const updated = { ...manageProject, members: [...manageProject.members, newMember] };
    setProjects(projects.map((p) => p.id === manageProject.id ? updated : p));
    setManageProject(updated);
    setNewMember("");
    setAddMemberOpen(false);
    message.success(`已添加成员：${newMember}`);
  };

  const handleRemoveMember = (member: string) => {
    if (!manageProject) return;
    const updated = { ...manageProject, members: manageProject.members.filter((m) => m !== member) };
    setProjects(projects.map((p) => p.id === manageProject.id ? updated : p));
    setManageProject(updated);
    message.success(`已移除：${member}`);
  };

  return (
    <section className="platform-page">
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 0 20px" }}>
        <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600 }}>项目管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateOpen(true)}>
          新建项目
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {projects.map((p, i) => (
          <Col key={p.id} xs={24} sm={12} lg={8}>
            <Card
              hoverable
              style={{ borderRadius: 8 }}
              title={
                <Space>
                  <span style={{
                    display: "inline-flex", alignItems: "center", justifyContent: "center",
                    width: 32, height: 32, borderRadius: 8,
                    background: COLORS[i % COLORS.length], color: "#fff", fontWeight: 700, fontSize: 14,
                  }}>
                    {p.name[0].toUpperCase()}
                  </span>
                  <span style={{ fontWeight: 600 }}>{p.name}</span>
                  <Tag color={p.type === "个人空间" ? "blue" : "green"} style={{ fontSize: 11 }}>{p.type}</Tag>
                </Space>
              }
              extra={
                <Button
                  type="link"
                  size="small"
                  icon={<SettingOutlined />}
                  onClick={() => setManageProject(p)}
                >
                  管理
                </Button>
              }
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {p.desc && <div style={{ fontSize: 13, color: "#888" }}>{p.desc}</div>}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <TeamOutlined style={{ color: "#888" }} />
                  <span style={{ fontSize: 13, color: "#555" }}>成员</span>
                  <Avatar.Group maxCount={4} size={24}>
                    {p.members.map((m) => (
                      <Avatar key={m} size={24} style={{ background: COLORS[m.length % COLORS.length], fontSize: 10 }}>
                        {m[0].toUpperCase()}
                      </Avatar>
                    ))}
                  </Avatar.Group>
                  <span style={{ fontSize: 12, color: "#888" }}>{p.members.length} 人</span>
                </div>
                <div style={{ fontSize: 13, color: "#555" }}>
                  数据集：<strong>{p.datasets}</strong> 条
                </div>
                <div style={{ fontSize: 12, color: "#aaa" }}>创建于 {p.created}</div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* 新建项目弹窗 */}
      <Modal title="新建项目" open={createOpen}
        onOk={handleCreate} onCancel={() => { setCreateOpen(false); form.resetFields(); }}
        okText="创建" cancelText="取消">
        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item label="项目名称" name="name" rules={[{ required: true, message: "请输入项目名称" }]}>
            <Input placeholder="如：厨房操作数据集" />
          </Form.Item>
          <Form.Item label="项目类型" name="type" initialValue="共享">
            <Select options={[{ label: "共享", value: "共享" }, { label: "个人空间", value: "个人空间" }]} />
          </Form.Item>
          <Form.Item label="项目描述" name="desc">
            <Input.TextArea placeholder="简要描述项目用途" rows={2} />
          </Form.Item>
        </Form>
      </Modal>

      {/* 项目管理 Drawer */}
      <Drawer
        title={`管理项目：${manageProject?.name}`}
        open={!!manageProject}
        onClose={() => setManageProject(null)}
        width={440}
        extra={
          <Button danger size="small" icon={<DeleteOutlined />}
            onClick={() => manageProject && handleDeleteProject(manageProject.id)}>
            删除项目
          </Button>
        }
      >
        {manageProject && (
          <Space direction="vertical" style={{ width: "100%" }} size={20}>
            <Descriptions bordered size="small" column={1}>
              <Descriptions.Item label="项目名称">{manageProject.name}</Descriptions.Item>
              <Descriptions.Item label="类型">
                <Tag color={manageProject.type === "个人空间" ? "blue" : "green"}>{manageProject.type}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="数据集数量">{manageProject.datasets} 条</Descriptions.Item>
              <Descriptions.Item label="创建时间">{manageProject.created}</Descriptions.Item>
              {manageProject.desc && <Descriptions.Item label="描述">{manageProject.desc}</Descriptions.Item>}
            </Descriptions>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                <span style={{ fontWeight: 600 }}>成员管理（{manageProject.members.length} 人）</span>
                <Button size="small" icon={<UserAddOutlined />} onClick={() => setAddMemberOpen(true)}>
                  添加成员
                </Button>
              </div>
              <Space direction="vertical" style={{ width: "100%" }} size={8}>
                {manageProject.members.map((m) => (
                  <div key={m} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "8px 12px", background: "#f8faff", borderRadius: 6,
                  }}>
                    <Space size={8}>
                      <Avatar size={28} style={{ background: COLORS[m.length % COLORS.length], fontSize: 11 }}>
                        {m[0].toUpperCase()}
                      </Avatar>
                      <span style={{ fontSize: 13 }}>{m}</span>
                    </Space>
                    <Button type="text" size="small" danger onClick={() => handleRemoveMember(m)}>移除</Button>
                  </div>
                ))}
                {manageProject.members.length === 0 && (
                  <div style={{ color: "#bbb", fontSize: 13, textAlign: "center", padding: "16px 0" }}>暂无成员</div>
                )}
              </Space>
            </div>
          </Space>
        )}
      </Drawer>

      {/* 添加成员弹窗 */}
      <Modal title="添加成员" open={addMemberOpen}
        onOk={handleAddMember} onCancel={() => { setAddMemberOpen(false); setNewMember(""); }}
        okText="添加" cancelText="取消">
        <Select
          style={{ width: "100%", marginTop: 12 }}
          placeholder="选择或输入用户名"
          showSearch
          value={newMember || undefined}
          onChange={(v) => setNewMember(v)}
          options={ALL_USERS
            .filter((u) => !manageProject?.members.includes(u))
            .map((u) => ({ label: u, value: u }))}
        />
      </Modal>
    </section>
  );
};

export default ProjectsPage;
