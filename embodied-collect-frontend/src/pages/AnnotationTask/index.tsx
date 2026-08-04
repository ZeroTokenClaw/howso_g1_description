import { useState } from "react";
import {
  PlusOutlined, BarsOutlined, AppstoreOutlined, FilterOutlined, RightOutlined,
} from "@ant-design/icons";
import {
  Avatar, Button, Checkbox, Input, message, Modal, Select, Space, Progress,
} from "antd";
import { useNavigate } from "react-router-dom";
import { mockTasks, type MockTask } from "@/mock/index";

// ─── 常量 ──────────────────────────────────────────────────────────────────────

const PROJECTS = [
  { label: "全部项目", badge: "" },
  { label: "USER_IAWBAM", badge: "个人空间" },
  { label: "遥操作", badge: "共享" },
  { label: "人类数据", badge: "共享" },
];

const TABS = [
  { key: "all",     label: "全部任务",   statuses: [] },
  { key: "pending", label: "待开始",     statuses: ["待开始"] },
  { key: "working", label: "工作中",     statuses: ["进行中"] },
  { key: "review",  label: "待检查",     statuses: ["已分配"] },
  { key: "failed",  label: "检查不合格", statuses: ["检查不合格"] },
  { key: "passed",  label: "检查合格",   statuses: ["检查合格"] },
  { key: "submitted", label: "提交数据", statuses: ["已完成"] },
];

const STATUS_GROUP_COLOR: Record<string, { border: string; label: string; text: string }> = {
  检查不合格: { border: "#ef4444", label: "#ef4444", text: "#ef4444" },
  检查合格:   { border: "#2563eb", label: "#2563eb", text: "#2563eb" },
  已完成:     { border: "#10b981", label: "#10b981", text: "#10b981" },
  进行中:     { border: "#f59e0b", label: "#f59e0b", text: "#f59e0b" },
  已分配:     { border: "#8b5cf6", label: "#8b5cf6", text: "#8b5cf6" },
  待开始:     { border: "#6b7280", label: "#6b7280", text: "#6b7280" },
};

const STATUS_PROGRESS_COLOR: Record<string, string> = {
  检查不合格: "#ef4444",
  检查合格:   "#2563eb",
  已完成:     "#10b981",
  进行中:     "#f59e0b",
  已分配:     "#8b5cf6",
  待开始:     "#6b7280",
};

// 头像颜色池
const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"];
const avatarColor = (name: string) =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const ANNOTATORS = ["iodemo", "puxk", "chenml", "marker", "picker"];
const PAGE_SIZE = 25;

// ─── 卡片组件 ─────────────────────────────────────────────────────────────────

const TaskCard = ({
  task,
  selected,
  onSelect,
  onEdit,
  onDelete,
  onClick,
}: {
  task: MockTask;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  onDelete: () => void;
  onClick: () => void;
}) => {
  const color = STATUS_PROGRESS_COLOR[task.status] ?? "#6b7280";
  const progress = task.status === "已完成" ? 100
    : task.status === "检查合格" ? 80
    : task.status === "进行中" ? 50
    : task.status === "已分配" ? 20
    : task.status === "检查不合格" ? 60
    : 0;

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fff",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* thumbnail */}
      <div
        style={{
          height: 160,
          background: "linear-gradient(135deg, #1e293b 0%, #334155 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {task.thumbnail ? (
          task.thumbnail.endsWith(".mp4") ? (
            <video
              src={task.thumbnail}
              muted
              autoPlay
              loop
              playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          ) : (
            <img
              src={task.thumbnail}
              alt={task.name}
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          )
        ) : (
          <div style={{ fontSize: 36, opacity: 0.2 }}>🤖</div>
        )}
        {/* checkbox */}
        <div style={{ position: "absolute", top: 10, left: 10 }}>
          <Checkbox checked={selected} onChange={(e) => onSelect(e.target.checked)} />
        </div>
      </div>

      {/* body */}
      <div style={{ padding: "12px 14px 14px" }}>
        <button
          type="button"
          onClick={onClick}
          style={{ background: "none", border: 0, padding: 0, cursor: "pointer", textAlign: "left", fontWeight: 600, fontSize: 14, marginBottom: 4, color: "#2563eb", width: "100%" }}
        >
          {task.name}
        </button>
        <div style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10 }}>
          {task.count} / {task.count} 条
        </div>

        {/* progress */}
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={color}
          trailColor="#f3f4f6"
          size={["100%", 4]}
          style={{ marginBottom: 12 }}
        />

        {/* meta */}
        <div style={{ fontSize: 12, color: "#6b7280", display: "flex", flexDirection: "column", gap: 6 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span>项目</span>
            <span
              style={{
                background: task.project === "人类数据" ? "#dbeafe" : "#d1fae5",
                color: task.project === "人类数据" ? "#1d4ed8" : "#065f46",
                padding: "1px 8px",
                borderRadius: 10,
                fontSize: 11,
                fontWeight: 500,
              }}
            >
              {task.project}
            </span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>标注员</span>
            <Space size={4}>
              <Avatar size={18} style={{ background: avatarColor(task.annotator), fontSize: 10 }}>
                {task.annotator[0].toUpperCase()}
              </Avatar>
              <span>{task.annotator}</span>
            </Space>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span>审核员</span>
            <Space size={4}>
              <Avatar size={18} style={{ background: avatarColor(task.auditor), fontSize: 10 }}>
                {task.auditor[0].toUpperCase()}
              </Avatar>
              <span>{task.auditor}</span>
            </Space>
          </div>
        </div>

        <div
          style={{
            marginTop: 10,
            paddingTop: 10,
            borderTop: "1px solid #f3f4f6",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ fontSize: 11, color: "#9ca3af" }}>
            创建于{task.created}
          </span>
          <Checkbox style={{ fontSize: 11, color: "#9ca3af" }}>
            <span style={{ fontSize: 11 }}></span>
          </Checkbox>
        </div>
      </div>
    </div>
  );
};

// ─── 主页面 ───────────────────────────────────────────────────────────────────

const AnnotationTaskPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<MockTask[]>(mockTasks);
  const [keyword, setKeyword] = useState("");
  const [annotatorFilter, setAnnotatorFilter] = useState<string | undefined>();
  const [auditorFilter, setAuditorFilter] = useState<string | undefined>();
  const [activeTab, setActiveTab] = useState("all");
  const [activeProject, setActiveProject] = useState("全部项目");
  const [viewMode, setViewMode] = useState<"list" | "grid">("grid");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [page, setPage] = useState(1);

  // create modal
  const [createOpen, setCreateOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAnnotator, setNewAnnotator] = useState("");
  const [newAuditor, setNewAuditor] = useState("");
  const [newDataset, setNewDataset] = useState("");

  // edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<MockTask | null>(null);

  // ── filtering ──
  const filtered = tasks.filter((t) => {
    if (keyword && !t.name.toLowerCase().includes(keyword.toLowerCase())) return false;
    if (annotatorFilter && t.annotator !== annotatorFilter) return false;
    if (auditorFilter && t.auditor !== auditorFilter) return false;
    if (activeProject !== "全部项目" && activeProject !== "USER_IAWBAM") {
      if (t.project !== activeProject) return false;
    }
    const tab = TABS.find((tb) => tb.key === activeTab);
    if (tab && tab.statuses.length > 0 && !tab.statuses.includes(t.status)) return false;
    return true;
  });

  const tabCount = (statuses: string[]) =>
    tasks.filter((t) => statuses.length === 0 || statuses.includes(t.status)).length;

  const pageRows = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE) || 1;

  // group by status for grid view
  const statusGroups = Array.from(new Set(pageRows.map((t) => t.status)));

  const handleCreate = () => {
    if (!newName.trim()) { message.warning("请输入任务名称"); return; }
    const t: MockTask = {
      id: `t${Date.now()}`, name: newName,
      annotator: newAnnotator || "—", auditor: newAuditor || "—",
      status: "待开始", count: 0,
      dataset: newDataset || "—", project: "遥操作",
      created: new Date().toLocaleDateString("zh-CN"),
    };
    setTasks([t, ...tasks]);
    message.success("标注任务已创建");
    setCreateOpen(false);
    setNewName(""); setNewAnnotator(""); setNewAuditor(""); setNewDataset("");
  };

  const handleDelete = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
    message.success("已删除");
  };

  const handleSaveEdit = () => {
    if (!editTask) return;
    setTasks(tasks.map((t) => t.id === editTask.id ? editTask : t));
    message.success("已保存");
    setEditOpen(false);
  };

  const handleReset = () => {
    setKeyword("");
    setAnnotatorFilter(undefined);
    setAuditorFilter(undefined);
  };

  return (
    <section style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* ── 项目 scope bar ── */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 0,
          padding: "0 24px",
          background: "#fff",
          borderBottom: "1px solid #f0f2f5",
        }}
      >
        <span style={{ fontSize: 13, color: "#888", marginRight: 16 }}>选择项目：</span>
        {PROJECTS.map(({ label, badge }) => (
          <button
            key={label}
            type="button"
            onClick={() => { setActiveProject(label); setPage(1); }}
            style={{
              padding: "12px 16px",
              background: "none",
              border: "none",
              borderBottom: activeProject === label ? "2px solid #10b981" : "2px solid transparent",
              color: activeProject === label ? "#10b981" : "#555",
              fontWeight: activeProject === label ? 600 : 400,
              cursor: "pointer",
              fontSize: 13,
              display: "flex",
              alignItems: "center",
              gap: 6,
              whiteSpace: "nowrap",
            }}
          >
            {label}
            {badge && (
              <span
                style={{
                  fontSize: 10,
                  padding: "1px 6px",
                  borderRadius: 8,
                  border: `1px solid ${activeProject === label ? "#10b981" : "#d1d5db"}`,
                  color: activeProject === label ? "#10b981" : "#9ca3af",
                }}
              >
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px 24px" }}>

        {/* ── 搜索栏 ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
            flexWrap: "wrap",
            gap: 10,
          }}
        >
          <Space size={10} wrap>
            <Input
              placeholder="任务名"
              value={keyword}
              onChange={(e) => { setKeyword(e.target.value); setPage(1); }}
              allowClear
              style={{ width: 200, height: 36 }}
            />
            <Select
              placeholder="标注员"
              allowClear
              value={annotatorFilter}
              onChange={(v) => { setAnnotatorFilter(v); setPage(1); }}
              style={{ width: 130, height: 36 }}
              options={ANNOTATORS.map((a) => ({ label: a, value: a }))}
            />
            <Select
              placeholder="审核员"
              allowClear
              value={auditorFilter}
              onChange={(v) => { setAuditorFilter(v); setPage(1); }}
              style={{ width: 130, height: 36 }}
              options={ANNOTATORS.map((a) => ({ label: a, value: a }))}
            />
            <Button
              icon={<FilterOutlined />}
              onClick={handleReset}
              style={{ height: 36, color: "#6b7280" }}
            >
              重置
            </Button>
          </Space>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#2563eb", height: 36 }}
            onClick={() => setCreateOpen(true)}
          >
            创建标注任务
          </Button>
        </div>

        {/* ── Tab 栏 ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #e5e7eb",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 0 }}>
            {TABS.map((tab) => {
              const count = tasks.filter((t) => {
                if (tab.statuses.length === 0) return true;
                return tab.statuses.includes(t.status);
              }).length;
              return (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => { setActiveTab(tab.key); setPage(1); }}
                  style={{
                    padding: "10px 16px",
                    background: "none",
                    border: "none",
                    borderBottom: activeTab === tab.key ? "2px solid #2563eb" : "2px solid transparent",
                    color: activeTab === tab.key ? "#2563eb" : "#6b7280",
                    fontWeight: activeTab === tab.key ? 600 : 400,
                    cursor: "pointer",
                    fontSize: 13,
                    whiteSpace: "nowrap",
                  }}
                >
                  {tab.label}
                  <span
                    style={{
                      marginLeft: 6,
                      background: activeTab === tab.key ? "#dbeafe" : "#f3f4f6",
                      color: activeTab === tab.key ? "#2563eb" : "#9ca3af",
                      borderRadius: 10,
                      padding: "1px 7px",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* 视图切换 */}
          <div style={{ display: "flex", gap: 4, paddingBottom: 4 }}>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              style={{
                width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6,
                background: viewMode === "list" ? "#f3f4f6" : "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: viewMode === "list" ? "#2563eb" : "#9ca3af",
              }}
            >
              <BarsOutlined />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("grid")}
              style={{
                width: 32, height: 32, border: "1px solid #e5e7eb", borderRadius: 6,
                background: viewMode === "grid" ? "#f3f4f6" : "#fff",
                cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
                color: viewMode === "grid" ? "#2563eb" : "#9ca3af",
              }}
            >
              <AppstoreOutlined />
            </button>
          </div>
        </div>

        {/* ── 卡片视图：按状态分组 ── */}
        {viewMode === "grid" ? (
          <div>
            {statusGroups.length === 0 && (
              <div style={{ textAlign: "center", color: "#9ca3af", padding: "60px 0", fontSize: 14 }}>
                暂无标注任务
              </div>
            )}
            {statusGroups.map((status) => {
              const groupTasks = pageRows.filter((t) => t.status === status);
              const cfg = STATUS_GROUP_COLOR[status] ?? { border: "#6b7280", label: "#6b7280", text: "#6b7280" };
              return (
                <div key={status} style={{ marginBottom: 28 }}>
                  {/* group header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "10px 14px",
                      background: "#fff",
                      border: "1px solid #e5e7eb",
                      borderLeft: `3px solid ${cfg.border}`,
                      borderRadius: "6px 6px 0 0",
                      cursor: "pointer",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Checkbox
                        checked={groupTasks.every((t) => selectedKeys.includes(t.id))}
                        indeterminate={
                          groupTasks.some((t) => selectedKeys.includes(t.id)) &&
                          !groupTasks.every((t) => selectedKeys.includes(t.id))
                        }
                        onChange={(e) =>
                          setSelectedKeys(
                            e.target.checked
                              ? [...new Set([...selectedKeys, ...groupTasks.map((t) => t.id)])]
                              : selectedKeys.filter((k) => !groupTasks.find((t) => t.id === k)),
                          )
                        }
                      />
                      <span style={{ fontWeight: 600, color: cfg.label, fontSize: 14 }}>
                        {status}
                      </span>
                      <span
                        style={{
                          background: cfg.border + "22",
                          color: cfg.label,
                          borderRadius: 10,
                          padding: "1px 8px",
                          fontSize: 12,
                          fontWeight: 600,
                        }}
                      >
                        {groupTasks.length}
                      </span>
                    </div>
                    <RightOutlined style={{ color: "#9ca3af", fontSize: 12 }} />
                  </div>

                  {/* cards */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                      gap: 12,
                      padding: "12px 0 0",
                    }}
                  >
                    {groupTasks.map((task) => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        selected={selectedKeys.includes(task.id)}
                        onSelect={(checked) =>
                          setSelectedKeys(
                            checked
                              ? [...selectedKeys, task.id]
                              : selectedKeys.filter((k) => k !== task.id),
                          )
                        }
                        onEdit={() => { setEditTask({ ...task }); setEditOpen(true); }}
                        onDelete={() => handleDelete(task.id)}
                        onClick={() => navigate(`/annotation-task/${task.id}`)}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* ── 列表视图 ── */
          <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", overflow: "hidden" }}>
            {/* header */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "40px 1fr 200px 100px 130px 130px 120px 100px 120px 140px",
                padding: "10px 16px",
                background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
                fontSize: 12,
                color: "#6b7280",
                fontWeight: 600,
              }}
            >
              <span><Checkbox onChange={(e) => setSelectedKeys(e.target.checked ? filtered.map((t) => t.id) : [])} /></span>
              <span>任务名称</span>
              <span>数据集</span>
              <span>项目</span>
              <span>标注员</span>
              <span>审核员</span>
              <span>状态</span>
              <span>数据量</span>
              <span>创建时间</span>
              <span>操作</span>
            </div>
            {pageRows.length === 0 && (
              <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: 14 }}>暂无标注任务</div>
            )}
            {pageRows.map((task, i) => {
              const cfg = STATUS_GROUP_COLOR[task.status] ?? { border: "#6b7280", label: "#6b7280", text: "#6b7280" };
              return (
                <div
                  key={task.id}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "40px 1fr 200px 100px 130px 130px 120px 100px 120px 140px",
                    padding: "12px 16px",
                    borderBottom: i < pageRows.length - 1 ? "1px solid #f3f4f6" : "none",
                    fontSize: 13,
                    alignItems: "center",
                  }}
                >
                  <span>
                    <Checkbox
                      checked={selectedKeys.includes(task.id)}
                      onChange={(e) =>
                        setSelectedKeys(e.target.checked
                          ? [...selectedKeys, task.id]
                          : selectedKeys.filter((k) => k !== task.id))
                      }
                    />
                  </span>
                  <button
                    type="button"
                    style={{ background: "none", border: 0, color: "#2563eb", cursor: "pointer", textAlign: "left", fontSize: 13 }}
                    onClick={() => navigate(`/annotation-task/${task.id}`)}
                  >
                    {task.name}
                  </button>
                  <span style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {task.dataset}
                  </span>
                  <span>
                    <span style={{
                      background: task.project === "人类数据" ? "#dbeafe" : "#d1fae5",
                      color: task.project === "人类数据" ? "#1d4ed8" : "#065f46",
                      padding: "2px 8px", borderRadius: 10, fontSize: 11, fontWeight: 500,
                    }}>
                      {task.project}
                    </span>
                  </span>
                  <span>
                    <Space size={4}>
                      <Avatar size={20} style={{ background: avatarColor(task.annotator), fontSize: 10 }}>
                        {task.annotator[0].toUpperCase()}
                      </Avatar>
                      <span style={{ fontSize: 12 }}>{task.annotator}</span>
                    </Space>
                  </span>
                  <span>
                    <Space size={4}>
                      <Avatar size={20} style={{ background: avatarColor(task.auditor), fontSize: 10 }}>
                        {task.auditor[0].toUpperCase()}
                      </Avatar>
                      <span style={{ fontSize: 12 }}>{task.auditor}</span>
                    </Space>
                  </span>
                  <span>
                    <span style={{
                      border: `1px solid ${cfg.border}`,
                      color: cfg.text,
                      padding: "2px 10px", borderRadius: 10, fontSize: 11, fontWeight: 500,
                    }}>
                      {task.status}
                    </span>
                  </span>
                  <span style={{ fontSize: 12, color: "#374151" }}>{task.count} 条</span>
                  <span style={{ fontSize: 12, color: "#6b7280" }}>{task.created}</span>
                  <span>
                    <Space>
                      <Button type="link" size="small" style={{ padding: 0 }}
                        onClick={() => { setEditTask({ ...task }); setEditOpen(true); }}>
                        编辑
                      </Button>
                      <Button type="link" size="small" danger style={{ padding: 0 }}
                        onClick={() => handleDelete(task.id)}>
                        删除
                      </Button>
                    </Space>
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* ── 分页 ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginTop: 20,
            padding: "12px 0",
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <Space size={8} align="center">
            <span style={{ fontSize: 13, color: "#6b7280" }}>每页显示</span>
            <Select
              size="small"
              value={PAGE_SIZE}
              style={{ width: 65 }}
              options={[{ label: "25", value: 25 }, { label: "50", value: 50 }]}
            />
            <span style={{ fontSize: 13, color: "#6b7280" }}>
              {filtered.length === 0 ? "0 条" : `${(page - 1) * PAGE_SIZE + 1}–${Math.min(page * PAGE_SIZE, filtered.length)} of ${filtered.length}`}
            </span>
          </Space>
          <Space size={4}>
            <Button size="small" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>‹</Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <Button
                key={p}
                size="small"
                type={p === page ? "primary" : "default"}
                onClick={() => setPage(p)}
                style={{ minWidth: 28 }}
              >
                {p}
              </Button>
            ))}
            <Button size="small" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>›</Button>
          </Space>
        </div>
      </div>

      {/* ── 创建任务 Modal ── */}
      <Modal
        title="创建标注任务"
        open={createOpen}
        onOk={handleCreate}
        onCancel={() => setCreateOpen(false)}
        okText="创建"
        cancelText="取消"
        okButtonProps={{ style: { background: "#2563eb" } }}
      >
        <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
          <Input placeholder="任务名称 *" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <Select placeholder="选择标注员" style={{ width: "100%" }} value={newAnnotator || undefined}
            onChange={(v) => setNewAnnotator(v)}
            options={ANNOTATORS.map((a) => ({ label: a, value: a }))} />
          <Select placeholder="选择审核员" style={{ width: "100%" }} value={newAuditor || undefined}
            onChange={(v) => setNewAuditor(v)}
            options={ANNOTATORS.map((a) => ({ label: a, value: a }))} />
          <Input placeholder="关联数据集名称" value={newDataset} onChange={(e) => setNewDataset(e.target.value)} />
        </Space>
      </Modal>

      {/* ── 编辑任务 Modal ── */}
      <Modal
        title="编辑标注任务"
        open={editOpen}
        onOk={handleSaveEdit}
        onCancel={() => setEditOpen(false)}
        okText="保存"
        cancelText="取消"
      >
        {editTask && (
          <Space direction="vertical" style={{ width: "100%", marginTop: 12 }} size={12}>
            <Input placeholder="任务名称" value={editTask.name}
              onChange={(e) => setEditTask({ ...editTask, name: e.target.value })} />
            <Select placeholder="标注员" style={{ width: "100%" }} value={editTask.annotator}
              onChange={(v) => setEditTask({ ...editTask, annotator: v })}
              options={ANNOTATORS.map((a) => ({ label: a, value: a }))} />
            <Select placeholder="审核员" style={{ width: "100%" }} value={editTask.auditor}
              onChange={(v) => setEditTask({ ...editTask, auditor: v })}
              options={ANNOTATORS.map((a) => ({ label: a, value: a }))} />
            <Select placeholder="状态" style={{ width: "100%" }} value={editTask.status}
              onChange={(v) => setEditTask({ ...editTask, status: v })}
              options={Object.keys(STATUS_GROUP_COLOR).map((s) => ({ label: s, value: s }))} />
          </Space>
        )}
      </Modal>
    </section>
  );
};

export default AnnotationTaskPage;
