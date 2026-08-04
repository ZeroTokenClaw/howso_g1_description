import { useState } from "react";
import {
  ArrowLeftOutlined, RightOutlined, CheckCircleFilled,
  CloseCircleFilled, PlusOutlined, RobotOutlined,
} from "@ant-design/icons";
import {
  Avatar, Button, Checkbox, message, Modal, Progress,
  Space, Tabs, Tag, Tooltip, Input, Select,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import {
  mockTasks, mockAnnotationItems,
  type MockTask, type MockAnnotationItem,
} from "@/mock/index";

// 鈹€鈹€鈹€ 棰滆壊宸ュ叿 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const AVATAR_COLORS = ["#2563eb", "#7c3aed", "#0891b2", "#059669", "#d97706", "#dc2626"];
const avatarColor = (name: string) => AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const STATUS_COLOR: Record<string, string> = {
  妫€鏌ヤ笉鍚堟牸: "#ef4444", 妫€鏌ュ悎鏍? "#2563eb", 宸插畬鎴? "#10b981",
  杩涜涓? "#f59e0b", 宸插垎閰? "#8b5cf6", 寰呭紑濮? "#6b7280",
};

const ANNOTATORS = ["iodemo", "puxk", "chenml", "marker", "picker", "auditor", "reviewer"];

// 鈹€鈹€鈹€ 鍙充晶淇℃伅闈㈡澘 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const InfoPanel = ({
  task,
  items,
  onEdit,
  onDelete,
}: {
  task: MockTask;
  items: MockAnnotationItem[];
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const [flowOpen, setFlowOpen] = useState(false);
  const passed = items.filter((i) => i.check_passed === true).length;
  const failed = items.filter((i) => i.check_passed === false).length;
  const total = items.length;
  const progress = total === 0 ? 0 : Math.round((passed / total) * 100);
  const statusColor = STATUS_COLOR[task.status] ?? "#6b7280";

  return (
    <div
      style={{
        width: 280,
        flexShrink: 0,
        background: "#fff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        overflow: "hidden",
        alignSelf: "flex-start",
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
        }}
      >
        <RobotOutlined style={{ fontSize: 48, color: "rgba(255,255,255,0.2)" }} />
      </div>

      <div style={{ padding: "14px 16px" }}>
        {/* title + progress */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <span style={{ fontWeight: 600, fontSize: 14, color: "#111827", flex: 1, marginRight: 8 }}>
            {task.name}
          </span>
          <span style={{ fontSize: 12, color: "#9ca3af", whiteSpace: "nowrap" }}>
            {passed} / {total}
          </span>
        </div>
        <Progress
          percent={progress}
          showInfo={false}
          strokeColor={statusColor}
          trailColor="#f3f4f6"
          size={["100%", 4]}
          style={{ marginBottom: 14 }}
        />

        {/* meta rows */}
        {[
          {
            label: "椤圭洰",
            value: (
              <span style={{
                background: task.project === "浜虹被鏁版嵁" ? "#dbeafe" : "#d1fae5",
                color: task.project === "浜虹被鏁版嵁" ? "#1d4ed8" : "#065f46",
                padding: "2px 10px", borderRadius: 10, fontSize: 12, fontWeight: 500,
              }}>
                {task.project}
              </span>
            ),
          },
          {
            label: "鏍囨敞鍛?,
            value: (
              <Space size={4}>
                <Avatar size={20} style={{ background: avatarColor(task.annotator), fontSize: 10 }}>
                  {task.annotator.slice(0, 2).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: 13 }}>{task.annotator}</span>
              </Space>
            ),
          },
          {
            label: "瀹℃牳鍛?,
            value: (
              <Space size={4}>
                <Avatar size={20} style={{ background: avatarColor(task.auditor), fontSize: 10 }}>
                  {task.auditor.slice(0, 2).toUpperCase()}
                </Avatar>
                <span style={{ fontSize: 13 }}>{task.auditor}</span>
              </Space>
            ),
          },
        ].map(({ label, value }) => (
          <div
            key={label}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13,
            }}
          >
            <span style={{ color: "#6b7280" }}>{label}</span>
            {value}
          </div>
        ))}

        {/* actions */}
        <div style={{ marginTop: 4 }}>
          {[
            { label: "缂栬緫浠诲姟", color: "#2563eb", onClick: onEdit },
            { label: "鍒犻櫎浠诲姟", color: "#ef4444", onClick: onDelete },
          ].map(({ label, color, onClick }) => (
            <button
              key={label}
              type="button"
              onClick={onClick}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                width: "100%", padding: "11px 0",
                background: "none", border: "none", borderBottom: "1px solid #f3f4f6",
                cursor: "pointer", color, fontSize: 14, fontWeight: 500,
              }}
            >
              {label}
              <RightOutlined style={{ fontSize: 12 }} />
            </button>
          ))}

          {/* 褰撳墠娴佺▼ */}
          <button
            type="button"
            onClick={() => setFlowOpen((v) => !v)}
            style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              width: "100%", padding: "11px 0",
              background: "none", border: "none",
              cursor: "pointer", fontSize: 14, fontWeight: 500,
            }}
          >
            <span style={{ color: "#ef4444" }}>
              褰撳墠娴佺▼ <span style={{ color: "#6b7280", fontWeight: 400, fontSize: 12 }}>{task.status}</span>
            </span>
            <span style={{ color: "#6b7280", fontSize: 12 }}>{flowOpen ? "鈻? : "鈻?}</span>
          </button>
          {flowOpen && (
            <div style={{ padding: "8px 0 4px", display: "flex", flexDirection: "column", gap: 6 }}>
              {["寰呭紑濮?, "杩涜涓?, "宸插垎閰?, "寰呮鏌?, "妫€鏌ュ悎鏍?, "妫€鏌ヤ笉鍚堟牸", "宸插畬鎴?].map((s) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "#6b7280" }}>
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: s === task.status ? (STATUS_COLOR[s] ?? "#6b7280") : "#e5e7eb",
                    flexShrink: 0,
                  }} />
                  <span style={{ color: s === task.status ? (STATUS_COLOR[s] ?? "#6b7280") : "#9ca3af", fontWeight: s === task.status ? 600 : 400 }}>
                    {s}
                  </span>
                  {s === task.status && <Tag style={{ fontSize: 10, padding: "0 4px", marginLeft: "auto" }} color="default">褰撳墠</Tag>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 鈹€鈹€鈹€ 鏍囨敞鏁版嵁 Tab 鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const AnnotationDataTab = ({
  items,
  taskId,
  passed,
  failed,
  onClearAnnotation,
  onRemove,
  onDelete,
}: {
  items: MockAnnotationItem[];
  taskId: string;
  passed: number;
  failed: number;
  onClearAnnotation: (id: string) => void;
  onRemove: (id: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const hasSelection = selectedKeys.length > 0;

  return (
    <div>
      {/* table */}
      <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8, overflow: "hidden" }}>
        {/* header */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "44px 1fr 100px 100px 100px 100px 180px",
          padding: "10px 16px",
          background: "#f9fafb",
          borderBottom: "1px solid #e5e7eb",
          fontSize: 12, color: "#6b7280", fontWeight: 600,
        }}>
          <span>
            <Checkbox
              checked={items.length > 0 && items.every((i) => selectedKeys.includes(i.id))}
              indeterminate={items.some((i) => selectedKeys.includes(i.id)) && !items.every((i) => selectedKeys.includes(i.id))}
              onChange={(e) => setSelectedKeys(e.target.checked ? items.map((i) => i.id) : [])}
            />
          </span>
          <span>鏁版嵁</span>
          <span>鍐呭鏃堕暱</span>
          <span>鏍囨敞鏃堕暱</span>
          <span>鏍囨敞鏁伴噺</span>
          <span>妫€鏌ョ粨鏋?/span>
          <span>鎿嶄綔</span>
        </div>

        {items.length === 0 && (
          <div style={{ textAlign: "center", color: "#9ca3af", padding: "40px 0", fontSize: 14 }}>
            鏆傛棤鏍囨敞鏁版嵁
          </div>
        )}

        {items.map((item, idx) => (
          <div
            key={item.id}
            style={{
              display: "grid",
              gridTemplateColumns: "44px 1fr 100px 100px 100px 100px 180px",
              padding: "12px 16px",
              borderBottom: idx < items.length - 1 ? "1px solid #f3f4f6" : "none",
              alignItems: "center",
              fontSize: 13,
            }}
          >
            <span>
              <Checkbox
                checked={selectedKeys.includes(item.id)}
                onChange={(e) =>
                  setSelectedKeys(e.target.checked
                    ? [...selectedKeys, item.id]
                    : selectedKeys.filter((k) => k !== item.id))
                }
              />
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <button type="button"
                style={{ background: "none", border: 0, color: "#2563eb", cursor: "pointer", fontSize: 13, padding: 0, textAlign: "left" }}
                onClick={() => {
                  const STUDIO_URLS: Record<string, string> = {
                    "20250328_FrankaPanda_02": "http://ai.yun36.com:8765/studio?ds=remote-file&ds.url=https%3A%2F%2Fio-sample-data-sh-1328702871.cos.ap-shanghai.myqcloud.com%2Fusers%2Fpuxk%2FFrankaPanda_250328_032547_0.mcap&ds.name=20250328_FrankaPanda_02&autoplay=y",
                    "episode_00048_2026_02_09_12_17_58": "http://ai.yun36.com:8765/studio?ds=remote-file&ds.url=https%3A%2F%2Fio-sample-data-sh-1328702871.cos.ap-shanghai.myqcloud.com%2Fusers%2Fiodemo%2Fdatasets%2Fepisode_00048_2026_02_09_12_17_58.mcap&ds.name=episode_00048_2026_02_09_12_17_58&autoplay=y",
                  };
                  const url = STUDIO_URLS[item.dataset_name];
                  if (url) window.open(url, "_blank", "noopener,noreferrer");
                }}
              >
                {item.dataset_name}
              </button>
              {/* online indicator */}
              <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#10b981", flexShrink: 0, display: "inline-block" }} />
              {item.tags.map((t) => (
                <span key={t} style={{ background: "#f3f4f6", color: "#555", padding: "1px 7px", borderRadius: 10, fontSize: 11 }}>{t}</span>
              ))}
            </span>
            <span style={{ color: "#374151" }}>{item.content_duration}</span>
            <span style={{ color: "#374151" }}>{item.annotation_duration}</span>
            <span style={{ color: "#2563eb", fontWeight: 500 }}>{item.annotation_count} 鏉?/span>
            <span>
              {item.check_passed === true && (
                <Tooltip title="妫€鏌ュ悎鏍?>
                  <CheckCircleFilled style={{ color: "#10b981", fontSize: 18 }} />
                </Tooltip>
              )}
              {item.check_passed === false && (
                <Tooltip title="妫€鏌ヤ笉鍚堟牸">
                  <CloseCircleFilled style={{ color: "#ef4444", fontSize: 18 }} />
                </Tooltip>
              )}
              {item.check_passed === null && <span style={{ color: "#d1d5db", fontSize: 12 }}>鈥?/span>}
            </span>
            <span>
              <Space size={0}>
                <Button type="link" size="small" style={{ color: "#2563eb", padding: "0 8px 0 0" }}>
                  缁х画鏍囨敞
                </Button>
                <Button type="link" size="small" style={{ color: "#9ca3af", padding: "0 8px" }}>
                  鑷姩鏍囨敞
                </Button>
              </Space>
            </span>
          </div>
        ))}
      </div>

      {/* footer summary + batch actions */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 0", marginTop: 4, flexWrap: "wrap", gap: 8,
      }}>
        <span style={{ fontSize: 13, color: "#6b7280" }}>
          鍏眥items.length}鏉℃暟鎹畕" "}
          <button type="button" style={{ background: "none", border: 0, color: "#10b981", cursor: "pointer", fontSize: 13, padding: 0 }}>
            {passed}鏉℃鏌ュ悎鏍?
          </button>
          {" "}
          <button type="button" style={{ background: "none", border: 0, color: "#ef4444", cursor: "pointer", fontSize: 13, padding: 0 }}>
            {failed}鏉℃鏌ヤ笉鍚堟牸
          </button>
        </span>
        <Space size={8}>
          <span style={{ fontSize: 13, color: "#9ca3af" }}>
            {hasSelection ? `宸查€?${selectedKeys.length} 鏉 : "璇烽€夋嫨瑕佹搷浣滅殑鏁版嵁"}
          </span>
          <Button
            size="small" icon={<span style={{ fontSize: 11 }}>鉁?/span>}
            disabled={!hasSelection}
            onClick={() => { selectedKeys.forEach((k) => onClearAnnotation(k)); setSelectedKeys([]); }}
          >
            娓呯┖鏍囨敞
          </Button>
          <Button
            size="small" danger disabled={!hasSelection}
            onClick={() => { selectedKeys.forEach((k) => onRemove(k)); setSelectedKeys([]); }}
          >
            浠庝换鍔′腑绉婚櫎
          </Button>
          <Button
            size="small" danger disabled={!hasSelection}
            onClick={() => { selectedKeys.forEach((k) => onDelete(k)); setSelectedKeys([]); }}
          >
            鍒犻櫎鏁版嵁
          </Button>
        </Space>
      </div>
    </div>
  );
};

// 鈹€鈹€鈹€ 涓婚〉闈?鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€鈹€

const AnnotationTaskDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [tasks, setTasks] = useState<MockTask[]>(mockTasks);
  const [allItems, setAllItems] = useState<MockAnnotationItem[]>(mockAnnotationItems);
  const [activeTab, setActiveTab] = useState("data");
  const [editOpen, setEditOpen] = useState(false);
  const [editTask, setEditTask] = useState<MockTask | null>(null);

  const task = tasks.find((t) => t.id === id) ?? null;
  const items = allItems.filter((i) => i.task_id === id);
  const passed = items.filter((i) => i.check_passed === true).length;
  const failed = items.filter((i) => i.check_passed === false).length;

  if (!task) {
    return (
      <div style={{ padding: 48, textAlign: "center", color: "#9ca3af" }}>
        浠诲姟涓嶅瓨鍦?
        <br />
        <Button type="link" onClick={() => navigate("/annotation-task")}>杩斿洖鍒楄〃</Button>
      </div>
    );
  }

  const handleEdit = () => {
    setEditTask({ ...task });
    setEditOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editTask) return;
    setTasks(tasks.map((t) => t.id === editTask.id ? editTask : t));
    message.success("宸蹭繚瀛?);
    setEditOpen(false);
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "纭鍒犻櫎浠诲姟锛?,
      content: "姝ゆ搷浣滀笉鍙挙閿€",
      okText: "鍒犻櫎", okType: "danger", cancelText: "鍙栨秷",
      onOk: () => {
        setTasks(tasks.filter((t) => t.id !== id));
        message.success("宸插垹闄?);
        navigate("/annotation-task");
      },
    });
  };

  const handleClearAnnotation = (itemId: string) => {
    setAllItems(allItems.map((i) => i.id === itemId ? { ...i, annotation_count: 0, check_passed: null } : i));
    message.success("宸叉竻绌烘爣娉?);
  };

  const handleRemoveItem = (itemId: string) => {
    setAllItems(allItems.filter((i) => i.id !== itemId));
    message.success("宸蹭粠浠诲姟涓Щ闄?);
  };

  const handleDeleteItem = (itemId: string) => {
    setAllItems(allItems.filter((i) => i.id !== itemId));
    message.success("宸插垹闄?);
  };

  const TABS = [
    { key: "data",     label: "鏍囨敞鏁版嵁" },
    { key: "batch",    label: "鎵归噺鏍囨敞" },
    { key: "issues",   label: "闂鏍囨敞" },
    { key: "stats",    label: "鏍囨敞缁熻" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", padding: "0 0 40px" }}>

      {/* 鈹€鈹€ 闈㈠寘灞?+ 椤堕儴 Tab 鈹€鈹€ */}
      <div style={{ background: "#fff", borderBottom: "1px solid #e5e7eb", padding: "0 24px" }}>
        {/* breadcrumb */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "14px 0 0", fontSize: 13, color: "#6b7280" }}>
          <button
            type="button"
            style={{ background: "none", border: 0, cursor: "pointer", color: "#6b7280", padding: 0, display: "flex", alignItems: "center" }}
            onClick={() => navigate("/annotation-task")}
          >
            <ArrowLeftOutlined style={{ fontSize: 14 }} />
          </button>
          <span style={{ color: "#9ca3af" }}>/</span>
          <button type="button" style={{ background: "none", border: 0, cursor: "pointer", color: "#6b7280", padding: 0, fontSize: 13 }}
            onClick={() => navigate("/annotation-task")}>
            鏍囨敞浠诲姟
          </button>
          <span style={{ color: "#9ca3af" }}>/</span>
          <button type="button" style={{ background: "none", border: 0, cursor: "pointer", color: "#6b7280", padding: 0, fontSize: 13 }}>
            {task.project}
          </button>
          <span style={{ color: "#9ca3af" }}>/</span>
          <span style={{ color: "#111827", fontWeight: 500 }}>{task.name}</span>
        </div>

        {/* tabs */}
        <div style={{ display: "flex", gap: 0, marginTop: 4 }}>
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: "10px 18px",
                background: "none", border: "none",
                borderBottom: activeTab === tab.key ? "2px solid #2563eb" : "2px solid transparent",
                color: activeTab === tab.key ? "#2563eb" : "#6b7280",
                fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: "pointer", fontSize: 14,
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 鈹€鈹€ 涓讳綋 鈹€鈹€ */}
      <div style={{ display: "flex", gap: 20, padding: "20px 24px", alignItems: "flex-start" }}>

        {/* left content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {activeTab === "data" && (
            <AnnotationDataTab
              items={items}
              taskId={id!}
              passed={passed}
              failed={failed}
              onClearAnnotation={handleClearAnnotation}
              onRemove={handleRemoveItem}
              onDelete={handleDeleteItem}
            />
          )}

          {activeTab === "batch" && (
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: "32px 24px", textAlign: "center", color: "#9ca3af" }}>
              <PlusOutlined style={{ fontSize: 32, marginBottom: 12, display: "block" }} />
              鎵归噺鏍囨敞鍔熻兘寮€鍙戜腑
            </div>
          )}

          {activeTab === "issues" && (
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: "32px 24px" }}>
              <div style={{ fontWeight: 600, marginBottom: 16, fontSize: 15 }}>闂鏍囨敞鍒楄〃</div>
              {items.filter((i) => i.check_passed === false).length === 0 ? (
                <div style={{ textAlign: "center", color: "#9ca3af", padding: "24px 0" }}>鏆傛棤闂鏍囨敞</div>
              ) : (
                items.filter((i) => i.check_passed === false).map((item) => (
                  <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f4f6", fontSize: 13 }}>
                    <CloseCircleFilled style={{ color: "#ef4444" }} />
                    <span style={{ color: "#2563eb" }}>{item.dataset_name}</span>
                    <span style={{ color: "#9ca3af" }}>{item.annotation_count} 鏉℃爣娉?/span>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "stats" && (
            <div style={{ background: "#fff", borderRadius: 8, border: "1px solid #e5e7eb", padding: 24 }}>
              <div style={{ fontWeight: 600, marginBottom: 20, fontSize: 15 }}>鏍囨敞缁熻</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                {[
                  { label: "鎬绘暟鎹噺", value: items.length, color: "#2563eb" },
                  { label: "宸插畬鎴?, value: items.filter((i) => i.status === "宸插畬鎴?).length, color: "#10b981" },
                  { label: "妫€鏌ュ悎鏍?, value: passed, color: "#10b981" },
                  { label: "妫€鏌ヤ笉鍚堟牸", value: failed, color: "#ef4444" },
                ].map(({ label, value, color }) => (
                  <div key={label} style={{ background: "#f9fafb", borderRadius: 8, padding: 16, textAlign: "center" }}>
                    <div style={{ fontSize: 28, fontWeight: 700, color }}>{value}</div>
                    <div style={{ fontSize: 13, color: "#6b7280", marginTop: 4 }}>{label}</div>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 20 }}>
                <div style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>瀹屾垚杩涘害</div>
                <Progress
                  percent={items.length === 0 ? 0 : Math.round((items.filter((i) => i.status === "宸插畬鎴?).length / items.length) * 100)}
                  strokeColor="#10b981"
                  style={{ marginBottom: 4 }}
                />
              </div>
            </div>
          )}
        </div>

        {/* right panel */}
        <InfoPanel
          task={task}
          items={items}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
};

export default AnnotationTaskDetailPage;
       